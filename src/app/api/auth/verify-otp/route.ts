import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { normalizePhoneNumber } from "@/lib/phone";

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: "Phone number and OTP code are required" },
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

    // Verify OTP
    const { data, error } = await supabase.auth.verifyOtp({
      phone: normalizedPhone,
      token: otp.trim(),
      type: "sms",
    });

    if (error) {
      console.error("Error verifying OTP:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP code. Please check the code and try again.",
        },
        { status: 400 }
      );
    }

    if (!data.session) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create session. Please try again.",
        },
        { status: 500 }
      );
    }

    // Get the user profile
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("phone_number", normalizedPhone)
      .single();

    return NextResponse.json({
      success: true,
      message: "Successfully logged in!",
      user: data.user,
      session: data.session,
      profile: profile || null,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
