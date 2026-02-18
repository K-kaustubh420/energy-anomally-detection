'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Zap, Leaf } from 'lucide-react'

/* ---------------- TYPEWRITER ---------------- */

interface TypewriterProps {
  text: string
}

const Typewriter: React.FC<TypewriterProps> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let i = 0

    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1))
      i++

      if (i === text.length) clearInterval(interval)
    }, 30)

    return () => clearInterval(interval)
  }, [text])

  return (
    <>
      {displayedText.split('better tomorrow')[0]}
      {displayedText.includes('better tomorrow') && (
        <span className="text-green-300">better tomorrow</span>
      )}
      <span className="animate-pulse">|</span>
    </>
  )
}

/* ---------------- BACKGROUND KINETIC TEXT ---------------- */

const bgWords = [
  'ANALYTICS',
  'ANOMALY DETECTION',
  'WASTAGE PATTERN',
  'PREDICTION',
  'OPTIMISATION',
]

const KineticBgText = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % bgWords.length)
    }, 2600)

    return () => clearInterval(t)
  }, [])

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
      <AnimatePresence mode="wait">
        <motion.h1
          key={bgWords[index]}
          initial={{ y: 120, opacity: 0, filter: 'blur(12px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -120, opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="text-[18vw] md:text-[14vw] font-black tracking-tighter
          text-neutral-200/40 dark:text-neutral-800/30 whitespace-nowrap"
        >
          {bgWords[index]}
        </motion.h1>
      </AnimatePresence>
    </div>
  )
}

/* ---------------- HERO ---------------- */

const Hero = () => {
  const slogan =
    'detect energy wastage patterns and anomalies for a better tomorrow'

  /* ⚡🌿 ICON LOOP — independent & WORKING */
  const [isLeaf, setIsLeaf] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLeaf((prev) => !prev)
    }, 2200)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative w-full h-screen bg-white dark:bg-[#050505] overflow-hidden flex items-center">

      {/* 🌌 BACKGROUND WORD SYSTEM */}
      <KineticBgText />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 w-full max-w-7xl mx-auto px-6 items-center">

        {/* ⚡ LEFT – ICON */}
        <div className="relative flex justify-center lg:justify-start">

          {/* glow */}
          <div className="absolute w-[420px] h-[420px] bg-green-300/20 blur-[120px] rounded-full" />

          <AnimatePresence mode="wait">
            {isLeaf ? (
              <motion.div
                key="leaf"
                initial={{ scale: 0.6, opacity: 0, rotate: 0, filter: 'blur(6px)' }}
                animate={{ scale: 1, opacity: 1, rotate: 0, filter: 'blur(0px)' }}
                exit={{ scale: 0.6, opacity: 0, rotate: 0, filter: 'blur(6px)' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <Leaf className="w-[220px] h-[220px] text-green-300" />
              </motion.div>
            ) : (
              <motion.div
                key="zap"
                initial={{ scale: 0.6, opacity: 0, rotate: 0, filter: 'blur(6px)' }}
                animate={{ scale: 1, opacity: 1, rotate: 0, filter: 'blur(0px)' }}
                exit={{ scale: 0.6, opacity: 0, rotate: 0, filter: 'blur(6px)' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <Zap className="w-[220px] h-[220px] text-green-300" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 🧠 RIGHT – TEXT */}
        <div className="mt-16 lg:mt-0 text-center lg:text-left">

          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-8">
            ENERLYTICS
          </h1>

          <div className="text-xl md:text-2xl font-semibold text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto lg:mx-0">
            <span className="text-neutral-400 uppercase mr-3">lets</span>
            <Typewriter text={slogan} />
          </div>

          <button className="mt-14 group relative px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-md overflow-hidden">
            <div className="absolute inset-0 bg-green-300 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 text-sm font-black tracking-[0.25em] uppercase group-hover:text-black">
             <Link href='/stream'>Get Started</Link> 
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
