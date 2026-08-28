import { useCallback, useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

export default function ParticleBackground() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const particlesLoaded = useCallback(async () => {}, [])

  if (!init) return null

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
      options={{
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'repulse' },
            onClick: { enable: true, mode: 'push' },
          },
          modes: {
            push: { quantity: 3 },
            repulse: { distance: 80, duration: 0.4 },
          },
        },
        particles: {
          color: { value: ['#6C3AFF', '#00D4FF', '#8B5CF6'] },
          links: {
            color: '#6C3AFF',
            distance: 140,
            enable: true,
            opacity: 0.25,
            width: 1,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: { default: 'bounce' },
            random: true,
            speed: 0.8,
            straight: false,
          },
          number: {
            density: { enable: true, area: 900 },
            value: 70,
          },
          opacity: { value: { min: 0.2, max: 0.6 } },
          shape: { type: 'circle' },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
    />
  )
}
