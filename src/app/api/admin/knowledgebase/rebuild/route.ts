import { NextResponse } from "next/server";
import { buildFromDatabase, wipeNamespace } from "@/lib/knowledgebase/builder";
import { createClient } from "@/lib/supabase/server";

// NOTE: The `request` parameter is unused, so we omit it to satisfy the ESLint `no-unused-vars` rule
export async function POST() {
  const supabase = await createClient();

  // Verify user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check admin status via RPC
  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin", {
    p_uid: user.id,
  });

  if (adminError || !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await wipeNamespace();
    await buildFromDatabase();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    // Narrow the unknown error type at runtime to preserve type-safety while still logging the original object
    const message = error instanceof Error ? error.message : "unknown";
    console.error("KB rebuild failed", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
