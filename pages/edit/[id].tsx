import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Input from "../../components/atoms/Input";
import Label from "../../components/atoms/Label";
import Section from "../../components/Section";
import { getArticleById } from "../../services/articles";
import { IArticle } from "../../services/articles/article.interface";
import { connectToDB } from "../../services/database";
import stringifyIds from "../../util/stringifyIds";
import { MdTitle } from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";
import TextArea from "../../components/atoms/TextArea";
import TagPicker from "../../components/TagPicker";
import { BiImage } from "react-icons/bi";
import UploadImage from "../../components/atoms/UploadImage";
import SimpleMDE from "react-simplemde-editor";
import { convertHTMLToMarkdown, isHTML } from "../../util/markdown";
import dynamic from "next/dynamic";

const SimpleMDEEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type EditProps = {
  article: IArticle;
};

type EditableArticle = Pick<
  IArticle,
  "name" | "title" | "tags" | "brief" | "image" | "attr" | "text" | "public"
>;

export const getServerSideProps: GetServerSideProps<EditProps> = async ({
  params,
}) => {
  const id = typeof params?.id === "object" ? params.id[0] : params?.id;
  if (!id) {
    return {
      notFound: true,
    };
  }
  const conn = await connectToDB();
  const article = await getArticleById(conn, id);
  conn.close();
  if (!article) {
    return {
      notFound: true,
    };
  }
  stringifyIds(article);
  if (isHTML(article.text)) {
    article.text = convertHTMLToMarkdown(article.text);
  }
  return {
    props: {
      article,
    },
  };
};

const Edit: React.FC<EditProps> = ({ article }) => {
  const [editableArticle, setEditableArticle] = useState<EditableArticle>(
    getEditableArticle(article)
  );

  const onEditTitle = (value: string) => {
    setEditableArticle({
      ...editableArticle,
      title: value,
      name: convertTitleToName(value),
    });
  };

  const stringFieldSetter =
    (fieldName: keyof EditableArticle) => (value: string) => {
      setEditableArticle({
        ...editableArticle,
        [fieldName]: value,
      });
    };

  const onTagsChange = (tags: string[]) => {
    setEditableArticle({
      ...editableArticle,
      tags,
    });
  };

  return (
    <>
      <Head>
        <title>{`Edit ${article.title} - The Husky Husky`}</title>
        <meta
          name="description"
          content={`Edit ${article.title} on The Husky Husky.`}
        />
      </Head>
      <form className="w-full max-w-3xl">
        <h1 className="text-2xl font-medium">
          Editing <span className="font-semibold">{editableArticle.title}</span>
        </h1>
        <Section title="Basic Info" className="flex flex-col space-y-3">
          <label>
            <Label>Title</Label>
            <Input
              icon={<MdTitle size={18} />}
              value={editableArticle.title}
              onChange={onEditTitle}
              name="title"
            />
          </label>
          <label>
            <Label>Name</Label>
            <Input
              icon={<AiOutlineLink size={18} />}
              value={editableArticle.name}
              onChange={stringFieldSetter("name")}
              name="name"
            />
          </label>
          <label>
            <Label>Brief</Label>
            <TextArea
              value={editableArticle.brief}
              onChange={stringFieldSetter("brief")}
              name="brief"
              rows={2}
            />
          </label>
          <div>
            <Label>Tags</Label>
            <TagPicker tags={editableArticle.tags} setTags={onTagsChange} />
          </div>
        </Section>
        <Section title="Image" className="flex flex-col space-y-3">
          <label>
            <Label>Upload</Label>
            <UploadImage
              imageURL={editableArticle.image}
              onChange={stringFieldSetter("image")}
            />
          </label>
          <label>
            <Label>Attribution</Label>
            <Input
              icon={<BiImage size={18} />}
              value={editableArticle.attr}
              onChange={stringFieldSetter("attr")}
              name="attr"
            />
          </label>
        </Section>
        <Section title="Text" className="flex flex-col space-y-3">
          <SimpleMDEEditor value={editableArticle.text} />
        </Section>
      </form>
    </>
  );
};

const getEditableArticle = (article: IArticle): EditableArticle => {
  return {
    name: article.name,
    title: article.title,
    tags: article.tags,
    brief: article.brief,
    image: article.image,
    attr: article.attr,
    text: article.text,
    public: article.public,
  };
};

const convertTitleToName = (title: string): string => {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export default Edit;
