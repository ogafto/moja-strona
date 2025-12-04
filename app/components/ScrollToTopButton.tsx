"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaArrowUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTopButton() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  // Pokaż przycisk tylko na podstronach (nie na stronie głównej)
  const isSubpage = pathname !== "/";

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isSubpage && isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#009DFF] text-white rounded-full flex items-center justify-center shadow-lg md:hidden"
          aria-label="Przewiń do góry"
        >
          <FaArrowUp />
        </motion.button>
      )}
    </AnimatePresence>
  );
}