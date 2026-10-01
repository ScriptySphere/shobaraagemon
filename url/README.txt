SHOBAR AAGE MON - SHORT LINK FEATURE
====================================
Short links like  https://shobaraagemon.com/post/xyz
Free, static, works on GitHub Pages. Your old site files are NOT touched.

FILES IN THIS ZIP
  admin.html                    the page where you create links (no JSON editing)
  links.json                    stores your links (the admin page edits it for you)
  config.json                   your domain + default preview text/image
  404.html                      friendly "not found" + instant redirect fallback
  tools/generate.js             builds the /post/... pages
  .github/workflows/static.yml  replaces your existing workflow
  assets/og-image.jpg           default preview image (replace with your own, 1200x630)

STEP 1 - UPLOAD (one time)
  1. Unzip this file on your computer.
  2. GitHub repo > Add file > Upload files.
  3. Drag ALL the unzipped contents in (including the tools, assets and .github folders).
     If .github does not upload (it is a hidden folder), create it by hand:
     Add file > Create new file > name it  .github/workflows/static.yml
     and paste the contents of that file (overwrite the existing one).
  4. Commit changes.

STEP 2 - SET YOUR DOMAIN
  Open config.json in GitHub (pencil icon) and change "site" to your real address,
  with no trailing slash, for example  https://shobaraagemon.com
  If you have no custom domain yet, use https://scriptysphere.github.io/shobaraagemon
  (then the short link is .../shobaraagemon/post/xyz, and the 404 redirect fallback
  will not work; custom domain is recommended.)

STEP 3 - CHECK GITHUB PAGES
  Settings > Pages > Source must be "GitHub Actions".
  Custom domain: enter shobaraagemon.com, then at your registrar add four A records
  for @ : 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
  and a CNAME for www pointing to scriptysphere.github.io. Tick Enforce HTTPS.

STEP 4 - CREATE A TOKEN (one time, 2 minutes)
  GitHub > profile photo > Settings > Developer settings > Personal access tokens
  > Fine-grained tokens > Generate new token
    - Repository access: Only select repositories > shobaraagemon
    - Repository permissions > Contents: Read and write
    - Set an expiry you are comfortable with
  Copy the token (github_pat_...).

STEP 5 - USE IT
  Open https://shobaraagemon.com/admin.html
  Paste the token once and click "Save and connect".
  Then: paste a long URL > Create short link > the short link is copied for you.
  Optional: add a custom ending, preview title, description and image.
  The site republishes in about a minute; the link already redirects right away,
  and Facebook/WhatsApp previews work once the build finishes (green tick in Actions).

SECURITY NOTES
  - The token is saved only in your browser and sent only to api.github.com.
  - Anyone can open admin.html but can do nothing without your token.
  - Use a fine-grained token limited to this one repository.
  - links.json is public. Do not store private URLs in it.
  - Use "Forget this browser" on shared computers.

CHANGE PREVIEW IMAGE / TEXT
  Default for all links: replace assets/og-image.jpg and edit config.json.
  Per link: fill the title/description/image fields in the admin page.
  After changes, re-scrape at https://developers.facebook.com/tools/debug/

TEST CHECKLIST
  [ ] Actions tab shows a green tick after each change
  [ ] /post/<code> redirects to the long URL
  [ ] /post/doesnotexist shows the 404 page
  [ ] Facebook Sharing Debugger shows title, description, image
  [ ] WhatsApp / Messenger preview looks right (send the link to yourself)
