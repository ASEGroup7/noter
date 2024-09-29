"use client"

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer } from "@/components/layout/page-container";

export default function AdminDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users and notes data
  const users = useQuery(api.users.list) || [];
  const notes = useQuery(api.notes.list) || [];

  // Mutations for managing users and notes
  const deleteUser = useMutation(api.users.delete);
  const deleteNote = useMutation(api.notes.delete);

  useEffect(() => {
    // Check if the current user is an admin, if not redirect to home
    if (user && !user.publicMetadata.isAdmin) {
      router.push("/");
    }
  }, [user, router]);

  if (!user || !user.publicMetadata.isAdmin) {
    return <div>Loading...</div>;
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => deleteUser({ id: user.id })}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="notes">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotes.map((note) => (
                <TableRow key={note._id}>
                  <TableCell>{note.title}</TableCell>
                  <TableCell>{note.description}</TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => deleteNote({ id: note._id })}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
