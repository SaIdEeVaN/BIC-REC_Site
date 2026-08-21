// EventGallery.jsx
import React, { useEffect, useState, useMemo, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import "./Events.css";

import { events as EVENTS } from "../data/events";
import heroBg from "../assets/hero_bg.jpg";

const EVENT_PHOTOS = {};
const FILTERS = [
  { key: "all", label: "All Events" },
  { key: "Workshop", label: "Workshops" },
  { key: "Hackathon", label: "Hackathons" },
  { key: "Guest Lecture", label: "Guest Lectures" },
  { key: "Competition", label: "Competitions" }
];

// subtle unique rotation per index (kept but clamped)
const getRandomRotation = (index) => {
  const seed = (index + 3) * 7919;
  const val = ((seed % 9) - 4); // -4 to 4 degrees, small
  return val;
};

const eventIntroClass = (event) => {
  if (!event) return "eg-photo-intro-generic";
  switch (event.category) {
    case "Workshop":
      return "eg-photo-intro-workshop";
    case "Guest Lecture":
      return "eg-photo-intro-talk";
    case "Competition":
      return "eg-photo-intro-competition";
    default:
      return "eg-photo-intro-generic";
  }
};

export default function EventGallery() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxEvent, setLightboxEvent] = useState(null);

  const [photoViewerEvent, setPhotoViewerEvent] = useState(null);
  const [photoIntroDone, setPhotoIntroDone] = useState(false);
  const [photoCycleIndex, setPhotoCycleIndex] = useState(0);
  const [photoGridTransform, setPhotoGridTransform] = useState({
    rotateX: 16,
    rotateY: -10
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true
    });
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return EVENTS;
    return EVENTS.filter((e) => e.type === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    setActiveIndex(0);
  }, [activeFilter]);

  // auto slideshow
  useEffect(() => {
    if (!filteredEvents.length) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) =>
        prev + 1 >= filteredEvents.length ? 0 : prev + 1
      );
    }, 7000);
    return () => clearInterval(interval);
  }, [filteredEvents.length]);

  const currentEvent = filteredEvents[activeIndex] || null;

  const handleNext = () => {
    if (!filteredEvents.length) return;
    setActiveIndex((prev) =>
      prev + 1 >= filteredEvents.length ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    if (!filteredEvents.length) return;
    setActiveIndex((prev) =>
      prev - 1 < 0 ? filteredEvents.length - 1 : prev - 1
    );
  };

  const openPhotoViewer = (eventObj) => {
    setPhotoViewerEvent(eventObj);
    setPhotoIntroDone(false);
    setPhotoCycleIndex(0);
    setPhotoGridTransform({ rotateX: 16, rotateY: -10 });
  };

  // auto cycle photos only after intro
  useEffect(() => {
    if (!photoViewerEvent || !photoIntroDone) return;
    const photos = EVENT_PHOTOS[photoViewerEvent.id] || [
      photoViewerEvent.image || heroBg
    ];
    if (!photos.length) return;

    const interval = setInterval(() => {
      setPhotoCycleIndex((prev) =>
        prev + 1 >= photos.length ? 0 : prev + 1
      );
    }, 3500);
    return () => clearInterval(interval);
  }, [photoViewerEvent, photoIntroDone]);

  const currentPhotoSrc =
    photoViewerEvent &&
    (EVENT_PHOTOS[photoViewerEvent.id] || [photoViewerEvent.image || heroBg])[
    photoCycleIndex
    ];

  const handlePhotoMouseMove = (e) => {
    if (!photoViewerEvent) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 14;
    const rotateX = (0.5 - y) * 14;

    setPhotoGridTransform({
      rotateX,
      rotateY
    });
  };

  // keyboard navigation inside viewer
  useEffect(() => {
    if (!photoViewerEvent) return;
    const handler = (e) => {
      if (e.key === "Escape") {
        setPhotoViewerEvent(null);
        return;
      }
      if (!photoIntroDone) {
        // hitting any key exits intro fast
        setPhotoIntroDone(true);
        return;
      }

      const photos =
        EVENT_PHOTOS[photoViewerEvent.id] || [photoViewerEvent.image || heroBg];
      if (!photos.length) return;

      if (e.key === "ArrowRight") {
        setPhotoCycleIndex((prev) =>
          prev + 1 >= photos.length ? 0 : prev + 1
        );
      }
      if (e.key === "ArrowLeft") {
        setPhotoCycleIndex((prev) =>
          prev - 1 < 0 ? photos.length - 1 : prev - 1
        );
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [photoViewerEvent, photoIntroDone]);

  return (
    <div className="eg-body">
      <Navbar />

      {/* HERO */}
      <section className="eg-hero">
        <div className="cyber-grid" />
        <div className="hero-noise" />

        <div className="hero-content" data-aos="fade-up">
          <h1 className="glitch-text">
            <span>EVENT</span>
            <span> GALLERY</span>
          </h1>
          <p className="hero-subtitle">
            Explore our curated collection of workshops, hackathons, and expert
            talks hosted by the Blockchain Innovation Club.
          </p>

          <a
            href="#events-main"
            className="btn-join-cyber"
            style={{ marginTop: "40px" }}
          >
            <span className="btn-text">BROWSE EVENTS</span>
          </a>
        </div>
      </section>

      {/* FILTERS */}
      <div id="events-main" className="eg-filters" data-aos="fade-up">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={
              "eg-filter-btn " + (activeFilter === f.key ? "active" : "")
            }
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <main className="eg-main">
        {/* SLIDESHOW */}
        <section
          className="eg-slideshow eg-slide-animate"
          key={currentEvent ? currentEvent.id : "empty"}
          data-aos="fade-up"
        >
          {currentEvent ? (
            <>
              <div className="eg-slide-bg">
                <img
                  src={currentEvent.image || heroBg}
                  alt=""
                  className="eg-slide-bg-img"
                  fetchpriority="high"
                  decoding="async"
                />
              </div>
              <div className="eg-slide-overlay" />
              <div className="eg-slide-content">
                <div className="eg-slide-meta">
                  <span className="eg-pill">
                    {(currentEvent.type || "").toUpperCase()}
                  </span>
                  <span className="eg-pill-soft">
                    {currentEvent.status === 'upcoming' ? "UPCOMING" : "PAST EVENT"}
                  </span>
                </div>
                <h2 className="eg-slide-title">{currentEvent.title}</h2>
                <p className="eg-slide-description">
                  {currentEvent.description}
                </p>
                <div className="eg-slide-info">
                  <span>
                    <i className="far fa-calendar" /> {currentEvent.date}
                  </span>
                  <span>
                    <i className="far fa-clock" /> {currentEvent.time}
                  </span>
                  <span>
                    <i className="fas fa-location-dot" /> {currentEvent.venue}
                  </span>
                </div>
                <div className="eg-slide-actions">
                  <button
                    className="eg-btn-primary"
                    onClick={() => setLightboxEvent(currentEvent)}
                  >
                    View Full Details
                  </button>
                  <button
                    className="eg-btn-ghost"
                    onClick={() => openPhotoViewer(currentEvent)}
                  >
                    View Photo Dump
                  </button>
                </div>
              </div>

              <button className="eg-nav-btn prev" onClick={handlePrev}>
                <i className="fas fa-chevron-left" />
              </button>
              <button className="eg-nav-btn next" onClick={handleNext}>
                <i className="fas fa-chevron-right" />
              </button>

              <div className="eg-dots">
                {filteredEvents.map((e, idx) => (
                  <button
                    key={e.id}
                    className={
                      "eg-dot " + (idx === activeIndex ? "active" : "")
                    }
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="eg-empty-state">
              <p>
                No events found for this category at the moment. Please check
                back later!
              </p>
            </div>
          )}
        </section>

        {/* GRID OF EVENTS */}
        <section className="eg-grid-section" data-aos="fade-up">
          <h3 className="eg-section-title">All Moments</h3>
          <div className="eg-grid">
            {filteredEvents.map((e, idx) => (
              <article
                key={e.id}
                className={
                  "eg-card" +
                  (idx === activeIndex ? " eg-card-active" : "") +
                  " eg-card-animate"
                }
                onClick={() => {
                  setActiveIndex(idx);
                  openPhotoViewer(e);
                }}
                style={{ "--eg-card-index": idx }}
              >
                <div className="eg-card-img-wrap">
                  <img
                    src={e.image || heroBg}
                    alt={e.title}
                    className="eg-card-img"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="eg-card-img-overlay" />
                </div>
                <div className="eg-card-body">
                  <div className="eg-card-top">
                    <span className="eg-card-category">
                      {(e.type || "").toUpperCase()}
                    </span>
                    <span className="eg-card-date">{e.date}</span>
                  </div>
                  <h4 className="eg-card-title">{e.title}</h4>
                  <p className="eg-card-desc">{e.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* LIGHTBOX (SINGLE POSTER IMAGE) */}
      {lightboxEvent && (
        <div className="eg-lightbox" onClick={() => setLightboxEvent(null)}>
          <div
            className="eg-lightbox-inner eg-lightbox-animate"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="eg-lightbox-close"
              onClick={() => setLightboxEvent(null)}
            >
              <i className="fas fa-times" />
            </button>
            <div className="eg-lightbox-media">
              <img
                src={lightboxEvent.image || heroBg}
                alt={lightboxEvent.title}
                className="eg-lightbox-img"
                decoding="async"
              />
            </div>
            <div className="eg-lightbox-details">
              <span className="eg-pill">
                {(lightboxEvent.type || "").toUpperCase()}
              </span>
              <h2>{lightboxEvent.title}</h2>
              <p className="eg-lightbox-text">{lightboxEvent.description}</p>
              <div className="eg-lightbox-meta">
                <div>
                  <span className="eg-meta-label">Date</span>
                  <span className="eg-meta-value">
                    {lightboxEvent.date || "TBA"}
                  </span>
                </div>
                <div>
                  <span className="eg-meta-label">Time</span>
                  <span className="eg-meta-value">
                    {lightboxEvent.time || "TBA"}
                  </span>
                </div>
                <div>
                  <span className="eg-meta-label">Venue</span>
                  <span className="eg-meta-value">
                    {lightboxEvent.venue || "TBA"}
                  </span>
                </div>
              </div>
              <div className="eg-lightbox-footer">
                {lightboxEvent.status === 'upcoming' ? (
                  <a
                    href="https://forms.gle/fqW2GKM7w2gqeTAK6"
                    target="_blank"
                    rel="noreferrer"
                    className="eg-btn-primary"
                  >
                    Register Now
                  </a>
                ) : (
                  <span className="eg-status-closed">Registration Closed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMMERSIVE PHOTO VIEWER */}
      {photoViewerEvent && (
        <div
          className="eg-photo-viewer"
          onClick={() => {
            setPhotoViewerEvent(null);
          }}
        >
          <div
            className="eg-photo-viewer-inner"
            onClick={(e) => e.stopPropagation()}
            onMouseMove={handlePhotoMouseMove}
          >
            <button
              className="eg-lightbox-close eg-photo-viewer-close"
              onClick={() => setPhotoViewerEvent(null)}
            >
              <i className="fas fa-times" />
            </button>

            {/* reactive grid bg */}
            <div
              className="eg-photo-bg-grid"
              style={{
                transform: `perspective(900px) rotateX(${photoGridTransform.rotateX}deg) rotateY(${photoGridTransform.rotateY}deg)`
              }}
            />
            <div className="eg-photo-bg-noise" />

            {/* EVENT-SPECIFIC INTRO (FULLSCREEN) */}
            {!photoIntroDone && (
              <div
                className={
                  "eg-photo-intro-full " + eventIntroClass(photoViewerEvent)
                }
                onAnimationEnd={() => setPhotoIntroDone(true)}
                onClick={() => setPhotoIntroDone(true)} // tap to skip
              >
                <div className="eg-photo-intro-left">
                  <span className="eg-pill eg-photo-intro-tag">
                    {(photoViewerEvent.type || "").toUpperCase()}
                  </span>
                  <h2 className="eg-photo-intro-title">
                    {photoViewerEvent.title}
                  </h2>
                  <p className="eg-photo-intro-meta">
                    {photoViewerEvent.date} • {photoViewerEvent.venue}
                  </p>
                  <p className="eg-photo-intro-desc">
                    {photoViewerEvent.description}
                  </p>
                  <div className="eg-photo-intro-hint">
                    <span className="eg-photo-intro-dot" />
                    <span>
                      Immersive recap loading. Tap or press any key to enter.
                    </span>
                  </div>
                </div>
                <div className="eg-photo-intro-right">
                  <div className="eg-photo-intro-preview">
                    <img
                      src={
                        (EVENT_PHOTOS[photoViewerEvent.id] ||
                          [photoViewerEvent.image || heroBg])[0]
                      }
                      alt={photoViewerEvent.title}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="eg-photo-intro-scrim" />
                  </div>
                </div>
              </div>
            )}

            {/* BINGE-WORTHY FLOW */}
            {photoIntroDone && (
              <div className="eg-photo-immersive-layout">
                {/* LEFT: header + main photo + progress */}
                <div className="eg-photo-main-column">
                  <header className="eg-photo-header">
                    <div className="eg-photo-header-text">
                      <span className="eg-pill eg-photo-header-pill">
                        {(photoViewerEvent.type || "").toUpperCase()}
                      </span>
                      <h2 className="eg-photo-header-title">
                        {photoViewerEvent.title}
                      </h2>
                      <p className="eg-photo-header-sub">
                        {photoViewerEvent.date} • {photoViewerEvent.venue}
                      </p>
                    </div>
                    <div className="eg-photo-header-count">
                      <span className="eg-photo-count-current">
                        {photoCycleIndex + 1}
                      </span>
                      <span className="eg-photo-count-divider">/</span>
                      <span className="eg-photo-count-total">
                        {(EVENT_PHOTOS[photoViewerEvent.id] ||
                          [photoViewerEvent.image]).length}
                      </span>
                    </div>
                  </header>

                  <div
                    className="eg-photo-main-frame"
                    onClick={() => {
                      const photos =
                        EVENT_PHOTOS[photoViewerEvent.id] ||
                        [photoViewerEvent.image || heroBg];
                      setPhotoCycleIndex((prev) =>
                        prev + 1 >= photos.length ? 0 : prev + 1
                      );
                    }}
                  >
                    <div className="eg-photo-main-parallax">
                      <img
                        src={currentPhotoSrc}
                        alt={photoViewerEvent.title}
                        className="eg-photo-main-img"
                        key={currentPhotoSrc}
                        decoding="async"
                        loading="eager"
                      />
                    </div>
                    <div className="eg-photo-main-hint">
                      Click or press → to jump to next • ← to go back
                    </div>
                  </div>

                  <div className="eg-photo-progress">
                    <div
                      className="eg-photo-progress-bar"
                      style={{
                        width: `${((photoCycleIndex + 1) /
                            (EVENT_PHOTOS[photoViewerEvent.id] ||
                              [photoViewerEvent.image || heroBg]).length) * 100
                          }%`
                      }}
                    />
                  </div>
                </div>

                {/* RIGHT: vertical film-strip */}
                <aside className="eg-photo-strip-column">
                  <div className="eg-photo-strip-header">
                    <span className="eg-photo-strip-label">Photo reel</span>
                    <span className="eg-photo-strip-hint">
                      Scroll & pick any frame
                    </span>
                  </div>
                  <div className="eg-photo-strip-scroll">
                    {(EVENT_PHOTOS[photoViewerEvent.id] ||
                      [photoViewerEvent.image || heroBg]
                    ).map((src, idx) => {
                      const rotation = getRandomRotation(idx);
                      const active = idx === photoCycleIndex;
                      return (
                        <button
                          key={idx}
                          className={
                            "eg-photo-strip-item" +
                            (active ? " eg-photo-strip-item-active" : "")
                          }
                          style={{
                            transform: `rotate(${rotation}deg)`
                          }}
                          onClick={() => setPhotoCycleIndex(idx)}
                        >
                          <div className="eg-photo-strip-img-wrap">
                            <img
                              src={src}
                              alt=""
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <span className="eg-photo-strip-index">
                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </aside>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="eg-footer">
        &copy; 2026 Blockchain Innovation Club — Rajalakshmi Engineering College
      </footer>
    </div>
  );
}