import React from "react";
import Link from "next/link";
import ContentContainer from "./ContentContainer";

const Footer: React.FC = () => {
  return (
    <div className="w-full py-12 flex flex-row justify-center bg-red-800">
      <ContentContainer className="text-white justify-center items-center">
        <nav className="flex flex-row space-x-12 font-medium">
          <Link href="/archive">Archive</Link>
          <Link href="/writers">Writers</Link>
          <Link href="/about">About</Link>
        </nav>
        <footer className="mt-6 text-sm text-red-200">
          &copy; {new Date().getFullYear()} The Husky Husky and{" "}
          <Link href="https://billwohlers.com">Bill Wohlers</Link>
        </footer>
      </ContentContainer>
    </div>
  );
};

export default Footer;
