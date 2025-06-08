"use client";

import { useUser } from "@/contexts/UserContext";
import { createUser, getAllUsers } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tables } from "@/database.types";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toE164 } from "@/lib/phone";

type User = Tables<"user_profiles">;

const AdminSection = ({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <section className="flex flex-col gap-4 rounded-md bg-bot-message-bg p-4 shadow-sm">
    <div className="flex items-center justify-between gap-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

const AdminHeader = ({
  profile,
  user,
  signOut,
}: {
  profile: NonNullable<ReturnType<typeof useUser>["profile"]>;
  user: NonNullable<ReturnType<typeof useUser>["user"]>;
  signOut: () => void;
}) => (
  <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
    <p className="text-sm text-gray-300">
      Admin: {profile.first_name} {profile.last_name} ({user.phone})
    </p>
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => (window.location.href = "/")}>
        Home
      </Button>
      <Button variant="outline" size="sm" onClick={signOut}>
        Logout
      </Button>
    </div>
  </header>
);

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
};

const CreateUserForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setError(null);

    const rawPhone = (formData.get("phone") as string) ?? "";
    const normalized = toE164(rawPhone);

    if (!normalized) {
      setError("Please enter a valid phone number");
      return;
    }

    // Mutate the form data in‐place so the server action receives the value.
    formData.set("phone", normalized);

    startTransition(() => {
      createUser(formData);
    });
  };

  return (
    <form action={handleSubmit} className="flex w-full max-w-sm flex-col gap-2">
      <Input
        type="tel"
        autoComplete="tel"
        placeholder="Phone Number (e.g. +1 234-567-8901)"
        name="phone"
        required
      />
      <Input
        type="text"
        autoComplete="given-name"
        placeholder="First Name"
        name="firstName"
        required
      />
      <Input
        type="text"
        autoComplete="family-name"
        placeholder="Last Name (optional)"
        name="lastName"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button variant="default" type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create"}
      </Button>
    </form>
  );
};

const UsersList = ({
  users,
  loading,
  error,
  refetch,
}: {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}) => {
  if (loading) {
    return <p className="text-gray-500">Loading users...</p>;
  }

  if (error) {
    return (
      <div className="space-y-2">
        <div className="text-red-600">Error: {error}</div>
        <Button onClick={refetch} variant="outline" size="sm">
          Retry
        </Button>
      </div>
    );
  }

  if (users.length === 0) {
    return <p className="text-gray-600">No users found.</p>;
  }

  return (
    <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
      {users.map((user) => (
        <li
          key={user.id}
          className="flex items-start justify-between gap-4 rounded-lg border p-3 max-w-lg"
        >
          <div>
            <div className="flex items-center gap-1">
              <span className="font-medium">
                {user.first_name || "No name"}
              </span>
              {user.last_name && (
                <span className="font-medium text-gray-300">
                  {user.last_name}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-300">
              Phone: {user.phone_number || "No phone"}
            </p>
            <p className="text-xs text-gray-400">
              ID: {user.user_id || user.id}
            </p>
          </div>
          <div className="flex-none text-xs text-gray-400">
            {new Date(user.created_at).toLocaleDateString()}
          </div>
        </li>
      ))}
    </ul>
  );
};

const UsersSection = () => {
  const { users, loading, error, refetch } = useUsers();

  return (
    <AdminSection
      title="All Users"
      action={
        <Button variant="outline" size="sm" onClick={refetch}>
          Refresh
        </Button>
      }
    >
      <UsersList
        users={users}
        loading={loading}
        error={error}
        refetch={refetch}
      />
    </AdminSection>
  );
};

export default function Admin() {
  const { user, profile, loading, profileLoading, signOut } = useUser();

  if (loading || profileLoading) {
    return (
      <div className="mx-auto flex h-64 max-w-screen-lg items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user || !profile || !profile.is_admin) {
    return (
      <div className="mx-auto flex h-64 max-w-screen-lg flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="text-center text-gray-600">
          {!user || !profile
            ? "You must be logged in to access the admin panel."
            : "You do not have admin privileges to access this page."}
        </p>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-6">
      <h1 className="text-2xl font-bold">Admin</h1>

      <AdminHeader profile={profile} user={user} signOut={signOut} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminSection title="Create User">
          <CreateUserForm />
        </AdminSection>

        <UsersSection />
      </div>
    </div>
  );
}
