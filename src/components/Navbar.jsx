import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.css';
import collegeLogo from '../assets/logo/college.png';

const Navbar = () => {
    const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);
    const location = useLocation();
    const headerRef = useRef(null);

    const close = () => setIsMobileMenuActive(false);

    // Dynamically calculate header height to prevent overlaps globally
    useEffect(() => {
        if (!headerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            const navHeight = entries[0].target.offsetHeight;
            document.documentElement.style.setProperty('--navbar-height', `${navHeight}px`);
        });
        resizeObserver.observe(headerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = isMobileMenuActive ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuActive]);

    // Close menu on route change
    useEffect(() => { close(); }, [location]);

    const mobileMenu = ReactDOM.createPortal(
        <>
            <nav
                className={`mobile-nav ${isMobileMenuActive ? 'mobile-nav--open' : ''}`}
                aria-label="Mobile Navigation"
            >
                <button className="mobile-nav__close" onClick={close} aria-label="Close menu">
                    <X size={28} />
                </button>

                <Link to="/" className={location.pathname === '/' ? 'mobile-nav__link active' : 'mobile-nav__link'} style={{ '--i': 1 }} onClick={close}>Home</Link>
                <Link to="/about" className={location.pathname === '/about' ? 'mobile-nav__link active' : 'mobile-nav__link'} style={{ '--i': 2 }} onClick={close}>About Us</Link>
                <Link to="/events" className={location.pathname === '/events' ? 'mobile-nav__link active' : 'mobile-nav__link'} style={{ '--i': 3 }} onClick={close}>Events</Link>
                <Link to="/gallery" className={location.pathname === '/gallery' ? 'mobile-nav__link active' : 'mobile-nav__link'} style={{ '--i': 4 }} onClick={close}>Gallery</Link>
                <Link to="/contact" className={location.pathname === '/contact' ? 'mobile-nav__link active' : 'mobile-nav__link'} style={{ '--i': 5 }} onClick={close}>Contact Us</Link>
            </nav>
        </>,
        document.body
    );

    return (
        <>
            <header className="header" ref={headerRef}>
                <div className="logo-container flex items-center">
                    <Link to="/" onClick={close}>
                        <img src={collegeLogo} className="logo-left h-[42px] w-auto object-contain" alt="College Logo" />
                    </Link>
                </div>

                <nav className="navbar" aria-label="Main Navigation">
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={close}>Home</Link>
                    <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={close}>About Us</Link>
                    <Link to="/events" className={location.pathname === '/events' ? 'active' : ''} onClick={close}>Events</Link>
                    <Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''} onClick={close}>Gallery</Link>
                    <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''} onClick={close}>Contact Us</Link>
                </nav>

                <button
                    className="mobile-menu-btn"
                    aria-label={isMobileMenuActive ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMobileMenuActive}
                    onClick={() => setIsMobileMenuActive(prev => !prev)}
                    style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    {isMobileMenuActive ? <X size={20} /> : <Menu size={20} />}
                </button>
            </header>

            {mobileMenu}
        </>
    );
};

export default Navbar;
