# Shobar Aage Mon — Static Website

## Folder structure
```
shobar-aage-mon/
├── index.html          ← content + Open Graph / Twitter metadata
├── style.css           ← all styling (colours are CSS variables at the top)
├── script.js           ← scroll animation, share button, footer year
├── CNAME               ← custom domain: shobaraagemon.com
└── assets/
    ├── og-image.jpg    ← 1200×630 social preview image
    ├── favicon.svg
    └── apple-touch-icon.png
```

## Deploy to GitHub Pages
1. Upload all files (keep the `assets/` folder) to the **root** of your repository — drag-and-drop on GitHub works (Add file → Upload files).
2. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
3. Under **Custom domain**, enter `shobaraagemon.com` and Save (the `CNAME` file already does this).
4. Wait for the DNS check, then tick **Enforce HTTPS**. (HTTPS matters: Facebook and WhatsApp prefer it.)
5. DNS at your registrar: four `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; and a `CNAME` for `www` → `<your-username>.github.io`. Verify these on GitHub's docs, as IPs can change.

## Change the website URL
Search and replace `https://shobaraagemon.com` in `index.html` (appears in `canonical`, `og:url`, `og:image`, `twitter:image`). If you change domain, also edit `CNAME`.

## Change the preview image, title, description
- **Image:** replace `assets/og-image.jpg` (1200×630 px, under 300 KB, JPG/PNG). Keep the same file name, or update both `og:image` and `twitter:image`. To force platforms to refetch, use a new name like `og-image-v2.jpg`.
- **Title:** edit `<title>`, `og:title`, `twitter:title`.
- **Description:** edit `description`, `og:description`, `twitter:description` (keep about 110–160 characters).

## Test the social preview after deployment
- [ ] Open https://shobaraagemon.com — loads over HTTPS, no errors
- [ ] Open https://shobaraagemon.com/assets/og-image.jpg directly — image loads
- [ ] Facebook Sharing Debugger (developers.facebook.com/tools/debug): paste URL, click **Scrape Again**
- [ ] Paste the link into a Messenger chat with yourself
- [ ] Paste into WhatsApp (chat with yourself)
- [ ] Check LinkedIn Post Inspector and X/Twitter card preview
- [ ] Test on a real phone: layout, share button, links
- [ ] If an old preview shows, re-scrape in the Facebook debugger or rename the image (caches can last days)
