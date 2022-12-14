import Image from "next/image";
import React, { ChangeEvent, useEffect, useRef } from "react";
import { makeUploadImageRequest } from "../../pages/api/articles/upload";
import toastError from "../../util/toastError";

type UploadImageProps = {
  imageURL: string | undefined;
  onChange: (imageURL: string) => void;
  onBlur: () => void;
};

const UploadImage: React.FC<UploadImageProps> = ({
  imageURL,
  onChange,
  onBlur,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const reader = useRef<FileReader | null>(null);

  useEffect(() => {
    // needs to be set inside a useEffect to avoid SSR issues
    const fileReader = new FileReader();
    fileReader.onloadend = async (e) => {
      const result = e.target?.result;
      if (result) {
        try {
          const data = await makeUploadImageRequest({
            data: result,
          });
          onChange(data.url);
        } catch (e) {
          toastError(e);
        }
      }
    };
    reader.current = fileReader;
  }, [onChange]);

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      reader.current?.readAsBinaryString(files[0]);
    }
  };

  return (
    <div
      onBlur={onBlur}
      className="border border-background-dark focus:border-theme rounded-md px-2 py-2 transition duration-150"
    >
      <input
        ref={inputRef}
        type="file"
        name="image"
        accept="image/*"
        className="font-medium"
        onChange={handleOnChange}
      />
      {!!imageURL && (
        <div className="mt-2 relative w-full max-w-sm h-56">
          <Image
            src={imageURL}
            alt="Article thumbnail"
            fill
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
