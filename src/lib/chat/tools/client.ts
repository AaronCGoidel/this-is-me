import { z } from "zod";

export const clientSideTools = {
  showResume: {
    description:
      "Display Aaron's resume inline in the chat with a download option. Use this when users ask for Aaron's resume, CV, or want to see his professional background.",
    parameters: z.object({}),
  },
  showSocialLinks: {
    description:
      "Display Aaron's social media profiles and contact information. Use this when users ask for social media, contact info, GitHub, LinkedIn, Instagram, or email.",
    parameters: z.object({}),
  },
  showCalendly: {
    description:
      "Display Aaron's Calendly booking widget for scheduling meetings or calls. Use this when users want to schedule a meeting, book a call, set up an appointment, or ask about availability.",
    parameters: z.object({}),
  },
};
