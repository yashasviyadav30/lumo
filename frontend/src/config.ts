// App-wide settings. Name chosen by the user on 2026-10-06 (R9: own name and look).
export const APP_NAME = 'Lumo'
export const APP_TAGLINE = 'Study on YouTube without the distractions'

// Backend address. Empty means "same origin" (the Vite dev server proxies /api to the backend).
export const API_BASE: string = import.meta.env.VITE_API_BASE ?? ''

// YouTube's documented privacy-enhanced mode: same player and controls, fewer cookies.
export const YOUTUBE_EMBED_HOST = 'https://www.youtube-nocookie.com'
