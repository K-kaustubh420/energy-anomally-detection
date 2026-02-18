'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Leaf } from 'lucide-react';
import Link from 'next/link';

/* ----------------------------------
   Types (fix TS errors)
-----------------------------------*/
interface TextAnimationProps {
  text: string;
  onComplete: () => void;
}

/* ----------------------------------
   Typewriter
-----------------------------------*/
const Typewriter: React.FC<TextAnimationProps> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;

      if (i === text.length) {
        clearInterval(interval);
        setTimeout(onComplete, 1800);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <span>
      {displayedText.split('better tomorrow')[0]}
      {displayedText.includes('better tomorrow') && (
        /* 🌱 LIGHT GREEN HIGHLIGHT — CHANGE COLOR HERE */
        <span className="text-green-300">better tomorrow</span>
      )}
      <span className="animate-pulse">|</span>
    </span>
  );
};

/* ----------------------------------
   Rolling Text
-----------------------------------*/
const RollingText: React.FC<TextAnimationProps> = ({ text, onComplete }) => {
  useEffect(() => {
    const t = setTimeout(onComplete, 1800);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.span
      initial={{ y: 14, opacity: 0, filter: 'blur(6px)' }}
      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
      exit={{ y: -14, opacity: 0, filter: 'blur(6px)' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="inline-block"
    >
      {text.split('better tomorrow')[0]}
      {text.includes('better tomorrow') && (
        /* 🌱 LIGHT GREEN HIGHLIGHT — CHANGE COLOR HERE */
        <span className="text-green-300">better tomorrow</span>
      )}
    </motion.span>
  );
};

/* ----------------------------------
   Navbar
-----------------------------------*/
const Navbar = () => {
  const [index, setIndex] = useState(0);

  const slogans = [
    { text: 'save energy for a better tomorrow', type: 'typewriter' },
    { text: 'conserve energy for a better tomorrow', type: 'roll' },
    { text: 'optimise usage for a better tomorrow', type: 'roll' },
    {
      text: 'detect energy wastage patterns and anomalies for a better tomorrow',
      type: 'typewriter',
    },
  ];

  const nextSlogan = () => {
    setIndex((prev) => (prev + 1) % slogans.length);
  };

  const isLeaf = index % 2 === 1;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white dark:bg-[#050505] border-b border-neutral-100 dark:border-neutral-900">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-10">

          {/* GEN-Z ICON MORPH */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isLeaf ? (
                <motion.div
                  key="leaf"
                  initial={{ scale: 0.6, opacity: 0, rotate: -20, filter: 'blur(6px)' }}
                  animate={{ scale: 1, opacity: 1, rotate: 0, filter: 'blur(0px)' }}
                  exit={{ scale: 0.6, opacity: 0, rotate: 20, filter: 'blur(6px)' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <Leaf className="w-7 h-7 text-green-300" />
                </motion.div>
              ) : (
                <motion.div
                  key="zap"
                  initial={{ scale: 0.6, opacity: 0, rotate: 20, filter: 'blur(6px)' }}
                  animate={{ scale: 1, opacity: 1, rotate: 0, filter: 'blur(0px)' }}
                  exit={{ scale: 0.6, opacity: 0, rotate: -20, filter: 'blur(6px)' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <Zap className="w-7 h-7 text-green-300" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BRAND + SLOGAN */}
          <div className="flex items-center gap-6">
            <span className="text-2xl font-black tracking-tightest">
              ENERLYTICS
            </span>

            <div className="hidden xl:flex items-center gap-2 text-[13px] font-medium border-l border-neutral-200 dark:border-neutral-800 pl-6 h-6">
              <span className="text-neutral-400 uppercase tracking-tighter">
                lets
              </span>

              <div className="min-w-[340px] font-semibold">
                <AnimatePresence mode="wait">
                  {slogans[index].type === 'typewriter' ? (
                    <Typewriter
                      key={index}
                      text={slogans[index].text}
                      onComplete={nextSlogan}
                    />
                  ) : (
                    <RollingText
                      key={index}
                      text={slogans[index].text}
                      onComplete={nextSlogan}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-8">
          <button className="text-[11px] uppercase tracking-[0.2em] font-bold text-neutral-500 hover:text-black dark:hover:text-white">
            Dashboard
          </button>

          <button className="relative group px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-md overflow-hidden">
            <div className="absolute inset-0 bg-green-300 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 text-[11px] uppercase tracking-[0.2em] font-black group-hover:text-black">
             <Link href="/stream">Get Started</Link>
            </span>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
