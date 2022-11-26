import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <div className="w-full py-12 flex flex-row justify-center bg-red-800">
      <footer className="w-11/12 md:w-5/6 lg:w-4/5 text-white flex flex-col justify-center items-center">
        <nav className="flex flex-row space-x-12 font-semibold">
          <Link href="/archive">Archive</Link>
          <Link href="/writers">Writers</Link>
          <Link href="/about">About</Link>
        </nav>
        <p className="mt-6 text-sm text-red-200">
          &copy; {new Date().getFullYear()} The Husky Husky and{" "}
          <Link href="https://billwohlers.com">Bill Wohlers</Link>
        </p>
      </footer>
    </div>
  );
};

export default Footer;
