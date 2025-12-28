# 🚀 Quick Start Guide

Get your portfolio up and running in 5 minutes!

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Text editor (VS Code recommended)
- Basic knowledge of HTML/CSS/JavaScript (optional)

## Installation Options

### Option 1: Quick Preview (No Installation)

1. **Download or Clone**
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd portfolio
   
   # Or download ZIP and extract
   ```

2. **Open in Browser**
   - Double-click `index.html`
   - Or right-click → Open with → Your Browser

3. **Done!** 🎉

### Option 2: Local Development Server (Recommended)

#### Using Python (Pre-installed on Mac/Linux)

```bash
# Navigate to project folder
cd portfolio

# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Open browser to: http://localhost:8000
```

#### Using Node.js

```bash
# Install http-server globally (one-time)
npm install -g http-server

# Run server
cd portfolio
http-server -p 8000

# Open browser to: http://localhost:8000
```

#### Using VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Open project folder in VS Code
3. Right-click `index.html`
4. Select "Open with Live Server"
5. Automatic browser opening!

#### Using npm scripts

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm start

# Open browser to: http://localhost:8000
```

## First Steps After Installation

### 1. Customize Your Information

Edit `index.html` and update:

```html
<!-- Line ~60: Your name and title -->
<h1>Your Name</h1>
<p>Your Title</p>

<!-- Line ~120: About section -->
<div class="about-content">
    <p>Your bio...</p>
</div>

<!-- Update Skills, Experience, Education, Projects sections -->
```

### 2. Update Contact Links

```html
<!-- Update LinkedIn URL -->
<a href="https://www.linkedin.com/in/YOUR_PROFILE/">

<!-- Update email or contact information -->
```

### 3. Customize Colors (Optional)

Edit `css/style.css`:

```css
/* Line ~10: Color variables */
:root {
    --primary: #2C5F7C;      /* Change this */
    --secondary: #3A7CA5;    /* And this */
    --accent: #81C3D7;       /* And this */
}
```

### 4. Replace Gallery Images

Edit `js/gallery.js`:

```javascript
// Line ~250: Update image URLs
const galleryImages = [
    'path/to/your/image1.jpg',
    'path/to/your/image2.jpg',
    // Add your images...
];
```

### 5. Test Everything

- ✅ Navigation links
- ✅ Mobile menu
- ✅ 3D gallery scrolling
- ✅ Contact form validation
- ✅ Responsive design

## Project Structure

```
portfolio/
├── index.html          # Main HTML file - Edit your content here
├── css/
│   └── style.css      # Styles - Change colors and design
├── js/
│   ├── gallery.js     # 3D gallery - Configure settings
│   └── main.js        # Interactivity - Add features
├── README.md          # Full documentation
├── DEPLOYMENT.md      # Deployment instructions
├── LICENSE            # MIT License
└── package.json       # npm configuration
```

## Common Customizations

### Change Gallery Speed

```javascript
// js/gallery.js - Line ~270
const gallery = new Gallery3D('gallery-container', galleryImages, {
    speed: 1.5,  // Increase for faster, decrease for slower
});
```

### Adjust Skill Bar Values

```html
<!-- index.html - Skills section -->
<div class="skill-bar" style="width: 90%"></div>
<!-- Change percentage -->
```

### Add New Sections

```html
<!-- Copy existing section structure -->
<section id="new-section" class="py-20 bg-dark">
    <div class="container mx-auto px-6">
        <h2 class="section-title">New Section</h2>
        <!-- Your content -->
    </div>
</section>

<!-- Add to navigation -->
<a href="#new-section" class="nav-link">New Section</a>
```

## Troubleshooting

### Issue: Gallery not loading

**Possible causes:**
- Missing Three.js library
- Images not loading
- Browser doesn't support WebGL

**Solutions:**
1. Check browser console for errors (F12)
2. Verify internet connection (CDN libraries)
3. Try a different browser
4. Use local server instead of file://

### Issue: Styles not applying

**Solutions:**
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check file paths in index.html
3. Verify CSS file exists in css/ folder

### Issue: Form not submitting

**Note:** The form is currently simulated. To make it functional:

1. Use a service like Formspree or EmailJS
2. Set up Netlify forms (if deploying to Netlify)
3. Create your own backend API

See `DEPLOYMENT.md` for details.

### Issue: Mobile menu not working

**Solutions:**
1. Check JavaScript console for errors
2. Verify main.js is loading
3. Clear cache and reload

## Browser Compatibility

✅ **Fully Supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

⚠️ **Limited Support:**
- Older browsers without WebGL (gallery won't work)
- Internet Explorer (not supported)

## Performance Tips

1. **Optimize Images**
   - Use compressed images (JPG/WebP)
   - Recommended size: Max 500KB per image
   - Tools: TinyPNG, ImageOptim

2. **Test Performance**
   - Use Chrome DevTools Lighthouse
   - Check Network tab for slow resources
   - Test on mobile devices

3. **Monitor Loading**
   - Gallery loads 12 images initially
   - More images = longer load time
   - Consider lazy loading for large galleries

## Next Steps

### Ready to Deploy?

Read `DEPLOYMENT.md` for deployment instructions to:
- ✅ Netlify (Easiest - Recommended)
- ✅ Vercel
- ✅ GitHub Pages
- ✅ Custom Server

### Want to Enhance?

**Easy Additions:**
- Add more projects
- Update skills
- Add certifications
- Include testimonials

**Advanced Features:**
- Blog section
- Dark mode toggle
- Analytics integration
- Backend for contact form

### Need Help?

1. Check `README.md` for detailed documentation
2. Review code comments in files
3. Search browser console for errors
4. Ask in GitHub Issues (if applicable)

## Learning Resources

**Technologies Used:**
- HTML5: [MDN HTML Guide](https://developer.mozilla.org/en-US/docs/Web/HTML)
- CSS3: [MDN CSS Guide](https://developer.mozilla.org/en-US/docs/Web/CSS)
- JavaScript: [MDN JS Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- Three.js: [Three.js Documentation](https://threejs.org/docs/)

## Tips for Success

✅ **Do:**
- Test on multiple devices
- Keep content updated
- Use professional language
- Optimize images
- Add your real projects
- Get feedback from others

❌ **Don't:**
- Use Lorem Ipsum text
- Include broken links
- Forget to update contact info
- Skip mobile testing
- Ignore accessibility

## Development Checklist

Before going live:

- [ ] Updated all personal information
- [ ] Changed default colors (optional)
- [ ] Added real projects
- [ ] Updated gallery images
- [ ] Verified all links work
- [ ] Tested on mobile
- [ ] Tested in multiple browsers
- [ ] Contact form configured
- [ ] Spell-checked all content
- [ ] Added resume/CV link
- [ ] Set up custom domain (optional)

## Support

**Need assistance?**
- 📖 Full docs: See `README.md`
- 🚀 Deployment: See `DEPLOYMENT.md`
- 💻 Code issues: Check browser console
- 🤝 Questions: LinkedIn or GitHub Issues

---

## Quick Commands Reference

```bash
# Start local server
npm start                    # Using npm
python3 -m http.server 8000 # Using Python
npx http-server             # Using npx

# Optimize files (optional)
npm run optimize            # Minify CSS and JS

# Test performance
npm run lighthouse          # Run Lighthouse audit

# Validate HTML
npm run validate            # Check HTML structure
```

---

**That's it! You're all set! 🎉**

Start customizing and make this portfolio your own!

**Questions?** Check README.md for detailed information.

---

*Last updated: January 2025*
*Created with ❤️ by Dhruv Patel*
