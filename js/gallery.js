// 3D Gallery Component using Three.js
// Adapted from React Three Fiber implementation for vanilla JS

class Gallery3D {
    constructor(containerId, images, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container not found');
            return;
        }

        this.images = images;
        this.options = {
            speed: options.speed || 1,
            visibleCount: Math.min(options.visibleCount || 12, images.length),
            fadeSettings: options.fadeSettings || {
                fadeIn: { start: 0.05, end: 0.25 },
                fadeOut: { start: 0.4, end: 0.43 }
            },
            blurSettings: options.blurSettings || {
                blurIn: { start: 0.0, end: 0.1 },
                blurOut: { start: 0.4, end: 0.43 },
                maxBlur: 8.0
            }
        };

        this.scrollVelocity = 0;
        this.autoPlay = true;
        this.lastInteraction = Date.now();
        this.depthRange = 50;
        this.planes = [];
        this.materials = [];
        this.textures = [];
        
        this.init();
    }

    init() {
        // Setup scene
        this.scene = new THREE.Scene();
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            55,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 0);

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Load textures and create planes
        this.loadTextures();

        // Setup event listeners
        this.setupEventListeners();

        // Start animation
        this.animate();
    }

    createShaderMaterial() {
        return new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                map: { value: null },
                opacity: { value: 1.0 },
                blurAmount: { value: 0.0 },
                scrollForce: { value: 0.0 },
                time: { value: 0.0 },
                isHovered: { value: 0.0 }
            },
            vertexShader: `
                uniform float scrollForce;
                uniform float time;
                uniform float isHovered;
                varying vec2 vUv;
                varying vec3 vNormal;

                void main() {
                    vUv = uv;
                    vNormal = normal;
                    vec3 pos = position;

                    // Create smooth curving based on scroll force
                    float curveIntensity = scrollForce * 0.3;
                    float distanceFromCenter = length(pos.xy);
                    float curve = distanceFromCenter * distanceFromCenter * curveIntensity;

                    // Add gentle cloth-like ripples
                    float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
                    float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
                    float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;

                    // Flag waving effect when hovered
                    float flagWave = 0.0;
                    if (isHovered > 0.5) {
                        float wavePhase = pos.x * 3.0 + time * 8.0;
                        float waveAmplitude = sin(wavePhase) * 0.1;
                        float dampening = smoothstep(-0.5, 0.5, pos.x);
                        flagWave = waveAmplitude * dampening;
                        
                        float secondaryWave = sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
                        flagWave += secondaryWave;
                    }

                    // Apply Z displacement
                    pos.z -= (curve + clothEffect + flagWave);

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D map;
                uniform float opacity;
                uniform float blurAmount;
                uniform float scrollForce;
                varying vec2 vUv;
                varying vec3 vNormal;

                void main() {
                    vec4 color = texture2D(map, vUv);

                    // Simple blur approximation
                    if (blurAmount > 0.0) {
                        vec2 texelSize = vec2(1.0 / 512.0, 1.0 / 512.0);
                        vec4 blurred = vec4(0.0);
                        float total = 0.0;

                        for (float x = -2.0; x <= 2.0; x += 1.0) {
                            for (float y = -2.0; y <= 2.0; y += 1.0) {
                                vec2 offset = vec2(x, y) * texelSize * blurAmount;
                                float weight = 1.0 / (1.0 + length(vec2(x, y)));
                                blurred += texture2D(map, vUv + offset) * weight;
                                total += weight;
                            }
                        }
                        color = blurred / total;
                    }

                    // Add subtle lighting effect
                    float curveHighlight = abs(scrollForce) * 0.05;
                    color.rgb += vec3(curveHighlight * 0.1);

                    gl_FragColor = vec4(color.rgb, color.a * opacity);
                }
            `
        });
    }

    getSpatialPositions() {
        const positions = [];
        const maxHorizontalOffset = 8;
        const maxVerticalOffset = 8;

        for (let i = 0; i < this.options.visibleCount; i++) {
            const horizontalAngle = (i * 2.618) % (Math.PI * 2);
            const verticalAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
            const horizontalRadius = (i % 3) * 1.2;
            const verticalRadius = ((i + 1) % 4) * 0.8;

            const x = (Math.sin(horizontalAngle) * horizontalRadius * maxHorizontalOffset) / 3;
            const y = (Math.cos(verticalAngle) * verticalRadius * maxVerticalOffset) / 4;

            positions.push({ x, y });
        }

        return positions;
    }

    loadTextures() {
        const textureLoader = new THREE.TextureLoader();
        const spatialPositions = this.getSpatialPositions();
        let loadedCount = 0;

        this.images.forEach((imgUrl, index) => {
            textureLoader.load(
                imgUrl,
                (texture) => {
                    this.textures[index] = texture;
                    loadedCount++;

                    if (loadedCount === this.images.length) {
                        this.createPlanes(spatialPositions);
                    }
                },
                undefined,
                (error) => {
                    console.error('Error loading texture:', error);
                    loadedCount++;
                    
                    if (loadedCount === this.images.length) {
                        this.createPlanes(spatialPositions);
                    }
                }
            );
        });
    }

    createPlanes(spatialPositions) {
        for (let i = 0; i < this.options.visibleCount; i++) {
            const material = this.createShaderMaterial();
            this.materials.push(material);

            const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
            const mesh = new THREE.Mesh(geometry, material);

            const imageIndex = i % this.images.length;
            const texture = this.textures[imageIndex];

            if (texture) {
                material.uniforms.map.value = texture;

                // Calculate scale to maintain aspect ratio
                const aspect = texture.image ? texture.image.width / texture.image.height : 1;
                if (aspect > 1) {
                    mesh.scale.set(2 * aspect, 2, 1);
                } else {
                    mesh.scale.set(2, 2 / aspect, 1);
                }
            }

            const z = (this.depthRange / this.options.visibleCount) * i;
            const worldZ = z - this.depthRange / 2;
            
            mesh.position.set(
                spatialPositions[i].x,
                spatialPositions[i].y,
                worldZ
            );

            mesh.userData = {
                index: i,
                z: z,
                imageIndex: imageIndex,
                initialX: spatialPositions[i].x,
                initialY: spatialPositions[i].y
            };

            // Add hover interaction
            mesh.userData.isHovered = false;

            this.planes.push(mesh);
            this.scene.add(mesh);
        }
    }

    setupEventListeners() {
        // Wheel event
        this.container.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.scrollVelocity += e.deltaY * 0.01 * this.options.speed;
            this.autoPlay = false;
            this.lastInteraction = Date.now();
        }, { passive: false });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                this.scrollVelocity -= 2 * this.options.speed;
                this.autoPlay = false;
                this.lastInteraction = Date.now();
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                this.scrollVelocity += 2 * this.options.speed;
                this.autoPlay = false;
                this.lastInteraction = Date.now();
            }
        });

        // Touch events
        let touchStartY = 0;
        this.container.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });

        this.container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            this.scrollVelocity += deltaY * 0.02 * this.options.speed;
            touchStartY = touchY;
            this.autoPlay = false;
            this.lastInteraction = Date.now();
        }, { passive: false });

        // Raycaster for hover effects
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        });

        // Auto-play resume
        setInterval(() => {
            if (Date.now() - this.lastInteraction > 3000) {
                this.autoPlay = true;
            }
        }, 1000);
    }

    updatePlanes(delta) {
        const totalImages = this.images.length;
        const imageAdvance = this.options.visibleCount % totalImages || totalImages;

        this.planes.forEach((plane) => {
            let newZ = plane.userData.z + this.scrollVelocity * delta * 10;
            let wrapsForward = 0;
            let wrapsBackward = 0;

            if (newZ >= this.depthRange) {
                wrapsForward = Math.floor(newZ / this.depthRange);
                newZ -= this.depthRange * wrapsForward;
            } else if (newZ < 0) {
                wrapsBackward = Math.ceil(-newZ / this.depthRange);
                newZ += this.depthRange * wrapsBackward;
            }

            if (wrapsForward > 0 && imageAdvance > 0 && totalImages > 0) {
                plane.userData.imageIndex = (plane.userData.imageIndex + wrapsForward * imageAdvance) % totalImages;
                const texture = this.textures[plane.userData.imageIndex];
                if (texture && plane.material.uniforms.map) {
                    plane.material.uniforms.map.value = texture;
                }
            }

            if (wrapsBackward > 0 && imageAdvance > 0 && totalImages > 0) {
                const step = plane.userData.imageIndex - wrapsBackward * imageAdvance;
                plane.userData.imageIndex = ((step % totalImages) + totalImages) % totalImages;
                const texture = this.textures[plane.userData.imageIndex];
                if (texture && plane.material.uniforms.map) {
                    plane.material.uniforms.map.value = texture;
                }
            }

            plane.userData.z = ((newZ % this.depthRange) + this.depthRange) % this.depthRange;
            const worldZ = plane.userData.z - this.depthRange / 2;
            plane.position.z = worldZ;

            // Calculate opacity based on fade settings
            const normalizedPosition = plane.userData.z / this.depthRange;
            let opacity = 1;

            if (normalizedPosition >= this.options.fadeSettings.fadeIn.start && 
                normalizedPosition <= this.options.fadeSettings.fadeIn.end) {
                const fadeInProgress = (normalizedPosition - this.options.fadeSettings.fadeIn.start) / 
                    (this.options.fadeSettings.fadeIn.end - this.options.fadeSettings.fadeIn.start);
                opacity = fadeInProgress;
            } else if (normalizedPosition < this.options.fadeSettings.fadeIn.start) {
                opacity = 0;
            } else if (normalizedPosition >= this.options.fadeSettings.fadeOut.start && 
                       normalizedPosition <= this.options.fadeSettings.fadeOut.end) {
                const fadeOutProgress = (normalizedPosition - this.options.fadeSettings.fadeOut.start) / 
                    (this.options.fadeSettings.fadeOut.end - this.options.fadeSettings.fadeOut.start);
                opacity = 1 - fadeOutProgress;
            } else if (normalizedPosition > this.options.fadeSettings.fadeOut.end) {
                opacity = 0;
            }

            opacity = Math.max(0, Math.min(1, opacity));

            // Calculate blur
            let blur = 0;
            if (normalizedPosition >= this.options.blurSettings.blurIn.start && 
                normalizedPosition <= this.options.blurSettings.blurIn.end) {
                const blurInProgress = (normalizedPosition - this.options.blurSettings.blurIn.start) / 
                    (this.options.blurSettings.blurIn.end - this.options.blurSettings.blurIn.start);
                blur = this.options.blurSettings.maxBlur * (1 - blurInProgress);
            } else if (normalizedPosition < this.options.blurSettings.blurIn.start) {
                blur = this.options.blurSettings.maxBlur;
            } else if (normalizedPosition >= this.options.blurSettings.blurOut.start && 
                       normalizedPosition <= this.options.blurSettings.blurOut.end) {
                const blurOutProgress = (normalizedPosition - this.options.blurSettings.blurOut.start) / 
                    (this.options.blurSettings.blurOut.end - this.options.blurSettings.blurOut.start);
                blur = this.options.blurSettings.maxBlur * blurOutProgress;
            } else if (normalizedPosition > this.options.blurSettings.blurOut.end) {
                blur = this.options.blurSettings.maxBlur;
            }

            blur = Math.max(0, Math.min(this.options.blurSettings.maxBlur, blur));

            // Update material uniforms
            if (plane.material.uniforms) {
                plane.material.uniforms.opacity.value = opacity;
                plane.material.uniforms.blurAmount.value = blur;
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = 0.016; // Approximate 60fps
        const time = performance.now() * 0.001;

        // Apply auto-play
        if (this.autoPlay) {
            this.scrollVelocity += 0.3 * delta;
        }

        // Damping
        this.scrollVelocity *= 0.95;

        // Update time and scroll force uniforms
        this.materials.forEach((material) => {
            if (material && material.uniforms) {
                material.uniforms.time.value = time;
                material.uniforms.scrollForce.value = this.scrollVelocity;
            }
        });

        // Check for hover
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.planes);

        this.planes.forEach((plane) => {
            const isIntersected = intersects.some(intersect => intersect.object === plane);
            if (plane.material.uniforms) {
                plane.material.uniforms.isHovered.value = isIntersected ? 1.0 : 0.0;
            }
        });

        // Update plane positions
        this.updatePlanes(delta);

        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Gallery images - tech-themed placeholders
    const galleryImages = [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', // Code on screen
        'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80', // Programming
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', // Laptop code
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80', // Computer setup
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80', // Code editor
        'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800&q=80', // Tech abstract
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', // Circuit board
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', // Technology
        'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&q=80', // Workspace
        'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80', // Code screen
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80', // Data visualization
        'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80'  // Developer
    ];

    // Initialize gallery
    const gallery = new Gallery3D('gallery-container', galleryImages, {
        speed: 1.2,
        visibleCount: 12,
        fadeSettings: {
            fadeIn: { start: 0.05, end: 0.25 },
            fadeOut: { start: 0.4, end: 0.43 }
        },
        blurSettings: {
            blurIn: { start: 0.0, end: 0.1 },
            blurOut: { start: 0.4, end: 0.43 },
            maxBlur: 8.0
        }
    });
});
