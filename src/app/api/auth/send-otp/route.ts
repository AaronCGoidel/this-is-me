import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { normalizePhoneNumber } from "@/lib/phone";

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const normalizedPhone = normalizePhoneNumber(phone);

    if (!normalizedPhone) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Check if a profile exists with this phone number
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("phone_number", normalizedPhone)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error checking profile:", profileError);
      return NextResponse.json(
        {
          success: false,
          message:
            "There was an error checking your profile. Please try again.",
        },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No account found with this phone number. Please contact Aaron to get access to AaronAI.",
        },
        { status: 404 }
      );
    }

    // Send OTP
    const { error } = await supabase.auth.signInWithOtp({
      phone: normalizedPhone,
    });

    if (error) {
      console.error("Error sending OTP:", error);
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to send OTP. Please check your phone number and try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${normalizedPhone}. Please check your messages and provide the 6-digit code.`,
      phone: normalizedPhone,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
