"use client";

import { motion, cubicBezier } from "framer-motion";
import { ReactTyped } from "react-typed";
import { FaChevronDown, FaDiscord } from "react-icons/fa";
import { BsArrowUpRight } from "react-icons/bs";
import { useState, useEffect } from "react";

export default function Hero() {
  const easePremium = cubicBezier(0.16, 1, 0.3, 1);
  const [showBlur, setShowBlur] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowBlur(true);
      } else {
        setShowBlur(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: easePremium,
      },
    },
  };

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-top bg-no-repeat md:mb-[-100px]"
      style={{ backgroundImage: "url('/pattern.png')" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 1.4, ease: easePremium }}
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: "url('/pattern-overlay.png')",
          backgroundPosition: "center 170px",
        }}
      />

      <div className="relative flex w-full flex-col items-center px-4 pt-[140px] text-center md:pt-[230px]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.18 },
            },
          }}
        >
          <motion.h1
            className="text-[40px] md:text-[64px] font-semibold leading-tight tracking-tight text-white"
            variants={fadeUp}
          >
            <motion.span className="block" variants={fadeUp}>Zmieniamy nudne</motion.span>
            <motion.span className="block text-[#009DFF]" variants={fadeUp}>
              <ReactTyped
                strings={[
                  "grafiki",
                  "strony internetowe",
                  "projekty UI/UX",
                  "aplikacje mobilne",
                ]}
                typeSpeed={100}
                backSpeed={100}
                backDelay={1200}
                loop
              />
            </motion.span>

            <motion.div variants={fadeUp}>
              <span className="block md:inline">w nowoczesne i </span>
              <span className="block md:inline">
                stylowe rozwiązania.
              </span>
            </motion.div>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl mx-auto text-base text-[#9CA0AC] font-medium"
            variants={fadeUp}
          >
            Tworzymy nowoczesne i stylowe rozwiązania, które wyróżniają Twoją markę
            oraz wzmacniają odbiór Twojego przekazu.
          </motion.p>

          <motion.div
            className="mt-12 flex flex-col items-center justify-center gap-5 md:flex-row"
            variants={{
              visible: {
                transition: { staggerChildren: 0.15, delayChildren: 0.2 },
              },
            }}
          >
            <motion.a
              variants={fadeUp}
              href="#portfolio"
              className="group relative block w-full overflow-hidden rounded-lg bg-[#009DFF] px-8 py-4 text-base font-medium text-white shadow-md transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl md:w-auto"
            >
              <span className="flex items-center justify-center gap-2 transition-transform duration-300 group-hover:-translate-y-[150%]">
                Nasze Portfolio
                <BsArrowUpRight className="transition-transform group-hover:rotate-45" strokeWidth={1} />
              </span>
              <span className="absolute inset-0 flex items-center justify-center gap-2 translate-y-[150%] transition-transform duration-300 group-hover:translate-y-0">
                Nasze Portfolio
                <BsArrowUpRight className="transition-transform group-hover:rotate-45" strokeWidth={1} />
              </span>
            </motion.a>

            <motion.a
              variants={fadeUp}
              href="https://discord.gg/6VFAEr2qmD"
              className="group relative block w-full overflow-hidden rounded-lg border border-white bg-transparent px-8 py-4 text-base font-medium text-white transition-all duration-300 ease-out hover:bg-white hover:text-black md:w-auto"
            >
              <span className="flex items-center justify-center gap-2 transition-transform duration-300 group-hover:-translate-y-[150%]">
                <FaDiscord />
                Discord
              </span>
              <span className="absolute inset-0 flex items-center justify-center gap-2 translate-y-[150%] transition-transform duration-300 group-hover:translate-y-0">
                <FaDiscord />
                Discord
              </span>
            </motion.a>
          </motion.div>

          <a href="#portfolio">
            <motion.div
              variants={fadeUp}
              whileHover={{ y: 5, color: "#FFFFFF" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-[64px] mb-[32px] flex cursor-pointer items-center justify-center gap-[12px] text-[#9CA0AC]"
            >
              <FaChevronDown />
              <span className="font-medium">Zjedź w dół</span>
            </motion.div>
          </a>
        </motion.div>
      </div>

      {showBlur && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none fixed bottom-0 left-0 h-48 w-full bg-gradient-to-t from-black/50 to-transparent backdrop-blur-lg"
          style={{
            maskImage: "linear-gradient(to top, black 50%, transparent 100%)",
          }}
        />
      )}
    </section>
  );
}
