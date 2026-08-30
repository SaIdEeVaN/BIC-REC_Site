import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import './Home.css';
import Navbar from '../components/Navbar';
import heroBg from '../assets/hero_bg.jpg';
import { getFeaturedEvents } from '../data/events';

const StatCounter = ({ target, suffix, label, start }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const duration = 1800;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [start, target]);
    return (
        <div className="stat-item">
            <span className="stat-num">{count}{suffix}</span>
            <span className="stat-label">{label}</span>
        </div>
    );
};

const stats = [
    { value: 12, suffix: '+', label: 'Annual Events' },
    { value: 60, suffix: '+', label: 'Active Members' },
    { value: 2, suffix: '+', label: 'Years Active' },
    { value: 15, suffix: '+', label: 'Workshops' },
];

const pillars = [
    { icon: 'fas fa-code', title: 'Technical Skills', desc: 'Workshops, hackathons and live projects to make you industry-ready.' },
    { icon: 'fas fa-users', title: 'Strong Community', desc: 'A network of 60+ driven students who push each other to excel in Web3.' },
    { icon: 'fas fa-link', title: 'Decentralized Future', desc: "Direct connection to the global blockchain and Web3 professional network." },
];

const Home = () => {
    const [statsVisible, setStatsVisible] = useState(false);
    const statsRef = useRef(null);
    const location = useLocation();
    const featuredEvents = getFeaturedEvents();
    const particlesInit = useCallback(async (engine) => { await loadSlim(engine); }, []);

    useEffect(() => {
        AOS.init({ duration: 900, easing: 'ease-out-quart', once: true, offset: 80 });
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
            { threshold: 0.3 }
        );
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    const particlesOptions = {
        particles: {
            number: { value: 45, density: { enable: true, area: 1000 } },
            color: { value: '#FFA300' },
            shape: { type: 'circle' },
            opacity: { value: 0.22, random: true },
            size: { value: 2, random: true },
            links: { enable: true, distance: 160, color: '#FFA300', opacity: 0.07, width: 1 },
            move: { enable: true, speed: 1.0, direction: 'none', random: true, outModes: 'out' },
        },
        interactivity: {
            events: { onHover: { enable: true, mode: 'grab' }, resize: true },
            modes: { grab: { distance: 150, links: { opacity: 0.25 } } },
        },
        retina_detect: true,
    };

    return (
        <div className="home-wrap">
            <Navbar />
            <div id="particles-js">
                <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
            </div>

            {/* HERO */}
            <section className="hero-section" id="home">
                <div className="hero-visual-col" data-aos="fade-in" data-aos-duration="2000" style={{ backgroundImage: `url(${heroBg})` }} />
                <div className="hero-inner">
                    <div className="hero-text-col" data-aos="fade-right">
                        <h1 className="hero-heading">BUILD.<br /><span className="hero-glow-text">INNOVATE.</span><br />DECENTRALIZE.</h1>
                        <p className="hero-line1">Rajalakshmi Engineering College's premier Blockchain student chapter.</p>
                        <p className="hero-line2">Empowering the next generation of Web3 pioneers.</p>
                        <img src={heroBg} alt="Blockchain Tech Illustration" className="mob-chip-img" />
                        <div className="hero-scroll-hint">
                            <span className="scroll-label">SCROLL TO EXPLORE</span>
                            <div className="scroll-mouse"><span className="scroll-dot" /></div>
                        </div>
                        <div className="hero-ctas">
                            <Link to="/join" className="btn-hero-primary">Join Club Now</Link>
                            <Link to="/events" className="btn-hero-secondary">Explore Events</Link>
                        </div>
                    </div>
                    <div className="hero-grid-spacer" />
                </div>
            </section>

            {/* PILLARS */}
            <section className="pillars-section">
                <div className="pillars-inner">
                    <span className="section-label" data-aos="fade-up">About the Chapter</span>
                    <h2 className="section-title" data-aos="fade-up" data-aos-delay="80">One Club. Endless Opportunities.</h2>
                    <p className="section-sub" data-aos="fade-up" data-aos-delay="140">Founded at Rajalakshmi Engineering College, our Blockchain Innovation Club accelerates the journey from curious student to Web3 professional.</p>
                    <div className="pillars-grid">
                        {pillars.map((p, i) => (
                            <div className="pillar-card" key={i} data-aos="fade-up" data-aos-delay={i * 120}>
                                <div className="pillar-icon"><i className={p.icon} /></div>
                                <h3>{p.title}</h3>
                                <p>{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="stats-section" ref={statsRef}>
                <div className="stats-inner">
                    {stats.map((s, i) => (
                        <StatCounter key={i} target={s.value} suffix={s.suffix} label={s.label} start={statsVisible} />
                    ))}
                </div>
            </section>

            {/* EVENTS */}
            <section className="events-section" id="events">
                <div className="events-inner">
                    <span className="section-label" data-aos="fade-up">What We Run</span>
                    <h2 className="section-title" data-aos="fade-up" data-aos-delay="80">Events That Define Us</h2>
                    <div className="events-grid">
                        {featuredEvents.map((ev, i) => (
                            <div className="event-tile" key={i} data-aos="fade-up" data-aos-delay={i * 120}>
                                <div className="event-img-wrap">
                                    <img src={heroBg} alt={ev.title} />
                                    <span className="ev-tag">{ev.type}</span>
                                </div>
                                <div className="event-body">
                                    <h3>{ev.title}</h3>
                                    <p>{ev.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="events-cta-wrap" data-aos="fade-up">
                        <Link to="/events" className="btn-outline-gold">View All Events &nbsp;<i className="fas fa-arrow-right" /></Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="site-footer" id="contact">
                <div className="footer-inner">
                    <div className="footer-brand" data-aos="fade-right">
                        <p className="hero-glow-text" style={{fontSize: "1.5rem", fontWeight: "bold", margin: 0}}>BIC REC</p>
                        <p>Blockchain Innovation Club<br />Rajalakshmi Engineering College<br />Chennai, Tamil Nadu, India</p>
                        <div className="footer-socials">
                            <a href="https://www.instagram.com/bic.rec?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram" /></a>
                            <a href="https://www.linkedin.com/company/bicrec" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin" /></a>
                            <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube" /></a>
                        </div>
                    </div>
                    <div className="footer-contacts" data-aos="fade-up">
                        <h4>Faculty Coordinators</h4>
                        {[
                            { name: 'Dr. N. Duraimurugan', email: 'duraimurugan.n@rajalakshmi.edu.in' }
                        ].map((c, i) => (
                            <div className="fc-row" key={i}>
                                <strong>{c.name}</strong>
                                <a href={`mailto:${c.email}`}><i className="fas fa-envelope" /> {c.email}</a>
                            </div>
                        ))}
                    </div>
                    <div className="footer-cta" data-aos="fade-left">
                        <h4>Ready to level up?</h4>
                        <p>Join the Blockchain Innovation Club and unlock a global community of Web3 professionals, resources, and opportunities.</p>
                        <Link to="/join" className="btn-primary-gold">Become a Member</Link>
                    </div>
                </div>
                <div className="footer-bar">&copy; 2026 Blockchain Innovation Club — Rajalakshmi Engineering College</div>
            </footer>
        </div>
    );
};

export default Home;
