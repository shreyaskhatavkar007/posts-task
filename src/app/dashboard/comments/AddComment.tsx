"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface AddCommentProps {
  onAdd: (text: string) => void;
  username: string;
  isEditing: boolean;
}

export default function AddComment({
  onAdd,
  username,
  isEditing,
}: AddCommentProps) {
  const [newComment, setNewComment] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (newComment.trim()) {
      setAdding(true);
      await onAdd(newComment);
      setAdding(false);
      setNewComment("");
    }
  };

  return (
    <div className="p-4 flex gap-2 max-w-3xl sticky flex-col md:flex-row lg:flex-row">
      <Input
        type="text"
        disabled={isEditing}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder={`Comment...`}
        className="w-full"
      />
      <Button
        className="cursor-pointer"
        disabled={isEditing || newComment.trim() === "" || adding}
        onClick={handleAdd}
      >
        {adding && <Loader2 className="animate-spin h-6 w-6" />}
        Add Comment
      </Button>
    </div>
  );
}
