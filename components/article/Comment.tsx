import { DateTime } from "luxon";
import React, { useMemo, useState } from "react";
import { IComment } from "../../services/articles/comment.interface";
import { timeAgo } from "../../util/datetime";
import { BsTrashFill } from "react-icons/bs";
import { useUser } from "../../hooks/useUser";

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
      <div className="flex justify-between items-center text-gray-600 text-sm">
        <span className="font-semibold">{comment.name}</span>
        <div className="flex items-center space-x-2">
          <span>{timeAgo(comment.createdAt)}</span>
          {user?.admin && (
            <span className="cursor-pointer" onClick={onTrash}>
              <BsTrashFill
                size={16}
                className={deletePressed ? "text-red-800 pulse" : ""}
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
