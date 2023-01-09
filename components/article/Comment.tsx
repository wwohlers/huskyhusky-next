import React, { useState } from "react";
import { BsTrashFill } from "react-icons/bs";
import { useUser } from "../../hooks/useUser";
import { IComment } from "../../services/articles/comment.interface";
import { timeAgo } from "../../util/datetime";

type CommentProps = {
  comment: IComment;
  onDeletePressed: () => void;
};

const Comment: React.FC<CommentProps> = ({ comment, onDeletePressed }) => {
  const user = useUser();
  const [deletePressed, setDeletePressed] = useState(false);

  const onTrash = () => {
    if (!deletePressed) {
      setDeletePressed(true);
      setTimeout(() => {
        setDeletePressed(false);
      }, 5000);
    } else {
      onDeletePressed();
      setDeletePressed(false);
    }
  };

  if (comment.deleted) return null;

  return (
    <div className="my-6">
      <div className="flex justify-between items-center text-secondary text-sm">
        <span className="font-semibold">{comment.name}</span>
        <div className="flex items-center space-x-2">
          <span>{timeAgo(comment.createdAt)}</span>
          {user?.admin && (
            <span className="cursor-pointer" onClick={onTrash}>
              <BsTrashFill
                size={16}
                className={deletePressed ? "text-theme pulse" : ""}
              />
            </span>
          )}
        </div>
      </div>
      <p>{comment.content}</p>
    </div>
  );
};

export default Comment;
