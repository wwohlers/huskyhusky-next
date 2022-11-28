import Link from "next/link";
import React from "react";
import { IHeadline } from "../../services/articles/article.interface";
import Label from "../atoms/Label";

type HeadlineGroupProps = {
  containerClasses?: string;
  headlines: IHeadline[];
};

const HeadlineGroup: React.FC<HeadlineGroupProps> = ({
  containerClasses = "",
  headlines,
}) => {
  return (
    <div
      className={
        "w-full xl:px-6 py-6 xl:h-[17rem] flex flex-col justify-evenly " +
        containerClasses
      }
    >
      {headlines.map((headline) => (
        <Link
          key={headline._id}
          href={"/" + headline.name}
          className="flex-1 flex flex-col justify-center font-medium border-b border-gray-200 last:border-b-0 hover:translate-x-[1px] hover:translate-y-[-1px] duration-150"
        >
          <p className="line-clamp-2 my-2">
            {headline.title}
            &nbsp;&nbsp;
            {headline.tags.map((tag, i) => (
              <span
                key={tag}
                className="text-xs uppercase text-red-800 font-bold"
              >
                {!!i && <>&nbsp;&bull;&nbsp;</>}
                {tag}
              </span>
            ))}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default HeadlineGroup;
