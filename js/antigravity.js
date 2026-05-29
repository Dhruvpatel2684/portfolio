// =============================================
// ANTIGRAVITY PARTICLE EFFECT — Vanilla Three.js
// Ported from React Bits Antigravity component
// Particles form a ring around cursor, with wave animation
// =============================================

class AntigravityEffect {
  constructor(container, options = {}) {
    this.container = container;
    this.opts = {
      count: options.count || 300,
      magnetRadius: options.magnetRadius || 6,
      ringRadius: options.ringRadius || 7,
      waveSpeed: options.waveSpeed || 0.4,
      waveAmplitude: options.waveAmplitude || 1,
      particleSize: options.particleSize || 1.5,
      lerpSpeed: options.lerpSpeed || 0.05,
      color: options.color || '#FF9FFC',
      autoAnimate: options.autoAnimate !== undefined ? options.autoAnimate : true,
      particleVariance: options.particleVariance || 1,
      rotationSpeed: options.rotationSpeed || 0,
      depthFactor: options.depthFactor || 1,
      pulseSpeed: options.pulseSpeed || 3,
      fieldStrength: options.fieldStrength || 10,
    };

    this.mouse = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.lastMouseMoveTime = 0;
    this.virtualMouse = { x: 0, y: 0 };
    this.clock = new THREE.Clock();
    this.dummy = new THREE.Object3D();
    this.particles = [];

    this.init();
  }

  init() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 1000);
    this.camera.position.z = 50;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    this.updateViewport();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  updateViewport() {
    const vFov = (this.camera.fov * Math.PI) / 180;
    this.viewportHeight = 2 * Math.tan(vFov / 2) * this.camera.position.z;
    this.viewportWidth = this.viewportHeight * this.camera.aspect;
  }

  createParticles() {
    const { count } = this.opts;
    const w = this.viewportWidth;
    const h = this.viewportHeight;

    const geometry = new THREE.CapsuleGeometry(0.1, 0.4, 4, 8);
    const material = new THREE.MeshBasicMaterial({ color: this.opts.color });
    this.mesh = new THREE.InstancedMesh(geometry, material, count);
    this.scene.add(this.mesh);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * w;
      const y = (Math.random() - 0.5) * h;
      const z = (Math.random() - 0.5) * 20;
      const randomRadiusOffset = (Math.random() - 0.5) * 2;

      this.particles.push({
        t: Math.random() * 100,
        speed: 0.01 + Math.random() / 200,
        mx: x, my: y, mz: z,
        cx: x, cy: y, cz: z,
        randomRadiusOffset,
      });
    }
  }

  bindEvents() {
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    window.addEventListener('resize', () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      this.updateViewport();
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsed = this.clock.getElapsedTime();
    const { opts, particles, dummy, mesh, viewportWidth, viewportHeight } = this;

    const mouseDist = Math.sqrt(
      Math.pow(this.mouse.x - this.lastMousePos.x, 2) +
      Math.pow(this.mouse.y - this.lastMousePos.y, 2)
    );

    if (mouseDist > 0.001) {
      this.lastMouseMoveTime = Date.now();
      this.lastMousePos.x = this.mouse.x;
      this.lastMousePos.y = this.mouse.y;
    }

    let destX = (this.mouse.x * viewportWidth) / 2;
    let destY = (this.mouse.y * viewportHeight) / 2;

    if (opts.autoAnimate && Date.now() - this.lastMouseMoveTime > 2000) {
      destX = Math.sin(elapsed * 0.5) * (viewportWidth / 4);
      destY = Math.cos(elapsed * 0.5 * 2) * (viewportHeight / 4);
    }

    const smoothFactor = 0.05;
    this.virtualMouse.x += (destX - this.virtualMouse.x) * smoothFactor;
    this.virtualMouse.y += (destY - this.virtualMouse.y) * smoothFactor;

    const targetX = this.virtualMouse.x;
    const targetY = this.virtualMouse.y;
    const globalRotation = elapsed * opts.rotationSpeed;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.t += p.speed / 2;

      const projectionFactor = 1 - p.cz / 50;
      const projTargetX = targetX * projectionFactor;
      const projTargetY = targetY * projectionFactor;

      const dx = p.mx - projTargetX;
      const dy = p.my - projTargetY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let tX = p.mx, tY = p.my, tZ = p.mz * opts.depthFactor;

      if (dist < opts.magnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRotation;
        const wave = Math.sin(p.t * opts.waveSpeed + angle) * (0.5 * opts.waveAmplitude);
        const deviation = p.randomRadiusOffset * (5 / (opts.fieldStrength + 0.1));
        const currentRingRadius = opts.ringRadius + wave + deviation;

        tX = projTargetX + currentRingRadius * Math.cos(angle);
        tY = projTargetY + currentRingRadius * Math.sin(angle);
        tZ = p.mz * opts.depthFactor + Math.sin(p.t) * (1 * opts.waveAmplitude * opts.depthFactor);
      }

      p.cx += (tX - p.cx) * opts.lerpSpeed;
      p.cy += (tY - p.cy) * opts.lerpSpeed;
      p.cz += (tZ - p.cz) * opts.lerpSpeed;

      dummy.position.set(p.cx, p.cy, p.cz);
      dummy.lookAt(projTargetX, projTargetY, p.cz);
      dummy.rotateX(Math.PI / 2);

      const currentDist = Math.sqrt(
        Math.pow(p.cx - projTargetX, 2) + Math.pow(p.cy - projTargetY, 2)
      );
      const distFromRing = Math.abs(currentDist - opts.ringRadius);
      let scaleFactor = Math.max(0, Math.min(1, 1 - distFromRing / 10));

      const finalScale = scaleFactor *
        (0.8 + Math.sin(p.t * opts.pulseSpeed) * 0.2 * opts.particleVariance) *
        opts.particleSize;

      dummy.scale.set(finalScale, finalScale, finalScale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
  }

  setColor(newColor) {
    this.opts.color = newColor;
    this.mesh.material.color.set(newColor);
  }

  destroy() {
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
