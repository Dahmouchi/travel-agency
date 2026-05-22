import Link from "next/link";
import React from "react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-36 sm:w-32" }) => {
  return (
    <Link
      href="/"
      className={`inline-block text-primary-600 focus:ring-0 focus:outline-hidden ${className}`}
    >
      <img src="/horizontal1.png" className="w-44 h-auto" alt="" />
    </Link>
  );
};

export default Logo;
