import React, { useMemo, useRef, useState } from "react";
import { AiOutlinePlus, AiOutlineTag } from "react-icons/ai";
import { GrClose } from "react-icons/gr";
import useSWR from "swr";
import { axiosFetcher } from "../api/request/axios";
import { useClickOutside } from "../hooks/useClickOutside";
import TextInput from "./atoms/TextInput";

type TagPickerProps = {
  tags: string[];
  setTags: (tags: string[]) => void;
  onBlur: () => void;
};

const TagPicker: React.FC<TagPickerProps> = ({ tags, setTags, onBlur }) => {
  const { data: allTags } = useSWR<string[]>("/tags", axiosFetcher);
  const [showAllTags, setShowAllTags] = useState(false);
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setShowAllTags(false));

  const tagsMatchingInput = useMemo(
    () =>
      allTags?.filter(
        (tag) =>
          !tags.includes(tag) && tag.toLowerCase().includes(input.toLowerCase())
      ),
    [input, allTags, tags]
  );

  const onTagSelected = (tag: string) => {
    const existingTag = tags.find((t) => t.toLowerCase() === tag.toLowerCase());
    if (!existingTag) {
      setTags([...tags, tag]);
      setInput("");
    }
  };

  const onTagClicked = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="relative" ref={containerRef} onBlur={onBlur}>
      <TextInput
        icon={<AiOutlineTag size={18} />}
        value={input}
        onChange={setInput}
        onFocus={() => setShowAllTags(true)}
        onEnter={() => onTagSelected(input)}
        className="w-full max-w-xs"
        placeholder="Select tags or add your own"
      />
      {!!tagsMatchingInput && (
        <div
          className={
            "w-full max-w-xs overflow-scroll absolute top-10 bg-white border border-[#EAEAEA] rounded-md py-3 px-4 box-border transition-height shadow-md " +
            (showAllTags ? "block max-h-52" : "hidden max-h-0")
          }
        >
          {tagsMatchingInput.map((tag) => (
            <div
              className="cursor-pointer text-sm font-medium uppercase py-px flex flex-row items-center space-x-1 my-px"
              key={tag}
              onClick={() => onTagSelected(tag)}
            >
              <AiOutlinePlus size={15} />
              <span>{tag}</span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-1">
        {tags.map((tag) => (
          <div
            className="inline-flex flex-row mr-2 mt-1 border border-red-800 uppercase text-sm font-medium rounded-sm px-2 py-1 items-center space-x-1 cursor-pointer"
            key={tag}
            onClick={() => onTagClicked(tag)}
          >
            <span>{tag}</span>
            <GrClose size={10} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagPicker;
