"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function TabFocusManager() {
  const pathname = usePathname();
  const originalTitleRef = useRef<string>('');

  useEffect(() => {
    // Ustawia tytuł dla każdej strony przy nawigacji
    if (pathname === "/") {
      document.title = "Freshly.pl - Strona główna";
    } else if (pathname.includes("bannery-minecraft")) {
      document.title = "Freshly.pl - Bannery Minecraft";
    } else if (pathname.includes("embedy-discord")) {
      document.title = "Freshly.pl - Embedy Discord";
    }
    originalTitleRef.current = document.title;

    const handleBlur = () => {
      document.title = "Hej, wracaj do nas! 👋";
    };
    const handleFocus = () => {
      document.title = originalTitleRef.current;
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [pathname]);

  return null;
}