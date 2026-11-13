// firebase.json is the one part of the site no browser test runs against: `vite preview` borrows its headers but
// not its routing. These hold the decisions in it that would otherwise fail only in production.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { CONTACT_ENDPOINT } from '../../src/lib/contact.js'

const { hosting } = JSON.parse(readFileSync(new URL('../../firebase.json', import.meta.url), 'utf8'))
const header = (key) => hosting.headers.flatMap((rule) => rule.headers).find((h) => h.key === key)?.value

test('no rewrite sends unknown addresses to the app, so they get 404.html and a 404 status', () => {
  // Every real page has its own file (scripts/prerender-meta.js). A catch-all rewrite to /index.html would
  // answer 200 for any address at all, which is what this replaced.
  assert.deepEqual(hosting.rewrites ?? [], [])
  assert.equal(hosting.cleanUrls, true, 'cleanUrls is what serves /events from events.html')
})

test('the pages that moved are redirected by the host', () => {
  const to = Object.fromEntries(hosting.redirects.map((r) => [r.source, r.destination]))
  assert.equal(to['/join'], '/team/associates')
  assert.equal(to['/news'], '/events')
})

test('hashed assets are cached for good, and pages are always revalidated', () => {
  const rule = (source) => hosting.headers.find((r) => r.source === source).headers[0].value
  assert.match(rule('/assets/**'), /immutable/)
  assert.equal(rule('!/assets/**'), 'no-cache')
})

test('the Content-Security-Policy allows what the site loads and nothing looser', () => {
  const policy = Object.fromEntries(
    header('Content-Security-Policy')
      .split(';')
      .map((directive) => directive.trim().split(/\s+/))
      .map(([name, ...sources]) => [name, sources]),
  )

  assert.deepEqual(policy['default-src'], ["'self'"])
  // Scripts: the site's own files and the one inline script, by hash. Never 'unsafe-inline' or 'unsafe-eval'.
  assert.equal(policy['script-src'].length, 2)
  assert.equal(policy['script-src'][0], "'self'")
  assert.match(policy['script-src'][1], /^'sha256-[A-Za-z0-9+/]+=*'$/)
  assert.ok(!header('Content-Security-Policy').includes('unsafe'), 'no unsafe-* source anywhere in the policy')

  // The contact form posts to one outside origin; if that ever changes, the policy has to change with it.
  assert.ok(policy['connect-src'].includes(new URL(CONTACT_ENDPOINT).origin))
  assert.deepEqual(policy['frame-ancestors'], ["'self'"])
  assert.deepEqual(policy['object-src'], ["'none'"])
})

test('the other hardening headers are set', () => {
  assert.equal(header('X-Content-Type-Options'), 'nosniff')
  assert.equal(header('X-Frame-Options'), 'SAMEORIGIN')
  assert.equal(header('Referrer-Policy'), 'strict-origin-when-cross-origin')
  assert.ok(header('Permissions-Policy'))
})
