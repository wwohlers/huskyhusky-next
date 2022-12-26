import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { MdModeEdit } from "react-icons/md";
import { useUser } from "../hooks/useUser";
import { IHeadline } from "../services/articles/article.interface";
import { IUser } from "../services/users/user.interface";
import TagList from "./article/TagList";
import Label from "./atoms/Label";

type HeadlineListProps = {
  headlines: IHeadline[];
};

const HeadlineList: React.FC<HeadlineListProps> = ({ headlines }) => {
  const [numTagsToRender, setNumTagsToRender] = React.useState<number>(10);
  const user = useUser();

  const onScroll = () => {
    if (
      window.scrollY + window.innerHeight >=
      document.body.scrollHeight - 200
    ) {
      setNumTagsToRender(Math.min(numTagsToRender + 10, headlines.length));
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  });

  const canEditArticle = (
    user: IUser | undefined | null,
    article: { author: IUser }
  ) => {
    if (!user) return false;
    return user._id === article.author._id || user.admin;
  };

  return (
    <div className="flex flex-col space-y-8">
      {headlines.slice(0, numTagsToRender).map((headline) => (
        <Link
          href={"/" + headline.name}
          className="w-full flex flex-col md:flex-row hover:translate-x-[1px] duration-150 md:space-x-4"
          key={headline._id}
        >
          <div className="flex-shrink-0 w-full md:w-1/4 h-32 xl:w-1/5 xl:h-32 relative rounded-sm shadow-sm overflow-hidden">
            <Image
              src={headline.image}
              alt={`Thumbnail for '${headline.title}'`}
              fill
              className="object-cover"
            />
          </div>
          <div className="w-full">
            <div className="flex flex-row justify-between mt-2 md:mt-0">
              <TagList tags={headline.tags} />
              <div className="flex flex-row space-x-2 items-center text-secondary">
                {canEditArticle(user, headline) && (
                  <Link href={"/edit/" + headline._id}>
                    <MdModeEdit size={18} />
                  </Link>
                )}
              </div>
            </div>
            <p className="text-xl my-1 font-medium md:line-clamp-1">
              {headline.title}
            </p>
            <p className="text-secondary line-clamp-4 md:line-clamp-3">
              {headline.brief}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HeadlineList;
