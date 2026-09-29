import base from './playwright.config.js'
const launchOptions = { executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }
export default { ...base, use: { ...base.use, launchOptions }, projects: base.projects.map((p) => ({ ...p, use: { ...p.use, launchOptions } })) }
