import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaPaw } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import useSWR from "swr";
import { MeResponse } from "../../pages/api/auth";
import { axiosFetcher } from "../../util/client/axios";
import Input from "../atoms/Input";
import ContentContainer from "../ContentContainer";
import UserMenu from "./UserMenu";

const mainTags = ["Aoun", "Boston", "Politics", "Student Life", "Opinion"];

const Header: React.FC = () => {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data } = useSWR<MeResponse>("/auth", axiosFetcher);

  const extraContainerClasses = mobileNavOpen ? "h-screen lg:h-auto" : "";
  const extraNavClasses = mobileNavOpen ? "block mt-2" : "hidden lg:flex";

  const onSearch = () => {
    router.push(`/search?q=${searchQuery}`);
  };

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
              href={"/tag?t=" + tag}
            >
              {tag}
            </Link>
          </span>
        ))}
        {data?.authenticated ? (
          <UserMenu user={data.user} />
        ) : (
          <Input
            icon={<AiOutlineSearch size={20} color={"#AAA"} />}
            value={searchQuery}
            onChange={setSearchQuery}
            onEnter={onSearch}
          />
        )}
      </nav>
    </ContentContainer>
  );
};

export default Header;
