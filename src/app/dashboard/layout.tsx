"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = sessionStorage.getItem("isAuthenticated");
    if (!auth) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) return null;

  return (
    <div className="h-screen flex flex-col">
      <nav className="p-4 bg-gray-800 text-white flex gap-4 sticky">
        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link href="/dashboard/posts" className="hover:underline">
          Posts
        </Link>
        <Link href="/dashboard/users" className="hover:underline">
          Users
        </Link>
        <Link href="/dashboard/comments" className="hover:underline">
          All Comments
        </Link>
        <Button
          onClick={() => {
            sessionStorage.removeItem("isAuthenticated");
            router.push("/login");
          }}
          className="ml-auto bg-red-500 px-4 py-1 rounded cursor-pointer hover:bg-red-700"
        >
          Logout
        </Button>
      </nav>

      <main className="p-4 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
