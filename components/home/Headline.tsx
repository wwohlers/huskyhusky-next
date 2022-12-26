import React, { useMemo } from "react";
import { IHeadline } from "../../services/articles/article.interface";
import Image from "next/image";
import Label from "../atoms/Label";
import Link from "next/link";
import TagList from "../article/TagList";

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
    height === "double" ? "text-3xl font-semibold" : "font-medium leading-6";
  const imageClasses =
    height === "double" ? "h-[16rem] xl:h-[26rem]" : "h-[16rem] xl:h-44";

  if (!headline) return null;

  return (
    <div
      className={
        "w-full md:px-6 py-6 items-stretch hover:scale-[1.01] duration-150 " +
        containerClasses
      }
    >
      <Link
        href={"/" + headline.name}
        className={"block relative shadow-md " + imageClasses}
      >
        <Image
          className="object-cover rounded-sm"
          src={headline.image}
          alt={"Thumbnail for " + headline.title}
          fill
        />
      </Link>
      <div className={textContainerClasses}>
        <TagList tags={headline.tags} className="mt-2.5 mb-0.5" />
        <Link
          href={"/" + headline.name}
          className={"text-lg line-clamp-3 " + titleClasses}
        >
          {headline.title}
        </Link>
        {height === "double" && (
          <Link
            href={"/" + headline.name}
            className="text-secondary font-medium line-clamp-3"
          >
            {headline.brief}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Headline;
