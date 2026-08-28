import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import './About.css';

import recCollegeImg from '../assets/logo/college.png';
import iccdsImg from '../assets/hero_bg.jpg';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const mainRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // 1. GRAND HERO ENTRANCE
            const heroTl = gsap.timeline();
            heroTl.fromTo(".main-title", 
                { scale: 0.8, opacity: 0, letterSpacing: "20px" },
                { scale: 1, opacity: 1, letterSpacing: "4px", duration: 2, ease: "expo.out" }
            ).from(".hero-line", { width: 0, duration: 1.5, ease: "power4.inOut" }, "-=1");

            // 2. SLOW ZIGZAG REVEAL
            const sections = gsap.utils.toArray('.pin-section');
            sections.forEach((section) => {
                const num = section.querySelector('.section-num');
                const head = section.querySelector('.section-head');
                const img = section.querySelector('.floating-img');
                const box = section.querySelector('.text-overlay-box');

                const sectionTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: "top 65%", // Triggers slightly later for better focus
                        toggleActions: "play none none reverse"
                    }
                });

                sectionTl
                    .from(num, { y: 50, opacity: 0, duration: 1.5, ease: "power3.out" })
                    .from(head, { y: 30, opacity: 0, duration: 1.5, ease: "power3.out" }, "-=1.2")
                    .fromTo(img, 
                        { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, scale: 1.1 }, 
                        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, scale: 1, duration: 2.5, ease: "power2.inOut" }, 
                        "-=1.5"
                    )
                    .from(box, { x: 50, opacity: 0, duration: 1.5, ease: "expo.out" }, "-=1");
            });

        }, mainRef);
        return () => ctx.revert();
    }, []);

    return (
        <div className="aboutPage" ref={mainRef}>
            <Navbar />
            
            <section className="pageHero">
                <div className="hero-content">
                    <h2 className="main-title">ABOUT US</h2>
                    <div className="hero-line"></div>
                </div>
            </section>

            {/* 01. JOURNEY (Left Title, Right Image) */}
            <section className="pin-section">
                <div className="side-title">
                    <span className="section-num">01</span>
                    <h3 className="section-head">THE JOURNEY</h3>
                </div>
                <div className="side-content">
                    <div className="image-wrapper">
                        <img src={recCollegeImg} alt="Journey" className="floating-img" />
                        <div className="text-overlay-box small-box overlap-left">
                            <p>Founded in 2010, we've bridged the gap between student curiosity and industry expertise through immersive tech experiences.</p>
                        </div>
                    </div>
                </div>
            </section>
            

            {/* 02. IMPACT (Right Title, Left Image - ZIGZAG) */}
            <section className="pin-section reverse">
                <div className="side-title">
                    <span className="section-num">02</span>
                    <h3 className="section-head">OUR IMPACT</h3>
                </div>
                <div className="side-content">
                    <div className="image-wrapper">
                        <img src={iccdsImg} alt="Impact" className="floating-img" />
                        <div className="text-overlay-box small-box overlap-right">
                            <p>Transforming 750+ students into industry-ready professionals through award-winning projects and career-launching initiatives.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 03. ETHOS (Left Title, Right Image) */}
            <section className="pin-section">
                <div className="side-title">
                    <span className="section-num">03</span>
                    <h3 className="section-head">OUR ETHOS</h3>
                </div>
                <div className="side-content">
                    <div className="image-wrapper">
                        <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1470&q=80" alt="Ethos" className="floating-img" />
                        <div className="text-overlay-box small-box overlap-left">
                            <p>We believe in collaborative innovation, fostering a mindset where every member contributes to our collective tech success.</p>
                        </div>
                    </div>
                </div>
            </section>

            

            <footer class="simple-footer">
  © 2026 <span>   Blockchain Innovation Club</span> — Rajalakshmi Engineering College
</footer>
        </div>
    );
};

export default About;