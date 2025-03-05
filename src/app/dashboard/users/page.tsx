"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchUsers } from "@/store/slices/usersSlice";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const {
    data: users,
    loading,
    error,
  } = useAppSelector((state) => state.users) as {
    data: {
      id: number;
      name: string;
      email: string;
      address: { city: string };
      phone: string;
      company: { name: string };
    }[];
    loading: boolean;
    error: string | null;
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center my-6">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Company</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.address.city}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.company.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
