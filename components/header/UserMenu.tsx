import React, { useRef, useState } from "react";
import { IUser } from "../../services/users/user.interface";
import { FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import { useClickOutside } from "../../hooks/useClickOutside";
import Label from "../atoms/Label";
import { apiClient } from "../../util/client";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";

type UserMenuProps = {
  user: IUser;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const menuContainer = useRef<HTMLDivElement>(null);

  useClickOutside(menuContainer, () => setShowMenu(false));

  const onSignOut = async () => {
    const res = await apiClient.post("/auth/signOut");
    if (res.success) {
      mutate("/auth");
      router.push("/login");
    } else {
      toast(res.error);
    }
  };

  const menuContent = (
    <>
      <Link href="/account">Account</Link>
      <div className="cursor-pointer" onClick={onSignOut}>
        Sign Out
      </div>
    </>
  );

  return (
    <div className="relative pb-4" ref={menuContainer}>
      <Label className="text-xs">Signed in as</Label>
      <div className="flex flex-row items-center space-x-1">
        <Link href={"/writers/" + user.name} className="text-lg font-semibold">
          {user.name}
        </Link>
        <FiChevronDown
          className="hidden lg:block cursor-pointer"
          size={22}
          onClick={() => setShowMenu(!showMenu)}
        />
      </div>
      {showMenu && (
        <div className="hidden lg:flex absolute top-12 right-0 py-4 px-4 w-36 text-gray-500 bg-gray-200 shadow-md rounded-md flex-col space-y-1 z-10">
          {menuContent}
        </div>
      )}
      <div className="lg:hidden flex flex-col space-y-1">{menuContent}</div>
    </div>
  );
};

export default UserMenu;
