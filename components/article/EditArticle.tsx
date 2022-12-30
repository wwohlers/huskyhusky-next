import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineEllipsis, AiOutlineLink } from "react-icons/ai";
import { BiImage, BiLinkExternal } from "react-icons/bi";
import { IoMdAlert, IoMdCheckmark } from "react-icons/io";
import { MdTitle } from "react-icons/md";
import { useForm } from "../../hooks/useForm";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges";
import {
  convertTitleToName,
  IArticle,
  isArticleAttr,
  isArticleBrief,
  isArticleName,
  isArticleTitle,
} from "../../services/articles/article.interface";
import toastError from "../../util/toastError";
import Button from "../atoms/Button";
import TextArea from "../atoms/TextArea";
import TextInput from "../atoms/TextInput";
import UploadImage from "../atoms/UploadImage";
import Form from "../forms/Form";
import Section from "../Section";
import TagPicker from "../TagPicker";

const SimpleMDEEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type EditableArticle = Pick<
  IArticle,
  "name" | "title" | "tags" | "brief" | "image" | "attr" | "text" | "public"
>;

type EditArticleProps = {
  article: IArticle;
  onSave: (article: IArticle) => Promise<void>;
};

const EditArticle: React.FC<EditArticleProps> = ({ article, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [liveName, setLiveName] = useState(article.name);
  useUnsavedChanges(hasChanges);
  const {
    values,
    errors,
    onFieldChange: _onFieldChange,
    hasErrors,
  } = useForm<EditableArticle>(
    {
      name: article.name,
      title: article.title,
      tags: article.tags,
      brief: article.brief,
      image: article.image,
      attr: article.attr,
      text: article.text,
      public: article.public,
    },
    {
      name: isArticleName,
      title: isArticleTitle,
      brief: isArticleBrief,
      attr: isArticleAttr,
    }
  );

  const saveArticle = async (values: EditableArticle) => {
    setIsSaving(true);
    try {
      await onSave({
        ...article,
        ...values,
      });
      setHasChanges(false);
      setLiveName(values.name);
    } catch (e) {
      toastError(e);
    } finally {
      setIsSaving(false);
    }
  };

  const onFieldChange =
    (fieldName: keyof EditableArticle) =>
    (value: EditableArticle[typeof fieldName]) => {
      _onFieldChange(fieldName)(value);
      setHasChanges(true);
    };

  const autosave = () => {
    if (!article.public && !hasErrors) {
      saveArticle(values);
    }
  };

  const onEditTitle = (value: string) => {
    onFieldChange("title")(value);
    onFieldChange("name")(convertTitleToName(value));
  };

  const togglePublishAndSave = (_public: boolean) => {
    onFieldChange("public")(_public);
    saveArticle({
      ...values,
      public: _public,
    });
  };

  return (
    <Form>
      <Section title="Basic Info" className="flex flex-col space-y-3">
        <Form.Item title="Title" error={errors.title}>
          <TextInput
            icon={<MdTitle size={18} />}
            value={values.title}
            onChange={onEditTitle}
            name="title"
            onBlur={autosave}
          />
        </Form.Item>
        <Form.Item title="Name" error={errors.name}>
          <TextInput
            icon={<AiOutlineLink size={18} />}
            value={values.name}
            onChange={onFieldChange("name")}
            name="name"
            onBlur={autosave}
          />
        </Form.Item>
        <Form.Item title="Brief" error={errors.brief}>
          <TextArea
            onChange={onFieldChange("brief")}
            value={values.brief}
            name="brief"
            rows={2}
            onBlur={autosave}
          />
        </Form.Item>
        <Form.Item title="Tags">
          <TagPicker
            tags={values.tags}
            setTags={onFieldChange("tags")}
            onBlur={autosave}
          />
        </Form.Item>
      </Section>
      <Section title="Image" className="flex flex-col space-y-3">
        <Form.Item title="Upload">
          <UploadImage
            imageURL={values.image}
            onChange={onFieldChange("image")}
            onBlur={autosave}
          />
        </Form.Item>
        <Form.Item title="Attribution" error={errors.attr}>
          <TextInput
            icon={<BiImage size={18} />}
            value={values.attr}
            onChange={onFieldChange("attr")}
            name="attr"
            onBlur={autosave}
          />
        </Form.Item>
      </Section>
      <Section title="Text" className="flex flex-col space-y-3">
        <SimpleMDEEditor
          value={values.text}
          onChange={onFieldChange("text")}
          onBlur={autosave}
        />
      </Section>
      <Section title="Save & Publish">
        <p className="my-2 text-sm text-secondary font-medium">
          {article.public
            ? "This article is public. Your changes won't be saved unless you republish or unpublish."
            : "This article is private. Your changes will save automatically."}
        </p>
        {article.public && (
          <Link
            className="my-2 w-max font-medium text-sm flex flex-row space-x-1"
            href={"/" + liveName}
            target="_blank"
          >
            <span className="border-b border-black">
              {process.env.NEXT_PUBLIC_BASE_URL + "/" + liveName}
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
        <Form.Buttons className="justify-start">
          {article.public ? (
            <>
              <Button
                submit
                onClick={() => togglePublishAndSave(true)}
                disabled={!hasChanges || hasErrors || isSaving}
              >
                Save and publish changes
              </Button>
              <Button
                type="secondary"
                onClick={() => togglePublishAndSave(false)}
                disabled={isSaving}
              >
                Unpublish
              </Button>
            </>
          ) : (
            <Button
              onClick={() => togglePublishAndSave(true)}
              disabled={hasErrors || isSaving}
            >
              Make public
            </Button>
          )}
        </Form.Buttons>
      </Section>
    </Form>
  );
};

export default EditArticle;
