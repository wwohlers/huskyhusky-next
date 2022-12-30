import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { MdModeEdit } from "react-icons/md";
import { useUser } from "../hooks/useUser";
import { IHeadline } from "../services/articles/article.interface";
import { canEditArticle } from "../services/users/server";
import { IUser } from "../services/users/user.interface";
import TagList from "./article/TagList";

type HeadlineListProps = {
  headlines: IHeadline[];
  emptyText?: string;
};

const HeadlineList: React.FC<HeadlineListProps> = ({
  headlines,
  emptyText = "There's nothing here yet. Check back later!",
}) => {
  const [numToRender, setNumToRender] = React.useState<number>(10);
  const user = useUser();

  const onScroll = () => {
    if (
      window.scrollY + window.innerHeight >=
      document.body.scrollHeight - 200
    ) {
      setNumToRender(numToRender + 10);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  });

  return (
    <div className="flex flex-col space-y-8">
      {headlines.length === 0 && (
        <div className="text-center text-secondary text-sm font-medium italic">
          {emptyText}
        </div>
      )}
      {headlines.slice(0, numToRender).map((headline) => (
        <div
          className="w-full flex flex-col md:flex-row hover:translate-x-[1px] duration-150 md:space-x-4"
          key={headline._id}
        >
          <Link
            href={"/" + headline.name}
            className="flex-shrink-0 w-full md:w-1/4 h-32 xl:w-1/5 xl:h-32 relative rounded-sm shadow-sm overflow-hidden"
          >
            <Image
              src={headline.image}
              alt={`Thumbnail for '${headline.title}'`}
              fill
              className="object-cover"
            />
          </Link>
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
            <Link
              href={"/" + headline.name}
              className="text-xl my-1 font-medium md:line-clamp-1"
            >
              {headline.title}
            </Link>
            <Link
              href={"/" + headline.name}
              className="text-secondary line-clamp-4 md:line-clamp-3"
            >
              {headline.brief}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeadlineList;
