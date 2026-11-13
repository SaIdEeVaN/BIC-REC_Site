import { CONTACT_FORM_KEY } from '../data/club.js'

// Web3Forms takes a POST straight from the browser and delivers it as an email to the inbox the access key was
// issued for. It is the one outside origin the site sends anything to, and firebase.json's
// Content-Security-Policy names it for that reason.
export const CONTACT_ENDPOINT = 'https://api.web3forms.com/submit'

// Sends the contact form's message. Resolves once the service has accepted it, and throws if it hasn't — no
// connection, a key it doesn't know, its rate limit — so the form can offer the visitor another way through.
// `email` is the visitor's address: the service sets it as the reply-to, so the club can simply reply.
export async function sendMessage({ name, email, subject, message }, key = CONTACT_FORM_KEY) {
  const response = await fetch(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ access_key: key, name, email, subject, message }),
  })
  const result = await response.json().catch(() => null)
  if (!response.ok || result?.success === false) {
    throw new Error(result?.message ?? `the form service answered ${response.status}`)
  }
}
