import { FaDiscord, FaYoutube, FaBehance, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full py-16 flex flex-col items-center justify-center">
      <div className="flex items-center gap-6 opacity-80">
        <a href="https://discord.gg/6VFAEr2qmD" className="text-white text-2xl hover:opacity-100 transition">
          <FaDiscord />
        </a>
        <a href="https://www.youtube.com/@1FreshAgency" className="text-white text-2xl hover:opacity-100 transition">
          <FaYoutube />
        </a>
        <a href="https://www.behance.net/afto" className="text-white text-2xl hover:opacity-100 transition">
          <FaBehance />
        </a>
        <a href="https://www.tiktok.com/@freshagencypl" className="text-white text-2xl hover:opacity-100 transition">
          <FaTiktok />
        </a>
      </div>

      <p className="text-white text-[18px] font-medium opacity-50 mt-6">
        Copyright 2020–2025 FreshAgency.pl
      </p>
    </footer>
  );
};

export default Footer;
