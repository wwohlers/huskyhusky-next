import React, { useMemo } from "react";
import { IHeadline } from "../../services/articles/article.interface";
import Image from "next/image";
import Label from "../atoms/Label";
import Link from "next/link";

type HeadlineProps = {
  height?: "normal" | "double";
  headline: IHeadline;
  containerClasses?: string;
};

const Headline: React.FC<HeadlineProps> = ({
  height = "normal",
  headline,
  containerClasses = "",
}) => {
  const textContainerClasses =
    height === "double" ? "xl:h-[11rem]" : "xl:h-[90px]";
  const titleClasses =
    height === "double" ? "text-3xl font-semibold" : "font-medium";
  const imageClasses =
    height === "double" ? "h-[16rem] xl:h-[26rem]" : "h-[16rem] xl:h-44";

  if (!headline) return null;

  return (
    <Link
      href={"/" + headline.name}
      className={
        "w-full md:px-6 py-6 items-stretch hover:translate-x-[1px] hover:translate-y-[-1px] duration-150 " +
        containerClasses
      }
    >
      <div className={"relative shadow-md " + imageClasses}>
        <Image
          className="object-cover rounded-sm"
          src={headline.image}
          alt={"Thumbnail for " + headline.title}
          fill
        />
      </div>
      <div className={textContainerClasses}>
        <div className="mt-2.5 mb-0.5 flex flex-row space-x-4">
          {headline.tags.map((tag) => (
            <Label className={height === "double" ? "" : "text-xs"} key={tag}>
              {tag}
            </Label>
          ))}
        </div>
        <p className={"text-lg line-clamp-3 " + titleClasses}>
          {headline.title}
        </p>
        {height === "double" && (
          <p className="text-gray-500 font-medium line-clamp-3">
            {headline.brief}
          </p>
        )}
      </div>
    </Link>
  );
};

export default Headline;
