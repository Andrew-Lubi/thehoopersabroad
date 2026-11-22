// The Hoopers Abroad — personal-link sign-in (replaces Cloudflare Access, 22 Nov 2026).
//
// How it works:
// - Each reader has a private link: https://thehoopersabroad.uk/join/<token>
// - Opening it on any device stores the token in a cookie on that browser and goes to the home page.
// - Every page visit restarts a 12-week timer, so a reader is only signed out after 12 weeks with no visit.
//   After that they just tap their link again.
// - Only a fingerprint (SHA-256 hash) of each token is kept, in worker/readers.js. Raw links are never stored here.
// - To switch a reader off: set active: false in worker/readers.js and push. Their link and cookie stop working.
// - No match = the "private family blog" page. Fails closed: nothing is served without a valid token.

import { READERS } from "./readers.js";

const COOKIE = "__Host-hoopers";
const TWELVE_WEEKS = 12 * 7 * 24 * 60 * 60; // seconds
const PUBLIC_PATHS = new Set(["/robots.txt"]);

const activeByHash = new Map(
  READERS.filter((r) => r.active).map((r) => [r.tokenHash, r])
);

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function readerFor(token) {
  if (!token || token.length < 20 || token.length > 200) return null;
  return activeByHash.get(await sha256Hex(token)) || null;
}

function cookieToken(request) {
  const header = request.headers.get("Cookie") || "";
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === COOKIE) return rest.join("=");
  }
  return null;
}

function setCookie(token) {
  return `${COOKIE}=${token}; Path=/; Max-Age=${TWELVE_WEEKS}; Secure; HttpOnly; SameSite=Lax`;
}

function privatePage(message, status) {
  const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>The Hoopers Abroad</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;700&family=Caveat:wght@500&display=swap" rel="stylesheet">
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
         background: #F6EFE4; color: #2f2d29; font-family: 'Nunito Sans', system-ui, sans-serif; padding: 24px; box-sizing: border-box; }
  .card { max-width: 460px; text-align: center; }
  h1 { font-family: 'Caveat', cursive; font-weight: 500; font-size: 2.6rem; color: #1F5F5B; margin: 0 0 12px; }
  p { font-size: 1.05rem; line-height: 1.7; margin: 0 0 12px; }
</style>
</head>
<body>
<div class="card">
  <h1>The Hoopers Abroad</h1>
  <p>This is a private family blog.</p>
  <p>${message}</p>
</div>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    if (PUBLIC_PATHS.has(url.pathname)) return env.ASSETS.fetch(request);

    // Personal link: /join/<token>
    if (url.pathname.startsWith("/join/")) {
      const token = url.pathname.slice("/join/".length).replace(/\/+$/, "");
      if (await readerFor(token)) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/",
            "Set-Cookie": setCookie(token),
            "Cache-Control": "no-store",
            "Referrer-Policy": "no-referrer",
          },
        });
      }
      return privatePage(
        "This link isn't working. Please ask Andrew for a new one.",
        403
      );
    }

    const token = cookieToken(request);
    if (!(await readerFor(token))) {
      return privatePage(
        "To read it, please open the personal link in your invitation email.",
        401
      );
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const type = assetResponse.headers.get("Content-Type") || "";
    if (!type.includes("text/html")) return assetResponse;

    // Restart the 12-week timer on every page visit.
    const response = new Response(assetResponse.body, assetResponse);
    response.headers.append("Set-Cookie", setCookie(token));
    response.headers.set("Cache-Control", "private, no-cache");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  },
};
