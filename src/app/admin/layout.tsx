"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, profile, loading, profileLoading, signOut } = useUser();

  if (loading || profileLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user || !profile || !profile.is_admin) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return null;
  }

  const navItems = [
    { name: "Create User", href: "/admin/create-user" },
    { name: "Knowledge Base", href: "/admin/knowledgebase" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b p-4">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            Home
          </Button>
          <Button variant="outline" size="sm" onClick={signOut}>
            Logout
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        <nav className="w-60 space-y-1 border-r p-4">
          {navItems.map(({ name, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`block rounded px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  active ? "bg-gray-200 dark:bg-gray-700" : ""
                }`}
              >
                {name}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
