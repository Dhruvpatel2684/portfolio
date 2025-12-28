# 🚀 Deployment Guide

This guide will help you deploy your portfolio website to various hosting platforms.

## Table of Contents
- [Netlify (Recommended)](#netlify-recommended)
- [Vercel](#vercel)
- [GitHub Pages](#github-pages)
- [Custom Server](#custom-server)
- [Post-Deployment Checklist](#post-deployment-checklist)

---

## Netlify (Recommended)

### Why Netlify?
- ✅ Free HTTPS/SSL
- ✅ Automatic deployments from Git
- ✅ Custom domain support
- ✅ Form handling built-in
- ✅ CDN and optimizations

### Deployment Steps

#### Method 1: Drag & Drop (Fastest)

1. Go to [netlify.com](https://www.netlify.com/)
2. Sign up or log in
3. Drag and drop your project folder to Netlify
4. Done! Your site is live

#### Method 2: Git Integration (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com/)
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - Configure settings:
     - **Build command**: Leave empty (static site)
     - **Publish directory**: `/` or `.`
   - Click "Deploy site"

3. **Custom Domain (Optional)**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Follow DNS configuration instructions

### Setting Up Contact Form on Netlify

Update your form in `index.html`:

```html
<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="contact">
    <!-- Your form fields -->
</form>
```

Then update `js/main.js` to handle Netlify forms:

```javascript
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    
    try {
        await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        });
        
        showFormMessage('Thank you! I\'ll get back to you soon.', 'success');
        form.reset();
    } catch (error) {
        showFormMessage('Error sending message. Please try again.', 'error');
    }
});
```

---

## Vercel

### Why Vercel?
- ✅ Fast global CDN
- ✅ Automatic HTTPS
- ✅ Git integration
- ✅ Zero configuration

### Deployment Steps

1. **Install Vercel CLI (Optional)**
   ```bash
   npm install -g vercel
   ```

2. **Deploy via CLI**
   ```bash
   cd your-portfolio
   vercel
   ```

3. **Or Deploy via Website**
   - Go to [vercel.com](https://vercel.com/)
   - Import your Git repository
   - Vercel auto-detects settings
   - Click "Deploy"

4. **Custom Domain**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records

---

## GitHub Pages

### Why GitHub Pages?
- ✅ Free hosting
- ✅ Direct from GitHub repo
- ✅ Built-in version control

### Deployment Steps

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select Source: `main` branch
   - Click Save

3. **Access Your Site**
   - URL: `https://YOUR_USERNAME.github.io/portfolio/`
   - Wait 2-5 minutes for deployment

4. **Custom Domain (Optional)**
   - Add `CNAME` file with your domain
   - Configure DNS:
     ```
     Type: CNAME
     Name: www
     Value: YOUR_USERNAME.github.io
     ```

### Fix Asset Paths for GitHub Pages

If your site is at `username.github.io/portfolio/`, update paths in `index.html`:

```html
<!-- Change -->
<link rel="stylesheet" href="css/style.css">
<!-- To -->
<link rel="stylesheet" href="/portfolio/css/style.css">
```

Or use a custom domain to avoid this issue.

---

## Custom Server

### Requirements
- VPS or dedicated server
- Web server (Apache/Nginx)
- Domain name
- SSL certificate

### Using Nginx

1. **Upload Files**
   ```bash
   scp -r * user@your-server:/var/www/portfolio/
   ```

2. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       listen [::]:80;
       server_name yoursite.com www.yoursite.com;
       
       root /var/www/portfolio;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # Gzip compression
       gzip on;
       gzip_vary on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
       
       # Browser caching
       location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

3. **Enable HTTPS with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d yoursite.com -d www.yoursite.com
   ```

### Using Apache

1. **Upload Files**
   ```bash
   scp -r * user@your-server:/var/www/html/portfolio/
   ```

2. **Apache Configuration** (`.htaccess`)
   ```apache
   # Force HTTPS
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   
   # Browser caching
   <IfModule mod_expires.c>
       ExpiresActive On
       ExpiresByType image/jpg "access plus 1 year"
       ExpiresByType image/jpeg "access plus 1 year"
       ExpiresByType image/png "access plus 1 year"
       ExpiresByType text/css "access plus 1 month"
       ExpiresByType application/javascript "access plus 1 month"
   </IfModule>
   
   # Gzip compression
   <IfModule mod_deflate.c>
       AddOutputFilterByType DEFLATE text/plain
       AddOutputFilterByType DEFLATE text/html
       AddOutputFilterByType DEFLATE text/css
       AddOutputFilterByType DEFLATE application/javascript
   </IfModule>
   ```

---

## Post-Deployment Checklist

### 🔍 Testing

- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices
- [ ] Check all navigation links
- [ ] Verify contact form functionality
- [ ] Test 3D gallery performance
- [ ] Check page load speed ([PageSpeed Insights](https://pagespeed.web.dev/))

### 🎨 Content Review

- [ ] Update all personal information
- [ ] Verify LinkedIn link
- [ ] Check for typos and grammar
- [ ] Ensure all images load correctly
- [ ] Verify meta tags and descriptions

### 🚀 SEO & Performance

- [ ] Add `robots.txt` file
- [ ] Create `sitemap.xml`
- [ ] Add Open Graph meta tags
- [ ] Set up Google Analytics (optional)
- [ ] Submit to Google Search Console
- [ ] Optimize images
- [ ] Enable caching

### 🔒 Security

- [ ] Enable HTTPS/SSL
- [ ] Add security headers
- [ ] Implement CSP (Content Security Policy)
- [ ] Check for mixed content warnings

---

## Additional Configuration Files

### robots.txt

Create `robots.txt` in root:

```txt
User-agent: *
Allow: /

Sitemap: https://yoursite.com/sitemap.xml
```

### sitemap.xml

Create `sitemap.xml` in root:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://yoursite.com/</loc>
        <lastmod>2025-01-27</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>
```

### Meta Tags (Already in index.html)

Ensure these are present:

```html
<!-- SEO -->
<meta name="description" content="Your description">
<meta name="keywords" content="your, keywords">
<meta name="author" content="Dhruv Patel">

<!-- Open Graph -->
<meta property="og:title" content="Dhruv Patel - Portfolio">
<meta property="og:description" content="Your description">
<meta property="og:image" content="https://yoursite.com/preview.jpg">
<meta property="og:url" content="https://yoursite.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Dhruv Patel - Portfolio">
<meta name="twitter:description" content="Your description">
<meta name="twitter:image" content="https://yoursite.com/preview.jpg">
```

---

## Domain Configuration

### DNS Records

For your custom domain, add these DNS records:

```
Type: A
Name: @
Value: [Your hosting IP or use CNAME]

Type: CNAME
Name: www
Value: [Your hosting domain]
```

### Common DNS Providers
- **Namecheap**: Advanced DNS → Add New Record
- **GoDaddy**: DNS Management → Add Record
- **Cloudflare**: DNS → Add Record

---

## Troubleshooting

### Issue: 404 Error on Refresh
**Solution**: Configure server to serve `index.html` for all routes

### Issue: Mixed Content Warning
**Solution**: Ensure all resources use HTTPS

### Issue: Slow Load Times
**Solution**: 
- Optimize images
- Enable caching
- Use CDN for assets
- Minify CSS/JS

### Issue: Contact Form Not Working
**Solution**:
- Check form action URL
- Verify Netlify form setup
- Implement backend API

---

## Performance Optimization Tips

1. **Image Optimization**
   ```bash
   # Use tools like ImageOptim, TinyPNG
   # Or compress manually
   ```

2. **Minify Assets**
   ```bash
   # CSS
   npx clean-css-cli -o style.min.css css/style.css
   
   # JavaScript
   npx terser js/main.js -o js/main.min.js -c -m
   ```

3. **Enable Caching**
   - Set appropriate cache headers
   - Use service workers (optional)

4. **Use CDN**
   - Already using CDN for libraries
   - Consider CDN for images

---

## Support

If you encounter any issues:

1. Check browser console for errors
2. Verify all file paths are correct
3. Test in incognito mode
4. Clear browser cache
5. Check hosting platform logs

---

## Next Steps After Deployment

1. ✅ Share your portfolio on LinkedIn
2. ✅ Add to your resume
3. ✅ Share with potential employers
4. ✅ Get feedback from peers
5. ✅ Keep updating with new projects
6. ✅ Monitor analytics and performance

---

**Need help?** Feel free to reach out or open an issue in the repository.

**Happy Deploying! 🚀**
