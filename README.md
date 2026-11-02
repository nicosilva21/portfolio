# Photography Portfolio Starter

A dark, modern one-page portfolio: full-screen hero slideshow, a mixed masonry grid with All / Portraits / Travel / Street filters, scroll reveals, a lightbox, and a glowing accent color. No frameworks, no build tools beyond one tiny Node script.

## Add your photos

1. Export **web-sized** copies (about 2000px on the long edge, JPG or WebP, 200-500 KB each).
2. Drop them into the folders:
   - `images/featured/` the hero slideshow (your 3 to 5 absolute best)
   - `images/portraits/`
   - `images/travel/` (put landscapes here too)
   - `images/street/`
   - `images/about.jpg` a photo of you
3. Delete the `placeholder` images.
4. Run `node build.js` (this rewrites `photos.js`).
5. Open `index.html` or use the VS Code **Live Server** extension.

Order inside a folder follows the file names, so `01-sunset.jpg` comes before `02-alley.jpg`.

## Make it yours

- **Name, bio, email, Instagram:** edit `index.html` (search for `Your Name`, `you@example.com`, `yourhandle`).
- **Colors and fonts:** the variables at the top of `css/style.css`. Change `--accent` to a color from your photos.
- **Contact form:** sign up free at formspree.io and replace `YOUR_FORM_ID` in `index.html`.
- **New category** (for example `landscapes`): create `images/landscapes/`, run `node build.js`, and add a `<button class="filter" data-filter="landscapes">` to the filters in `index.html`. Categories with no photos hide their button automatically.

## Keep your laptop storage free

Only web-sized images go in this folder. Keep originals elsewhere (external drive or cloud). `originals/` and RAW files are already in `.gitignore`.

## Publish

```
git init
git add .
git commit -m "Initial portfolio"
```

Push to GitHub, then connect the repo to Netlify, Vercel, or Cloudflare Pages. Commit `photos.js` after running `node build.js`.
