import Link from "next/link";
import Label from "../atoms/Label";

type TagListProps = {
  tags: string[];
  className?: string;
};

const TagList: React.FC<TagListProps> = ({ tags, className = "" }) => {
  return (
    <div className={className + " flex space-x-2"}>
      {tags.map((tag) => (
        <Link key={tag} href={"/tag/" + tag}>
          <Label>{tag}</Label>
        </Link>
      ))}
    </div>
  );
};

export default TagList;
