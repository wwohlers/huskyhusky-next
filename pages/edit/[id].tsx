import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { AiOutlineEllipsis, AiOutlineLink } from "react-icons/ai";
import { BiImage } from "react-icons/bi";
import { IoMdAlert, IoMdArrowBack, IoMdCheckmark } from "react-icons/io";
import { MdTitle } from "react-icons/md";
import { toast } from "react-toastify";
import useSWR from "swr";
import Button from "../../components/atoms/Button";
import Input from "../../components/atoms/Input";
import Label from "../../components/atoms/Label";
import TextArea from "../../components/atoms/TextArea";
import UploadImage from "../../components/atoms/UploadImage";
import Section from "../../components/Section";
import TagPicker from "../../components/TagPicker";
import { getArticleById } from "../../services/articles";
import { IArticle } from "../../services/articles/article.interface";
import { connectToDB } from "../../services/database";
import getUserIdFromReq from "../../util/api/getUserIdFromReq";
import { canEditArticle } from "../../util/canEditArticle";
import { apiClient } from "../../util/client";
import { axiosFetcher } from "../../util/client/axios";
import { convertHTMLToMarkdown, isHTML } from "../../util/markdown";
import stringifyIds from "../../util/stringifyIds";
import { MeResponse } from "../api/auth";
import { BiLinkExternal } from "react-icons/bi";

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
  req,
}) => {
  const id = typeof params?.id === "object" ? params.id[0] : params?.id;
  if (!id) {
    return {
      notFound: true,
    };
  }
  const userId = getUserIdFromReq(req);
  if (!userId) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
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
  const user = await conn.models.User.findById(userId).lean();
  stringifyIds(user);
  if (!canEditArticle(user, article)) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
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
  const { data: authResponse } = useSWR<MeResponse>("/auth", axiosFetcher);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedName, setSavedName] = useState(article.name);
  const [editableArticle, setEditableArticle] = useState<EditableArticle>(
    getEditableArticle(article)
  );

  const saveArticle = useCallback(async (article: IArticle) => {
    setIsSaving(true);
    const res = await apiClient.put<IArticle>(`/articles`, article);
    if (res.success) {
      setEditableArticle(getEditableArticle(res.data));
      setIsSaving(false);
      setHasChanges(false);
      setSavedName(res.data.name);
    } else {
      setIsSaving(false);
      toast.error("Failed to save article");
    }
  }, []);

  const autosave = () => {
    if (!editableArticle.public && hasChanges) {
      saveArticle({
        ...article,
        ...editableArticle,
      });
    }
  };

  const onEditTitle = (value: string) => {
    setEditableArticle({
      ...editableArticle,
      title: value,
      name: convertTitleToName(value),
    });
    setHasChanges(true);
  };

  const stringFieldSetter =
    (fieldName: keyof EditableArticle) => (value: string) => {
      setEditableArticle({
        ...editableArticle,
        [fieldName]: value,
      });
      setHasChanges(true);
    };

  const onTagsChange = (tags: string[]) => {
    setEditableArticle({
      ...editableArticle,
      tags,
    });
    setHasChanges(true);
  };

  const handleUnpublish = () => {
    saveArticle({
      ...article,
      ...editableArticle,
      public: false,
    });
  };

  const handlePublish = () => {
    saveArticle({
      ...article,
      ...editableArticle,
      public: true,
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
        <Link
          className="flex flex-row items-center font-medium space-x-1 text-sm mb-1"
          href={
            "/writers/" +
            (authResponse?.authenticated ? authResponse.user.name : "")
          }
        >
          <IoMdArrowBack />
          <span>Back to your profile</span>
        </Link>
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
              onBlur={autosave}
            />
          </label>
          <label>
            <Label>Name</Label>
            <Input
              icon={<AiOutlineLink size={18} />}
              value={editableArticle.name}
              onChange={stringFieldSetter("name")}
              name="name"
              onBlur={autosave}
            />
          </label>
          <label>
            <Label>Brief</Label>
            <TextArea
              value={editableArticle.brief}
              onChange={stringFieldSetter("brief")}
              name="brief"
              rows={2}
              onBlur={autosave}
            />
          </label>
          <div>
            <Label>Tags</Label>
            <TagPicker
              tags={editableArticle.tags}
              setTags={onTagsChange}
              onBlur={autosave}
            />
          </div>
        </Section>
        <Section title="Image" className="flex flex-col space-y-3">
          <label>
            <Label>Upload</Label>
            <UploadImage
              imageURL={editableArticle.image}
              onChange={stringFieldSetter("image")}
              onBlur={autosave}
            />
          </label>
          <label>
            <Label>Attribution</Label>
            <Input
              icon={<BiImage size={18} />}
              value={editableArticle.attr}
              onChange={stringFieldSetter("attr")}
              name="attr"
              onBlur={autosave}
            />
          </label>
        </Section>
        <Section title="Text" className="flex flex-col space-y-3">
          <SimpleMDEEditor
            value={editableArticle.text}
            onChange={stringFieldSetter("text")}
            onBlur={autosave}
          />
        </Section>
        <Section title="Save & Publish">
          <p className="my-2 text-sm text-gray-400 font-medium">
            {editableArticle.public
              ? "This article is public. Your changes won't be saved unless you republish or unpublish."
              : "This article is private. Your changes will save automatically."}
          </p>
          {editableArticle.public && (
            <Link
              className="my-2 w-max font-medium text-sm flex flex-row space-x-1"
              href={"/" + savedName}
              target="_blank"
            >
              <span className="border-b border-gray-900">
                {process.env.NEXT_PUBLIC_BASE_URL + "/" + savedName}
              </span>
              <BiLinkExternal />
            </Link>
          )}
          <p className="my-2 flex flex-row items-center space-x-1 font-medium">
            <span>
              {isSaving ? (
                <AiOutlineEllipsis size={18} />
              ) : hasChanges ? (
                <IoMdAlert size={18} />
              ) : (
                <IoMdCheckmark size={18} />
              )}
            </span>
            <span>
              {isSaving
                ? "Saving..."
                : hasChanges
                ? "You have unsaved changes."
                : "All changes saved."}
            </span>
          </p>
          <div className="flex flex-row items-center space-x-4">
            <Button
              onClick={handlePublish}
              disabled={editableArticle.public && !hasChanges}
            >
              {editableArticle.public
                ? "Save and publish changes"
                : "Make public"}
            </Button>
            {editableArticle.public && (
              <Button type="secondary" onClick={handleUnpublish}>
                Unpublish
              </Button>
            )}
          </div>
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
