import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, Chip, PageHeader } from '../components/kit'
import { shortHash } from '../lib/chain'
import { LiftCell, Mine, Reveal, Slam, SplitText, Stamp } from '../components/motion'

const CLUB_EMAIL = 'kbaclub@rajalakshmil.edu.in'
const EMPTY = { name: '', email: '', subject: '', message: '' }

// The site has no backend, so the message is handed to the visitor's own email app, addressed to the club.
const mailtoFor = (form) =>
  `mailto:${CLUB_EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(
    `${form.message}\n\n— ${form.name} (${form.email})`
  )}`

const contactInfo = [
  { label: 'email us', value: 'kbaclub@rajalakshmil.edu.in', href: 'mailto:kbaclub@rajalakshmil.edu.in' },
  { label: 'location', value: 'Rajalakshmi Engineering College, Thandalam, Chennai – 602105' },
  { label: 'follow us', value: 'Find us on Instagram & LinkedIn' },
]

const socials = [
  { label: 'Instagram', handle: '@bic.rec', href: 'https://www.instagram.com/bic.rec?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==' },
  { label: 'LinkedIn', handle: 'blockchain innovation club', href: 'https://www.linkedin.com/company/bicrec' },
  { label: 'Email', handle: 'kbaclub@rajalakshmil.edu.in', href: 'mailto:kbaclub@rajalakshmil.edu.in' },
]

function Field({ label, as: Tag = 'input', ...props }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <Tag required className="field" {...props} />
    </label>
  )
}

export default function Contact() {
  const [searchParams] = useSearchParams()
  // Links like /contact?subject=Membership%20application pre-fill the subject.
  const [form, setForm] = useState(() => ({ ...EMPTY, subject: searchParams.get('subject') ?? '' }))
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    window.location.href = mailtoFor(form)
    setSubmitted(true)
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
                    <span className="t-card decoration-[3px] underline-offset-[5px] group-hover:underline">
                      {s.label}
                    </span>
                    <span className="meta break-all">{s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Slam className="border-3 border-ink bg-bone p-6 shadow-ink md:p-8">
            {submitted ? (
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
                  <a href={`mailto:${CLUB_EMAIL}`} className="break-all font-bold underline decoration-2 underline-offset-4">
                    {CLUB_EMAIL}
                  </a>
                  .
                </p>
                <Button
                  variant="bone"
                  className="mt-8"
                  onClick={() => {
                    setSubmitted(false)
                    setForm(EMPTY)
                  }}
                >
                  Write another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h2 className="t-h3">Send a message</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="your name" type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
                  <Field label="email address" type="email" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} />
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
                <p className="meta">opens your own email app — nothing is stored on this site</p>
                <Button type="submit" className="w-full">Send via email</Button>
              </form>
            )}
          </Slam>
        </div>
      </section>
    </>
  )
}
