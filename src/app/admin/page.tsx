"use client";
import { useUser } from "@/contexts/UserContext";
import { createUser, getAllUsers } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Tables } from "@/database.types";

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold mb-4">{children}</h2>
);

const CreateUserForm = () => (
  <div className="flex flex-col py-4">
    <Heading>Create User</Heading>
    <form action={createUser} className="flex flex-col gap-2 w-sm">
      <Input
        type="tel"
        autoComplete="off"
        placeholder="Phone Number (+1234567890)"
        name="phone"
        required
        pattern="^\+[1-9]\d{1,14}$"
        title="Please enter a valid phone number in E164 format (e.g., +1234567890)"
      />
      <Input
        type="text"
        autoComplete="off"
        placeholder="First Name"
        name="firstName"
        required
        title="First name is required"
      />
      <Input
        type="text"
        autoComplete="off"
        placeholder="Last Name (optional)"
        name="lastName"
      />
      <Button variant="default" type="submit">
        Create
      </Button>
    </form>
  </div>
);

type User = Tables<"user_profiles">;

const UserListContent = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAllUsers();

      if (result.error) {
        setError(result.error);
      } else {
        setUsers(result.users);
      }
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return (
      <div>
        <div className="text-red-600 mb-4">Error: {error}</div>
        <Button onClick={fetchUsers} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (users.length === 0) {
    return <p className="text-gray-600">No users found.</p>;
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {users.map((user) => (
        <div key={user.id} className="p-3 border rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1">
                <p className="font-medium">{user.first_name || "No name"}</p>
                {user.last_name && (
                  <p className="font-medium text-gray-300">{user.last_name}</p>
                )}
              </div>
              <p className="text-sm text-gray-300">
                Phone: {user.phone_number || "No phone"}
              </p>
              <p className="text-xs text-gray-400">
                ID: {user.user_id || user.id}
              </p>
            </div>
            <div className="text-xs text-gray-400">
              Created: {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const UserList = () => {
  return (
    <div className="bg-bot-message-bg p-4 rounded-md w-xl">
      <Heading>All Users</Heading>
      <UserListContent />
    </div>
  );
};

export default function Admin() {
  const { user } = useUser();

  return (
    <div className="px-24 max-w-screen-lg mx-auto py-12">
      <h1 className="text-2xl font-bold">Admin</h1>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-300">User: {user?.phone}</p>
          <Button variant="outline" size="sm">
            Logout
          </Button>
        </div>
        <div className="flex justify-between gap-4">
          <CreateUserForm />
          <UserList />
        </div>
      </div>
    </div>
  );
}
