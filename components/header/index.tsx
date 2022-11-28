import React, { useState } from "react";
import Link from "next/link";
import Input from "../atoms/Input";
import { AiOutlineSearch } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaPaw } from "react-icons/fa";
import ContentContainer from "../ContentContainer";

const mainTags = ["Aoun", "Boston", "Politics", "Student Life", "Opinion"];

const Header: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const extraContainerClasses = mobileNavOpen ? "h-screen lg:h-auto" : "";
  const extraNavClasses = mobileNavOpen ? "block mt-2" : "hidden lg:flex";

  return (
    <ContentContainer
      className={"lg:flex-row lg:justify-between " + extraContainerClasses}
    >
      <div className="flex flex-row w-full lg:w-auto justify-between items-center py-2">
        <Link href="/">
          <img
            className="w-16 lg:w-24"
            src="/logo.png"
            alt="Husky Husky logo"
          />
        </Link>
        <GiHamburgerMenu
          className="lg:hidden"
          size={24}
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        />
      </div>
      <nav
        className={
          "flex flex-col lg:flex-row lg:items-center lg:space-x-8 space-y-4 lg:space-y-0 " +
          extraNavClasses
        }
      >
        {mainTags.map((tag) => (
          <span key={tag} className="text-lg font-medium">
            <FaPaw className="inline" size={12} />
            &nbsp; {}
            <Link
              className=" border-gray-100 hover:border-red-800 border-b-2 duration-150"
              href={"/tags/" + tag}
            >
              {tag}
            </Link>
          </span>
        ))}
        <Input icon={<AiOutlineSearch size={20} color={"#AAA"} />} />
      </nav>
    </ContentContainer>
  );
};

export default Header;
