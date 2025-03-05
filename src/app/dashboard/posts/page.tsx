"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchPosts } from "@/store/slices/postsSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, MessageCircle } from "lucide-react";
import CommentsPage from "../comments/page";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function PostsPage() {
  const dispatch = useAppDispatch();
  const {
    data: posts,
    loading,
    error,
  } = useAppSelector((state) => state.posts) as {
    data: { id: number; title: string; body: string }[];
    loading: boolean;
    error: string | null;
  };

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center my-6">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <Card key={post.id} className="p-4">
          <CardContent className="">
            <CardTitle className="font-bold text-lg mb-4">
              {post.title}
            </CardTitle>
            <CardDescription className="flex flex-col gap-4 text-gray-600">
              <p>{post.body}</p>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-1 cursor-pointer text-black-500 hover:text-blue-700">
                    <MessageCircle className="w-5 h-5 " />
                    <p>Comments</p>
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  collisionPadding={10}
                  className="w-[300px] md:w-[400px] lg:w-[600px] h-[400px] p-4"
                >
                  <CommentsPage postID={post.id} />
                </PopoverContent>
              </Popover>
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
