import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { normalizePhoneNumber, findPhoneProfile } from "@/lib/auth/phoneAuth";

export function getAuthTools() {
  const phoneLogin = {
    description:
      "Some AaronAI users have an account (typically Aaron's friends) to access additional features. Only Aaron can create accounts. There is no signup functionality but to contact Aaron. Ask for the user's phone number if not provided then use this tool to send the OTP.",
    parameters: z.object({
      phone: z
        .string()
        .describe(
          "The phone number of the user to login in E.164 format (e.g., '+1234567890') assume the user is in the US if no country code is provided. Do not mention the format to the user."
        )
        .regex(/^\+[1-9]\d{1,14}$/, "Invalid phone number"),
    }),
    execute: async (args: { phone: string }) => {
      console.log("Phone login tool called with phone:", args.phone);
      try {
        const supabase = await createClient();

        const normalizedPhone = normalizePhoneNumber(args.phone);

        const profile = await findPhoneProfile(supabase, normalizedPhone);

        if (!profile) {
          return {
            success: false,
            message:
              "No account found with this phone number. You can contact Aaron (acgoidel@gmail.com) about getting an account.",
          };
        }

        const { error } = await supabase.auth.signInWithOtp({
          phone: normalizedPhone,
        });

        if (error) {
          return {
            success: false,
            message: `Failed to send OTP. We could not send a code to ${normalizedPhone}. Error: ${error.message}`,
          };
        }

        return {
          success: true,
          message: `OTP sent to ${normalizedPhone}. Please check your messages and provide the 6-digit code.`,
          phone: normalizedPhone,
        };
      } catch (error) {
        console.error("Phone login error:", error);
        return {
          success: false,
          message: "An unexpected error occurred. Please try again.",
        };
      }
    },
  };

  const verifyOtp = {
    description:
      "Verify the OTP code sent to the user's phone number. Use this when users provide the OTP code they received from phoneLogin. You should ask for the phone number if it's not provided. Use this tool when the user provides the 6 digit OTP.",
    parameters: z.object({
      otp: z
        .string()
        .describe("The OTP code to verify (will always be 6 digits)"),
      phone: z
        .string()
        .describe(
          "The phone number associated with the OTP in E.164 format (e.g., '+1234567890')"
        ),
    }),
    execute: async (args: { otp: string; phone: string }) => {
      console.log("OTP verification tool called with phone:", args.phone);
      try {
        if (!args.phone) {
          return {
            success: false,
            message:
              "Please provide your phone number along with the OTP code.",
          };
        }

        const supabase = await createClient();
        const normalizedPhone = normalizePhoneNumber(args.phone);

        const phoneRecord = await findPhoneProfile(supabase, normalizedPhone);

        if (!phoneRecord) {
          return {
            success: false,
            message:
              "No account found with this phone number. Please try again.",
          };
        }

        const { data, error } = await supabase.auth.verifyOtp({
          phone: normalizedPhone,
          token: args.otp.trim(),
          type: "sms",
        });

        if (error) {
          console.error("Error verifying OTP:", error);
          return {
            success: false,
            message: "Invalid OTP code. Please check the code and try again.",
          };
        }

        if (!data.session) {
          return {
            success: false,
            message: "Failed to create session. Please try again.",
          };
        }

        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("phone_number", normalizedPhone)
          .single();

        if (profileError) {
          console.error("Error getting profile:", profileError);
          return {
            success: false,
            message:
              "There was an error getting your profile. Please try again.",
          };
        }

        return {
          success: true,
          message: `Successfully logged in! The user logged in is ${profile.first_name} ${profile.last_name}. They now have access to additional AaronAI features. Make sure to greet the user by name.`,
          user: data.user,
          profile: profile,
          session: data.session,
        };
      } catch (error) {
        console.error("OTP verification error:", error);
        return {
          success: false,
          message:
            "An unexpected error occurred while verifying the OTP. Please try again.",
        };
      }
    },
  };

  const logout = {
    description:
      "Log out the currently authenticated user. Use this when the user explicitly asks to log out, sign out, or switch accounts.",
    parameters: z.object({}),
  };

  return {
    phoneLogin,
    verifyOtp,
    logout,
  };
}
