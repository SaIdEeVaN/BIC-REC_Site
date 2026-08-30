import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Share2, Send, CheckCircle } from 'lucide-react'
import { FiInstagram, FiLinkedin, FiMail } from 'react-icons/fi'
import PageTransition from '../components/PageTransition'
import Button from '../components/ui/Button'

const contactInfo = [
  { icon: Mail, label: 'Email Us', value: 'kbaclub@rajalakshmil.edu.in', color: 'text-primary', href: 'mailto:kbaclub@rajalakshmil.edu.in' },
  { icon: MapPin, label: 'Location', value: 'Rajalakshmi Engineering College, Thandalam, Chennai – 602105', color: 'text-accent', href: null },
  { icon: Share2, label: 'Follow Us', value: 'Find us on Instagram & LinkedIn', color: 'text-emerald-400', href: null },
]

const socials = [
  { icon: FiInstagram, label: 'Instagram', handle: '@bic.rec', href: 'https://www.instagram.com/bic.rec?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==', bg: 'from-pink-600 to-rose-600' },
  { icon: FiLinkedin, label: 'LinkedIn', handle: 'Blockchain Innovation Club', href: 'https://www.linkedin.com/company/bicrec', bg: 'from-blue-600 to-indigo-600' },
  { icon: FiMail, label: 'Email', handle: 'kbaclub@rajalakshmil.edu.in', href: 'mailto:kbaclub@rajalakshmil.edu.in', bg: 'from-primary to-accent' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <PageTransition>
      {/* Page Hero */}
      <div className="relative py-36 bg-surface overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-primary text-sm font-semibold tracking-widest uppercase mb-4"
          >
            Get in Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading font-bold text-5xl md:text-6xl text-text-primary mb-6"
          >
            Let's{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Connect
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-lg max-w-2xl mx-auto"
          >
            For collaborations, events, workshops, and general enquiries — we'd love to hear from you.
          </motion.p>
        </div>
      </div>

      {/* Contact info cards */}
      <section className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {contactInfo.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface border border-border-subtle rounded-2xl p-6 text-center hover:border-primary/30 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4`}>
                  <c.icon size={20} className={c.color} />
                </div>
                <h4 className="font-heading font-semibold text-text-primary mb-2">{c.label}</h4>
                {c.href ? (
                  <a href={c.href} className="text-text-muted text-sm hover:text-primary transition-colors">
                    {c.value}
                  </a>
                ) : (
                  <p className="text-text-muted text-sm">{c.value}</p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Social links */}
            <div>
              <h3 className="font-heading font-bold text-2xl text-text-primary mb-6">Find Us Online</h3>
              <div className="grid grid-cols-2 gap-4">
                {socials.map((s, i) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.04, y: -3 }}
                    className={`p-6 rounded-2xl bg-gradient-to-br ${s.bg} text-white flex flex-col items-start gap-2 group`}
                  >
                    <s.icon size={24} />
                    <div>
                      <div className="font-heading font-bold text-sm">{s.label}</div>
                      <div className="text-white/70 text-xs">{s.handle}</div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div>
              <h3 className="font-heading font-bold text-2xl text-text-primary mb-6">Send a Message</h3>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
                  <h4 className="font-heading font-bold text-xl text-text-primary mb-2">Message Sent!</h4>
                  <p className="text-text-muted">Thanks for reaching out! We'll get back to you within 48 hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                    className="mt-6 text-primary text-sm hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-text-muted text-xs font-medium mb-2">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        className="input-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted text-xs font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className="input-dark"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-text-muted text-xs font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      placeholder="Collaboration / Event / General Enquiry"
                      value={form.subject}
                      onChange={handleChange}
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted text-xs font-medium mb-2">Message</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us how we can help..."
                      value={form.message}
                      onChange={handleChange}
                      className="input-dark resize-none"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full justify-center">
                    <Send size={16} /> Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
