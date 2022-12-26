import Link from "next/link";
import { useMemo } from "react";
import { AiFillTwitterCircle, AiOutlineLink } from "react-icons/ai";
import { BsFacebook, BsReddit } from "react-icons/bs";
import { toast } from "react-toastify";

type ShareProps = {
  title: string;
  name: string;
};

const Share: React.FC<ShareProps> = ({ name, title }) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${name}`;
  const titleWithSite = `${title} - The Husky Husky`;
  const iconClasses =
    "block transition duration-150 hover:scale-105 cursor-pointer";

  const twitterUrl = useMemo(() => {
    return `https://twitter.com/intent/tweet?url=${url}&text=${titleWithSite}`;
  }, [url, titleWithSite]);

  const facebookUrl = useMemo(() => {
    return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  }, [url]);

  const redditUrl = useMemo(() => {
    return `https://www.reddit.com/submit?url=${url}&title=${titleWithSite}`;
  }, [url, titleWithSite]);

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="my-2 flex space-x-1 items-center">
      <Link href={twitterUrl} target="_blank">
        <AiFillTwitterCircle
          className={iconClasses}
          color={"#1DA1F2"}
          size={33}
        />
      </Link>
      <Link href={facebookUrl} target="_blank">
        <BsFacebook className={iconClasses} size={28} color={"#4267B2"} />
      </Link>
      <Link href={redditUrl} target="_blank">
        <BsReddit className={iconClasses} size={28} color={"#FF4500"} />
      </Link>
      <AiOutlineLink onClick={onCopy} className={iconClasses} size={30} />
    </div>
  );
};

export default Share;
