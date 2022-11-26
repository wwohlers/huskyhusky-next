import Link from "next/link";
import React from "react";
import { IHeadline } from "../../services/articles/article.interface";
import Label from "../atoms/Label";

type HeadlineGroupProps = {
  width?: "half" | "full";
  headlines: IHeadline[];
};

const HeadlineGroup: React.FC<HeadlineGroupProps> = ({ width, headlines }) => {
  const widthClasses = width === "half" ? "md:w-1/2" : "";
  return (
    <div
      className={
        "w-full p-6 h-[17rem] flex flex-col justify-evenly " + widthClasses
      }
    >
      {headlines.map((headline) => (
        <Link
          href={"/" + headline.name}
          className="flex-1 flex flex-col justify-center font-medium border-b border-gray-300 last:border-b-0"
        >
          <p className="line-clamp-2">
            {headline.title}
            {headline.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs uppercase text-red-800 font-bold"
              >
                &nbsp;&bull;&nbsp;{tag}
              </span>
            ))}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default HeadlineGroup;
