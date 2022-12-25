import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useRefreshUser } from "../../hooks/useUser";
import { makeSignOutRequest } from "../../pages/api/users/signOut";
import { IUser } from "../../services/users/user.interface";
import toastError from "../../util/toastError";
import Label from "../atoms/Label";

type UserMenuProps = {
  user: IUser;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const refreshUser = useRefreshUser();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const menuContainer = useRef<HTMLDivElement>(null);

  useClickOutside(menuContainer, () => setShowMenu(false));

  const onSignOut = async () => {
    setShowMenu(false);
    try {
      await makeSignOutRequest();
      refreshUser();
      router.push("/login");
    } catch (e) {
      toastError(e);
    }
  };

  const menuContent = (
    <>
      <Link href="/account" onClick={() => setShowMenu(false)}>
        My Account
      </Link>
      {user.admin && (
        <Link href="/users" onClick={() => setShowMenu(false)}>
          Manage Users
        </Link>
      )}
      <div className="cursor-pointer" onClick={onSignOut}>
        Sign Out
      </div>
    </>
  );

  return (
    <div className="relative pb-4" ref={menuContainer}>
      <Label className="text-xs">Signed in as</Label>
      <div className="flex flex-row items-center space-x-1">
        <Link
          href={"/writers/" + user.name}
          onClick={() => setShowMenu(false)}
          className="text-lg font-semibold"
        >
          {user.name}
        </Link>
        <FiChevronDown
          className="hidden lg:block cursor-pointer"
          size={22}
          onClick={() => setShowMenu(!showMenu)}
        />
      </div>
      {showMenu && (
        <div className="hidden lg:flex absolute top-12 right-0 py-3 px-4 w-36 text-sm uppercase font-medium bg-[#EAEAEA] shadow-md rounded-sm flex-col space-y-2 z-10">
          {menuContent}
        </div>
      )}
      <div className="lg:hidden flex flex-col space-y-1">{menuContent}</div>
    </div>
  );
};

export default UserMenu;
