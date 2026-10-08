// Cloudflare Worker: serves the app, and passes /api/* and /health on to the backend on Render.
// Why: some mobile networks in India fail to reach *.onrender.com. With this, phones only ever talk to
// the app's own address. Same-origin also means no CORS. Nothing is logged or stored here.
const BACKEND = 'https://focus-app-6fb9.onrender.com'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    // A new address can forward to one Google sign-in already knows (wrangler-thrywe.jsonc) until it is added there.
    if (env.FORWARD_TO) return Response.redirect(env.FORWARD_TO + url.pathname + url.search, 302)
    if (url.pathname.startsWith('/api/') || url.pathname === '/health') {
      const headers = new Headers(request.headers)
      headers.delete('cookie')
      const ip = request.headers.get('CF-Connecting-IP')
      if (ip) headers.set('X-Forwarded-For', ip) // the sign-in rate limit keys on the real visitor
      return fetch(BACKEND + url.pathname + url.search, {
        method: request.method,
        headers,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        redirect: 'manual',
      })
    }
    return env.ASSETS.fetch(request)
  },
  // Cron (wrangler.jsonc): keep the backend awake so no one meets the sleeping-server wait.
  async scheduled(_event, _env, ctx) {
    ctx.waitUntil(fetch(BACKEND + '/health').catch(() => undefined))
  },
}
