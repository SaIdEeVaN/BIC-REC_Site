import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation'
import ParticleBackground from './ParticleBackground'
import heroBg from '../assets/hero_bg.jpg'

const marqueeItems = [
  'BLOCKCHAIN', 'WEB3', 'SMART CONTRACTS', 'DEFI', 'CRYPTOCURRENCY', 'DAPPS', 'ETHEREUM', 'POLYGON', 'SOLIDITY', 'ZK-ROLLUPS', 'DAOS'
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-dark">
      {/* Background elements */}
      <ParticleBackground />
      
      {/* Right side visual column (like reference site) */}
      <div 
        className="absolute top-0 right-0 w-full md:w-1/2 h-[50vh] md:h-full bg-cover bg-center bg-no-repeat opacity-40 md:opacity-80 z-0 mask-image-gradient"
        style={{ 
          backgroundImage: `url(${heroBg})`,
          maskImage: 'linear-gradient(to right, transparent, black 40%)',
          WebkitMaskImage: '-webkit-linear-gradient(left, transparent, black 40%)'
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 max-w-7xl mx-auto w-full pt-32 md:pt-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="h-[2px] w-12 bg-primary"></div>
            <span className="text-primary font-sans font-semibold tracking-widest uppercase text-sm">Rajalakshmi Engineering College</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading font-bold text-7xl md:text-8xl lg:text-[9rem] text-text-primary leading-[0.85] tracking-wide mb-6"
          >
            BUILD.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-[0_0_15px_rgba(201,162,39,0.5)]">
              INNOVATE.
            </span> <br />
            DECENTRALIZE.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-sans text-xl md:text-2xl text-text-muted mb-8 max-w-xl font-light"
          >
            Empowering the next generation of Web3 pioneers and blockchain developers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/join"
              className="inline-flex h-14 items-center justify-center px-10 rounded bg-primary text-dark font-bold font-sans tracking-wide transition-all hover:bg-primary-light hover:-translate-y-1 shadow-[0_4px_20px_rgba(201,162,39,0.3)]"
            >
              Join the Club
            </Link>
            <Link
              to="/events"
              className="inline-flex h-14 items-center justify-center px-10 rounded bg-transparent border-2 border-border-subtle text-text-primary font-bold font-sans tracking-wide transition-all hover:border-primary hover:text-primary hover:-translate-y-1"
            >
              Explore Events
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scrolling Marquee */}
      <div className="relative z-10 py-3 mt-auto border-y border-border-subtle bg-surface/80 backdrop-blur-md overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="flex items-center mx-4">
              <span className="font-heading text-2xl tracking-wider text-text-muted/60 uppercase">
                {item}
              </span>
              <span className="text-primary/40 mx-4 text-xs">◆</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
