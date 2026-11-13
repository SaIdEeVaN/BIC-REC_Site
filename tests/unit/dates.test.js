// The site never stores an event's status. "Upcoming", "Sealed" and every sealed date are worked out from the
// loose date strings in src/data ("September 18, 2025", "February 20–21, 2026"), so the parsing is what stands
// between a typo-shaped date and a page that says the wrong thing. Run: npm run test:unit
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { events, eventEnd, getUpcomingEvents, isUpcoming } from '../../src/data/events.js'
import { blockNo, hostOf, isRealLink, parseLooseDate, sealedDate, shortHash } from '../../src/lib/chain.js'

const ymd = (date) => [date.getFullYear(), date.getMonth() + 1, date.getDate()]

test('a date is read as the day it names', () => {
  assert.deepEqual(ymd(parseLooseDate('September 18, 2025')), [2025, 9, 18])
  assert.deepEqual(ymd(parseLooseDate('January 6, 2026')), [2026, 1, 6])
  assert.deepEqual(ymd(parseLooseDate('12 February 2026')), [2026, 2, 12])
  assert.deepEqual(ymd(parseLooseDate('Feb 13, 2026')), [2026, 2, 13])
})

test('a range starts on its first day, and a month alone is its first day', () => {
  assert.deepEqual(ymd(parseLooseDate('February 20–21, 2026')), [2026, 2, 20])
  assert.deepEqual(ymd(parseLooseDate('February 20-21, 2026')), [2026, 2, 20])
  assert.deepEqual(ymd(parseLooseDate('Nov 2025')), [2025, 11, 1])
  assert.deepEqual(ymd(parseLooseDate('December 2025')), [2025, 12, 1])
})

test('a year is not mistaken for a day, and text with no year is not a date', () => {
  assert.deepEqual(ymd(parseLooseDate('2026 March 5')), [2026, 3, 5])
  assert.equal(parseLooseDate('not a date'), null)
  assert.equal(parseLooseDate('March 5'), null)
  assert.equal(parseLooseDate(''), null)
})

test('a Date passes through untouched', () => {
  const date = new Date(2026, 3, 11)
  assert.equal(parseLooseDate(date), date)
})

test('a sealed date is dd.mm.yy, and zeros when there is no date to seal', () => {
  assert.equal(sealedDate('September 18, 2025'), '18.09.25')
  assert.equal(sealedDate('January 6, 2026'), '06.01.26')
  assert.equal(sealedDate('February 20–21, 2026'), '20.02.26')
  assert.equal(sealedDate('to be announced'), '00.00.00')
})

test('an event ends at the end of its last day', () => {
  const oneDay = eventEnd({ date: 'April 11, 2026' })
  assert.deepEqual(ymd(oneDay), [2026, 4, 11])
  assert.deepEqual([oneDay.getHours(), oneDay.getMinutes()], [23, 59])

  assert.deepEqual(ymd(eventEnd({ date: 'February 20–21, 2026' })), [2026, 2, 21])
  assert.equal(eventEnd({ date: 'soon' }), null)
})

test('an event is upcoming through its last day and not a minute after', () => {
  const twoDays = { date: 'February 20–21, 2026' }
  assert.equal(isUpcoming(twoDays, new Date(2026, 1, 19)), true)
  assert.equal(isUpcoming(twoDays, new Date(2026, 1, 21, 23, 59)), true)
  assert.equal(isUpcoming(twoDays, new Date(2026, 1, 22, 0, 0)), false)
  assert.equal(isUpcoming({ date: 'not a date' }, new Date(2026, 0, 1)), false)
})

test('every event in the ledger has a date the site can read', () => {
  for (const event of events) {
    assert.ok(parseLooseDate(event.date), `"${event.date}" (${event.title}) has no year in it`)
    assert.match(sealedDate(event.date), /^\d{2}\.\d{2}\.\d{2}$/)
    // A date like "Febuary 12, 2026" still parses — as January. Naming a real month is what rules that out.
    assert.match(event.date, /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i, `"${event.date}" (${event.title}) names no month`)
  }
})

test('the ledger is in date order, oldest first, with ids that count up from 1', () => {
  const times = events.map((event) => parseLooseDate(event.date).getTime())
  assert.deepEqual(times, [...times].sort((a, b) => a - b))
  assert.deepEqual(events.map((event) => event.id), events.map((_, i) => i + 1))
})

test('upcoming events come soonest first', () => {
  const before = new Date(2025, 8, 1)
  const upcoming = getUpcomingEvents(before)
  assert.equal(upcoming.length, events.length)
  assert.equal(upcoming[0].id, events[0].id)
  assert.deepEqual(getUpcomingEvents(new Date(2100, 0, 1)), [])
})

test('display hashes and block numbers are stable', () => {
  assert.equal(shortHash('defi-unlocked'), shortHash('defi-unlocked'))
  assert.notEqual(shortHash('defi-unlocked'), shortHash('decode-blockchain'))
  assert.match(shortHash('anything'), /^0x[0-9a-f]{3}…[0-9a-f]{3}$/)
  assert.equal(blockNo(7), 'block #0007')
})

test('links: a placeholder is not a link, and a host is read off a URL', () => {
  assert.equal(isRealLink('https://example.com/register'), true)
  assert.equal(isRealLink('#'), false)
  assert.equal(isRealLink(undefined), false)
  assert.equal(hostOf('https://www.coursera.org/learn/blockchain-basics'), 'coursera.org')
  assert.equal(hostOf('not a url'), 'not a url')
})
