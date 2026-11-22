# The Hoopers Abroad — thehoopersabroad.uk

Private family travel blog for family and friends in the UK. Plain HTML with one shared stylesheet; there is no build step.

## Where it runs

- **Hosting:** a Cloudflare **Worker** (static assets, see `wrangler.jsonc`) called `thehoopersabroad`, in Andrew's **personal** Cloudflare account (signed in with his personal Google account). Cloudflare builds from this repository on every push to `main`. Not Netlify, and not the Lubi Cloudflare account.
- **Domain:** thehoopersabroad.uk, registered at Cloudflare in the same personal account (registrant type: UK Individual).
- **Privacy:** personal-link sign-in in `worker/index.js` (replaced Cloudflare Access on 22 Nov 2026).
  - Each reader gets a private link, `https://thehoopersabroad.uk/join/<token>`. Opening it on any device signs that browser in; there is no code or password.
  - Every page visit restarts a 12-week timer. A reader is signed out only after 12 weeks without a visit, and then just taps their link again.
  - `worker/readers.js` lists readers with a SHA-256 fingerprint of each token, never the raw link. Switch someone off with `active: false` and push.
  - A forwarded link works for whoever receives it, so if a link leaks, switch that reader off and issue a new one.
  - Fails closed: without a valid token every page, photo and stylesheet returns the "private family blog" page. Only `robots.txt` is public.
  - `worker/` is hidden from the website by `.assetsignore`.
  - Cloudflare Access is switched off for this Worker. The two `workers.dev` addresses stay **off** (Worker → Domains), so thehoopersabroad.uk is the only way in.
- **Search engines:** blocked three ways (`robots.txt`, `X-Robots-Tag` in `_headers`, and a `noindex` tag on every page), as a backstop to the lock.

## Layout

- Home page and post list: `index.html` (newest post first).
- One page per post: `posts/<YYYY-MM-slug>.html`, copied from `templates/post-template.html`.
- Photos and short clips: `assets/posts/<YYYY-MM-slug>/<YYYY-MM-slug>-NN-description.jpg` (two-digit order number, lower case, hyphens). File names are case-sensitive.
- Shared styles: `assets/style.css`.

## Working routine

1. Andrew sends text and numbered photos in a chat.
2. Claude builds the post on a branch and opens a pull request; Cloudflare Pages makes a **preview** (behind the same lock).
3. Andrew reviews the preview and asks for changes.
4. On "Publish", Claude merges the pull request; Cloudflare Pages puts it live.

## Photos and video

- Photos: resized to about 2000 px on the long side, JPEG quality ~80 (typically 300–600 KB each).
- Video: upload to YouTube as **unlisted** and embed it (see the template). Anyone with a video's own link can watch it, so the lock protects the page, not the video.
- Only very short clips (a few seconds, a few MB) go on the site itself. GitHub refuses files over 100 MB.
