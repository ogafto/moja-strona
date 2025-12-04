import { FaDiscord, FaYoutube, FaBehance, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full py-16 flex flex-col items-center justify-center">
      <div className="flex items-center gap-6 opacity-80">
        <a href="#" className="text-white text-2xl hover:opacity-100 transition">
          <FaDiscord />
        </a>
        <a href="#" className="text-white text-2xl hover:opacity-100 transition">
          <FaYoutube />
        </a>
        <a href="#" className="text-white text-2xl hover:opacity-100 transition">
          <FaBehance />
        </a>
        <a href="#" className="text-white text-2xl hover:opacity-100 transition">
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
