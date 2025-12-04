"use client";
import Navbar from "../Navbar";
import Card from "../components/card";
import Footer from "../components/footer";
import Hero from "../components/hero";
import React from 'react';

const Home = () => {
  return (
    <main>
      <Navbar />
      <Hero />
      <Card />
      <Footer />
    </main>
  );
};

export default Home;
