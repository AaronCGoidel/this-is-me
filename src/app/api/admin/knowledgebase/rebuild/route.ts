import { NextRequest, NextResponse } from "next/server";
import { buildFromDatabase } from "@/lib/knowledgebase/builder";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
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
    await buildFromDatabase();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("KB rebuild failed", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "unknown" },
      { status: 500 }
    );
  }
}
