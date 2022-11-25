import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { IComment } from "../../services/articles/comment.interface";
import { timeAgo } from "../../util/datetime";

type CommentProps = {
  comment: IComment;
};

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const timeAgoStr = useMemo(() => {
    const dt = DateTime.fromMillis(comment.createdAt * 1000);
    return timeAgo(dt);
  }, [comment]);

  return (
    <div className="my-6">
      <div className="flex flex-row justify-between items-center text-gray-600 text-sm">
        <span className="font-semibold">{comment.name}</span>
        <span>{timeAgoStr}</span>
      </div>
      <p>{comment.content}</p>
    </div>
  );
};

export default Comment;
