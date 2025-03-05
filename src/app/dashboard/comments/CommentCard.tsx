"use client";

import React, { useState, useEffect, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";

interface CommentCardProps {
  comment: { id: number; name: string; email: string; body: string };
  onUpdate: (id: number, newText: string) => void;
  onDelete: (id: number) => void;
  isEditingParent: boolean;
  postID: number;
  setIsEditingParent: (isEditing: boolean) => void;
}

const CommentCard = forwardRef<HTMLDivElement, CommentCardProps>(
  (
    {
      comment,
      onUpdate,
      onDelete,
      isEditingParent,
      setIsEditingParent,
      postID,
    },
    ref,
  ) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.body);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
      setEditText(comment.body);
    }, [comment]);

    const handleEdit = () => {
      setIsEditing(true);
      setIsEditingParent(true);
    };

    const handleSave = async () => {
      if (editText.trim() && editText !== comment.body) {
        setSaving(true);
        await onUpdate(comment.id, editText);
        setSaving(false);
      }
      setIsEditing(false);
      setIsEditingParent(false);
    };

    const handleDelete = async () => {
      setDeleting(true);
      await onDelete(comment.id);
      setDeleting(false);
      setIsModalOpen(false);
    };

    return (
      <div
        ref={ref}
        className={`p-4 ${postID ? "border-b" : "border rounded-lg"}`}
      >
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="" alt={comment.name} />
            <AvatarFallback>
              {comment.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900">
              {comment.name.slice(0, 20)}
            </p>
            <p className="text-sm text-gray-500">{comment.email}</p>
          </div>
        </div>
        <div className="mt-3">
          {isEditing ? (
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSave}
              disabled={saving}
              className="resize-none"
            />
          ) : (
            <p className="text-gray-700">{comment.body}</p>
          )}
        </div>
        <div className="mt-3 flex gap-3">
          {isEditing ? (
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
              Save
            </Button>
          ) : (
            <Pencil
              className={`w-4 h-4 text-blue-500 ${
                isEditingParent
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:text-blue-700"
              }`}
              onClick={isEditingParent ? undefined : handleEdit}
            />
          )}

          <AlertDialog
            open={isModalOpen}
            onOpenChange={isEditingParent ? undefined : setIsModalOpen}
          >
            <AlertDialogTrigger asChild>
              <Trash2
                className={`w-4 h-4 text-red-500 ${
                  isEditingParent
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:text-red-700"
                }`}
                onClick={() =>
                  isEditingParent ? undefined : setIsModalOpen(true)
                }
              />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className="cursor-pointer"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  className="cursor-pointer"
                  variant="destructive"
                  disabled={deleting}
                  onClick={handleDelete}
                >
                  {deleting && (
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  )}
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  },
);

CommentCard.displayName = "CommentCard";
export default React.memo(CommentCard);
