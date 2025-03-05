"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchComments,
  addComment,
  updateComment,
  deleteComment,
  resetComments,
} from "@/store/slices/commentsSlice";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import CommentCard from "./CommentCard";
import AddComment from "./AddComment";

export default function CommentsPage({ postID }: { postID: number }) {
  const dispatch = useDispatch<AppDispatch>();
  const { comments, loading, page, hasMore } = useSelector(
    (state: RootState) => state.comments,
  );
  const [isEditingParent, setIsEditingParent] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const { data: session } = useSession();

  const username = session?.user?.name || "Anonymous";

  useEffect(() => {
    dispatch(resetComments());
    dispatch(fetchComments({ page: 1, postID }));
  }, []);

  const lastCommentRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            dispatch(fetchComments({ page, postID }));
          }
        },
        { threshold: 1.0 },
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, dispatch],
  );

  const handleAddComment = async (comment: string) => {
    if (comment.trim()) {
      await dispatch(addComment({ name: username, body: comment }));
    }
  };

  const handleUpdateComment = async (id: number, newText: string) => {
    await dispatch(updateComment({ id, body: newText }));
  };

  const handleDeleteComment = async (id: number) => {
    await dispatch(deleteComment(id));
  };

  if (loading && comments.length === 0)
    return (
      <div className="flex justify-center my-6">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );

  return (
    <div className="h-full flex flex-col">
      <AddComment
        onAdd={handleAddComment}
        username={username}
        isEditing={isEditingParent}
      />

      <div
        className={`overflow-y-auto flex-1 p-4 grid ${postID ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}`}
      >
        {!loading && comments.length === 0
          ? "No Comments"
          : comments.map((comment, index) => {
              const isLastItem = comments.length - 1 === index;
              return (
                <CommentCard
                  postID={postID}
                  key={comment.id}
                  isEditingParent={isEditingParent}
                  setIsEditingParent={setIsEditingParent}
                  comment={comment}
                  onUpdate={handleUpdateComment}
                  onDelete={handleDeleteComment}
                  ref={isLastItem ? lastCommentRef : null}
                />
              );
            })}
      </div>

      {loading && hasMore && comments.length !== 0 && (
        <div className="flex justify-center my-4">
          <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
          <p className="ml-2 text-gray-600">Loading more comments...</p>
        </div>
      )}
    </div>
  );
}
