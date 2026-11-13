import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, Chip, PageHeader } from '../components/kit'
import { shortHash } from '../lib/chain'
import { sendMessage } from '../lib/contact'
import { CLUB_EMAIL, CLUB_INSTAGRAM, CLUB_LINKEDIN, CLUB_MAILTO, CONTACT_FORM_KEY } from '../data/club'
import { LiftCell, Mine, Reveal, Scramble, Slam, SplitText, Stamp } from '../components/motion'

const EMPTY = { name: '', email: '', subject: '', message: '' }

// College addresses only (the club's call). Anyone outside REC is pointed to the club's own email under the form.
const EMAIL_PATTERN = /^[^\s@]+@rajalakshmi\.edu\.in$/i
const EMAIL_ERROR = 'enter valid email id'
const emailErrorFor = (value) => (EMAIL_PATTERN.test(value.trim()) ? '' : EMAIL_ERROR)

// Two ways out, switched by CONTACT_FORM_KEY in data/club.js:
// - no key: the site has no backend, so the message is handed to the visitor's own email app, addressed to the
//   club, and they send it from there ("Drafted").
// - a key: the form sends the message itself (lib/contact.js) and says so ("Sent"). The email app is still the
//   way through if that fails, so nobody is left holding a message they can't deliver.
const SENDS_ITSELF = Boolean(CONTACT_FORM_KEY)

const mailtoFor = (form) =>
  `mailto:${CLUB_EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(
    `${form.message}\n\n— ${form.name} (${form.email})`
  )}`

const contactInfo = [
  { label: 'email us', value: CLUB_EMAIL, href: CLUB_MAILTO },
  { label: 'location', value: 'Rajalakshmi Engineering College, Thandalam, Chennai – 602105' },
  { label: 'follow us', value: 'Find us on Instagram & LinkedIn' },
]

const socials = [
  { label: 'Instagram', handle: '@bic.rec', href: CLUB_INSTAGRAM },
  { label: 'LinkedIn', handle: 'blockchain innovation club', href: CLUB_LINKEDIN },
  { label: 'Email', handle: CLUB_EMAIL, href: CLUB_MAILTO },
]

function Field({ label, as: Tag = 'input', error, inputRef, ...props }) {
  const errorId = error ? `${props.name}-error` : undefined
  return (
    <div>
      <label className="block">
        <span className="field-label">{label}</span>
        <Tag
          ref={inputRef}
          required
          className="field"
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          {...props}
        />
      </label>
      {error && (
        <p id={errorId} className="mt-2 text-[14px] font-bold">
          <span className="font-mono text-[12px] font-medium">error · </span>
          {error}
        </p>
      )}
    </div>
  )
}

