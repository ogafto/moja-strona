"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaDiscord, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isPortfolioPage = pathname !== "/";

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.7,
        ease: [0.16, 0.84, 0.44, 1],
      }}
      className="fixed top-4 left-0 z-10 w-full px-4 font-dm"
    >
      <nav className="relative mx-auto flex max-w-4xl items-center justify-between rounded-2xl bg-[#0D0D0D] p-4 shadow-lg md:max-w-6xl">
        <Link href="/" className="flex flex-shrink-0 items-center gap-3">
          <Image
            src="/Logo.png"
            alt="FreshWeb Logo"
            width={155}
            height={28}
          />
        </Link>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-base font-medium md:flex">
          <Link
            href="/"
            className={`${
              pathname === "/" ? "text-white" : "text-[#5D6069]"
            } transition-colors hover:text-white`}
          >
            Strona główna
          </Link>

          <Link
            // Warunkowo zmieniaj href, aby poprawnie nawigować
            // z podstron i przewijać na stronie głównej.
            href={pathname === "/" ? "#portfolio" : "/#portfolio"}
            scroll={pathname === "/"} // Włącz natywne przewijanie tylko na stronie głównej
            className={`${
              isPortfolioPage ? "text-white" : "text-[#5D6069]"
            } transition-colors hover:text-white`}
          >
            Portfolio
          </Link>
        </div>

        {/* Kontener na elementy po prawej stronie */}
        <div className="flex items-center gap-4">
          <a
            href="https://discord.gg/E434234"
            className="group hidden flex-shrink-0 rounded-lg bg-[#009DFF] text-base font-medium text-white shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl md:block"
          >
            <span className="relative block h-full w-full overflow-hidden px-8 py-2">
              <span className="flex items-center justify-center gap-2 text-center transition-transform duration-300 group-hover:-translate-y-[120%]">
                <FaDiscord />
                Discord
              </span>

              <span className="absolute inset-0 flex items-center justify-center gap-2 translate-y-[120%] transition-transform duration-300 group-hover:translate-y-0">
                <FaDiscord />
                Discord
              </span>
            </span>
          </a>

          {/* Przycisk Hamburger Menu */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white text-2xl md:hidden">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Menu Mobilne */}
      {isMenuOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 h-full w-full bg-[#0D0D0D] p-8 md:hidden"
        >
          <div className="flex justify-end mb-8">
            <button onClick={() => setIsMenuOpen(false)} className="text-white text-3xl">
              <FaTimes />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-full gap-8 text-2xl">
            <Link
              href="/"
              className={`${
                pathname === "/" ? "text-white" : "text-[#5D6069]"
              } transition-colors hover:text-white`}
              onClick={() => setIsMenuOpen(false)}
            >
              Strona główna
            </Link>
            <Link
              href="/#portfolio"
              className={`${
                isPortfolioPage ? "text-white" : "text-[#5D6069]"
              } transition-colors hover:text-white`}
              onClick={() => setIsMenuOpen(false)}
            >
              Portfolio
            </Link>
            <Link
              href="https://discord.gg/E434234"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#009DFF] px-8 py-3 text-xl font-medium text-white shadow-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaDiscord /> Discord
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
