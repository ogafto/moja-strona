"use client";

import { motion, cubicBezier } from "framer-motion";
import Link from "next/link";

const Card = () => {
  const items = [
    // Zaktualizuj 'href' dla każdej karty, aby prowadził do odpowiedniej podstrony

    { src: "/card/embedy-discord.svg", alt: "Embedy-discord", href: "/embedy-discord" },
    { src: "/card/bannery-minecraft.svg", alt: "Bannery-minecraft", href: "/bannery-minecraft" },

  ];

  const easePremium = cubicBezier(0.16, 1, 0.3, 1);

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: easePremium,
        delay: i * 0.08,
      },
    }),
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      id="portfolio"
      viewport={{ once: false, amount: 0.2 }}
      className="
        w-full 
        max-w-[1320px] 
        mx-auto 
        px-4
        sm:px-0
        grid 
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-5 
        py-10
      "
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={fadeUp}
        >
          <Link
            href={item.href || "/portfolio"}
          >
            <motion.div
            custom={i}
            variants={fadeUp}
            whileHover={{
              scale: 1.03,
              y: -4,
              transition: { duration: 0.25, ease: easePremium },
            }}
            className="
              block
              group
              relative 
              h-[220px] sm:h-[260px] lg:h-[300px] 
              rounded-2xl 
              overflow-hidden 
              cursor-pointer 
              shadow-lg
            "
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Card;