export default function Contact() {
  const [searchParams] = useSearchParams()
  // Links like /contact?subject=Membership%20application pre-fill the subject.
  const [form, setForm] = useState(() => ({ ...EMPTY, subject: searchParams.get('subject') ?? '' }))
  // What became of the message: null while the form is up, then 'drafted' (handed to the email app) or 'sent'.
  const [outcome, setOutcome] = useState(null)
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)
  // The email is checked when the visitor leaves the field (or tries to send), then live as they fix it.
  const [emailChecked, setEmailChecked] = useState(false)
  const emailRef = useRef(null)
  const emailError = emailErrorFor(form.email)

  // The browser's own submit check uses the same rule and message, so the form can't go out with a bad address.
  // `outcome` is a dependency because the field is a new element each time the form comes back.
  useEffect(() => {
    emailRef.current?.setCustomValidity(emailError)
  }, [emailError, outcome])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const draftInEmailApp = () => {
    window.location.href = mailtoFor(form)
    setOutcome('drafted')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!SENDS_ITSELF) return draftInEmailApp()

    // The form has one box no person can see or reach. Only a script filling in every field ticks it, and what
    // it submits goes nowhere — it is told "sent" like anyone else, so it has nothing to learn from.
    if (e.target.elements.botcheck.checked) return setOutcome('sent')

    setSending(true)
    setFailed(false)
    const delivered = await sendMessage(form).then(
      () => true,
      () => false,
    )
    setSending(false)
    if (delivered) setOutcome('sent')
    else setFailed(true)
  }

  const startOver = () => {
    setOutcome(null)
    setFailed(false)
    setForm(EMPTY)
    setEmailChecked(false)
  }

  return (
    <>
      <PageHeader
        eyebrow="get in touch"
        title="Let's connect"
        lead="For collaborations, events, workshops, and general enquiries — we'd love to hear from you."
      />

      <section className="border-b-3 border-ink">
        <div className="wrap section">
          <ul className="cells grid md:grid-cols-3">
            {contactInfo.map((c, i) => (
              <LiftCell key={c.label} index={i} className="bg-bone p-5 md:p-6">
                <p className="meta">{c.label}</p>
                {c.href ? (
                  <a
                    href={c.href}
                    className="mt-2 block break-all text-[16px] font-bold underline decoration-2 underline-offset-4"
                  >
                    {c.value}
                  </a>
                ) : (
                  <p className="mt-2 text-[16px] font-bold">{c.value}</p>
                )}
              </LiftCell>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="wrap section grid gap-12 lg:grid-cols-[1fr_620px]">
          <Reveal>
            <h2 className="t-h3">Find us online</h2>
            <ul className="mt-6 border-y-3 border-ink">
              {socials.map((s) => (
                <li key={s.label} className="border-t-3 border-ink first:border-t-0">
                  <a
                    href={s.href}
                    {...(s.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex flex-col gap-1 py-5"
                  >
                    <span className="t-card underline decoration-2 underline-offset-[5px] group-hover:decoration-[3px]">
                      {s.label}
                    </span>
                    <span className="meta break-all">{s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Slam className="border-3 border-ink bg-bone p-6 shadow-ink md:p-8">
            {outcome === 'sent' ? (
              <div role="status">
                <Stamp trigger="mount">
                  <Chip tone="shipped">Sent</Chip>
                </Stamp>
                <h2 className="t-h3 mt-5">
                  <SplitText text="Message sent" delay={0.15} />
                </h2>
                {/* Delivered, so the hash is read off as settled rather than mined (compare "Drafted" below). */}
                <p className="meta mt-3">
                  sealed · <Scramble text={shortHash(form.subject + form.message)} trigger="mount" delay={0.4} />
                </p>
                <p className="t-body mt-3">
                  It is in the club&apos;s inbox. We&apos;ll reply to <span className="break-all font-bold">{form.email}</span>.
                </p>
                <Button variant="bone" className="mt-8" onClick={startOver}>
                  Write another message
                </Button>
              </div>
            ) : outcome === 'drafted' ? (
              <div role="status">
                <Stamp trigger="mount">
                  <Chip tone="pending">Drafted</Chip>
                </Stamp>
                <h2 className="t-h3 mt-5">
                  <SplitText text="Check your email app" delay={0.15} />
                </h2>
                {/* Nothing is sent from here, but the message now exists — give it a hash and mine it. */}
                <p className="meta mt-3">
                  broadcasting · <Mine text={shortHash(form.subject + form.message)} trigger="mount" delay={0.4} />
                </p>
                <p className="t-body mt-3">
                  Your email app should have opened with the message ready — press send there to reach the club.
                </p>
                <p className="t-body mt-3">
                  Nothing opened?{' '}
                  <a href={mailtoFor(form)} className="font-bold underline decoration-2 underline-offset-4">
                    Open the email again
                  </a>{' '}
                  or write to{' '}
                  <a href={CLUB_MAILTO} className="break-all font-bold underline decoration-2 underline-offset-4">
                    {CLUB_EMAIL}
                  </a>
                  .
                </p>
                <Button variant="bone" className="mt-8" onClick={startOver}>
                  Write another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h2 className="t-h3">Send a message</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="your name" type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
                  <Field
                    label="email address"
                    type="email"
                    name="email"
                    placeholder="you@rajalakshmi.edu.in"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={(e) => e.target.value.trim() && setEmailChecked(true)}
                    onInvalid={() => setEmailChecked(true)}
                    inputRef={emailRef}
                    error={emailChecked ? emailError : ''}
                  />
                </div>
                <Field
                  label="subject"
                  type="text"
                  name="subject"
                  placeholder="Collaboration / Event / General Enquiry"
                  value={form.subject}
                  onChange={handleChange}
                />
                <Field
                  label="message"
                  as="textarea"
                  name="message"
                  rows={5}
                  placeholder="Tell us how we can help..."
                  value={form.message}
                  onChange={handleChange}
                  className="field resize-y"
                />
                {SENDS_ITSELF && (
                  // Hidden from people and from the keyboard; see handleSubmit.
                  <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                )}
                <p className="meta">
                  {SENDS_ITSELF
                    ? 'goes straight to the club’s inbox — nothing is stored on this site'
                    : 'opens your own email app — nothing is stored on this site'}
                </p>
                <p className="meta">
                  outside rec? write to{' '}
                  <a href={CLUB_MAILTO} className="break-all underline decoration-2 underline-offset-4">
                    {CLUB_EMAIL}
                  </a>
                </p>
                {failed && (
                  <p role="alert" className="text-[14px] font-bold">
                    <span className="font-mono text-[12px] font-medium">error · </span>
                    That didn&apos;t go through. Try again, or{' '}
                    <button type="button" onClick={draftInEmailApp} className="font-bold underline decoration-2 underline-offset-4">
                      send it from your email app
                    </button>
                    .
                  </p>
                )}
                <Button type="submit" className="w-full" disabled={sending} aria-busy={sending || undefined}>
                  {SENDS_ITSELF ? (sending ? 'Sending…' : 'Send message') : 'Send via email'}
                </Button>
              </form>
            )}
          </Slam>
        </div>
      </section>
    </>
  )
}
