"use client";

import React from 'react';
import { motion, cubicBezier } from "framer-motion";
import Navbar from '../../Navbar'; // Upewnij się, że ta ścieżka jest poprawna
import Footer from '../../components/footer';

const PortfolioPage = () => {
  const easePremium = cubicBezier(0.16, 1, 0.3, 1);

  return (
    <main className="relative flex flex-col min-h-screen bg-top bg-no-repeat" style={{ backgroundImage: "url('/pattern.png')" }}>
      {/* Nakładka z animacją, tak jak na stronie głównej */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 1.4, ease: easePremium }}
        className="absolute inset-0 -z-10 bg-no-repeat" // -z-10 umieszcza tę warstwę pod treścią
        style={{
          backgroundImage: "url('/pattern-overlay.png')",
          backgroundPosition: "center 170px",
        }}
      />
      <Navbar />
      {/* Sekcja na Twoje zdjęcia w portfolio */}
      <div className="container mx-auto px-4 pt-[144px] pb-16 flex-grow">
        <div className="flex flex-col items-center gap-4 md:gap-8">
          {/* 
            NOWE ZDJĘCIA WSTAWIAJ TUTAJ (na górze listy).
            Dzięki temu najnowsze projekty będą zawsze na samej górze,
            a strona będzie się naturalnie rozszerzać w dół.
          */}
          <img
            src="/embedy/1.svg" // Zmień na ścieżkę do nowego zdjęcia
            alt="Nowy projekt"
            className="w-full max-w-[1320px] aspect-[1320/722] object-cover shadow-lg rounded-2xl"
          />

          {/* Istniejące zdjęcie */}
          <img
            src="/embedy/2.svg" // Zmień na ścieżkę do Twojego zdjęcia
            alt="Opis projektu"
            className="w-full max-w-[1320px] aspect-[1320/722] object-cover shadow-lg rounded-2xl"
          />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default PortfolioPage;