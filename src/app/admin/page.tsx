import { redirect } from "next/navigation";

export default function AdminRootPage() {
  redirect("/admin/create-user");
  return null;
}
