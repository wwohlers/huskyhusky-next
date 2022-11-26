import React, { useMemo } from "react";
import { IHeadline } from "../../services/articles/article.interface";
import Image from "next/image";
import styles from "./Headline.module.scss";
import Label from "../atoms/Label";
import Link from "next/link";

type HeadlineProps = {
  width?: "half" | "full";
  height?: "normal" | "double";
  headline: IHeadline;
};

const Headline: React.FC<HeadlineProps> = ({
  width = "full",
  height = "normal",
  headline,
}) => {
  const containerClasses = width === "half" ? "md:w-1/2" : "";
  const textContainerClasses = height === "double" ? "h-[11rem]" : "h-24";
  const titleClasses =
    height === "double" ? "text-3xl font-semibold" : "font-medium";
  const imageClasses = height === "double" ? "h-[26rem]" : "h-44";

  if (!headline) return null;

  return (
    <Link
      href={"/" + headline.name}
      className={"w-full p-6 items-stretch " + containerClasses}
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
        {height === "double" && (
          <div className="pt-2 flex flex-row space-x-4">
            {headline.tags.map((tag) => (
              <Label>{tag}</Label>
            ))}
          </div>
        )}
        <p className={"pt-2 text-lg line-clamp-3 " + titleClasses}>
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
