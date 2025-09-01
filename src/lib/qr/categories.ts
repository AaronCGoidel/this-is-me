export const QR_CATEGORIES = {
  C: {
    name: "Catalogue",
    description: "Art pieces, furniture, books, and other inventory items",
    color: "#FF6B6B",
    icon: "🖼️",
  },
  W: {
    name: "WiFi",
    description: "Network connection strings and credentials",
    color: "#4ECDC4",
    icon: "📶",
  },
  P: {
    name: "Prompts",
    description: "Pre-configured chat queries and AI interactions",
    color: "#45B7D1",
    icon: "💬",
  },
  E: {
    name: "Events",
    description: "Parties, gatherings, and hosted events",
    color: "#96CEB4",
    icon: "🎉",
  },
  R: {
    name: "Redirects",
    description: "External URLs and web links",
    color: "#FFEAA7",
    icon: "🔗",
  },
  S: {
    name: "Social",
    description: "Social media profiles and contact information",
    color: "#DDA0DD",
    icon: "👤",
  },
  T: {
    name: "Tools",
    description: "Smart home controls and IoT devices",
    color: "#98D8C8",
    icon: "🔧",
  },
  A: {
    name: "API",
    description: "Programmatic actions and webhooks",
    color: "#F7DC6F",
    icon: "⚡",
  },
  M: {
    name: "Misc",
    description: "Miscellaneous and future use",
    color: "#B0B0B0",
    icon: "📦",
  },
} as const;

export type QRCategory = keyof typeof QR_CATEGORIES;

export function isValidCategory(category: string): category is QRCategory {
  return category in QR_CATEGORIES;
}

export function getCategoryFromCode(code: string): QRCategory | null {
  const firstChar = code.charAt(0).toUpperCase();
  return isValidCategory(firstChar) ? firstChar : null;
}

export const ACTION_TYPES = {
  // Catalogue actions
  SHOW_ITEM_DETAILS: "show_item_details",
  SHOW_ARTIST_INFO: "show_artist_info",
  PLAY_AUDIO_GUIDE: "play_audio_guide",
  SHOW_PURCHASE_LINK: "show_purchase_link",

  // WiFi actions
  CONNECT_WIFI: "connect_wifi",
  SHOW_NETWORK_INFO: "show_network_info",
  REQUEST_PASSWORD: "request_password",

  // Prompt actions
  INJECT_PROMPT: "inject_prompt",
  EXECUTE_PROMPT: "execute_prompt",
  PROMPT_CHAIN: "prompt_chain",

  // Event actions
  SHOW_EVENT: "show_event",
  RSVP: "rsvp",
  CALENDAR_ADD: "calendar_add",
  SHOW_DIRECTIONS: "show_directions",

  // Redirect actions
  REDIRECT_URL: "redirect_url",
  CONDITIONAL_REDIRECT: "conditional_redirect",
  TRACKED_REDIRECT: "tracked_redirect",

  // Social actions
  OPEN_PROFILE: "open_profile",
  SHARE_CONTACT: "share_contact",
  FOLLOW_ACTION: "follow_action",

  // Tool actions
  SMART_HOME: "smart_home",
  RUN_SHORTCUT: "run_shortcut",
  TRIGGER_ACTION: "trigger_action",

  // API actions
  WEBHOOK: "webhook",
  GRAPHQL_QUERY: "graphql_query",
  FUNCTION_CALL: "function_call",
} as const;

export type ActionType = (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES];

export const CATEGORY_ACTION_MAP: Record<QRCategory, ActionType[]> = {
  C: [
    ACTION_TYPES.SHOW_ITEM_DETAILS,
    ACTION_TYPES.SHOW_ARTIST_INFO,
    ACTION_TYPES.PLAY_AUDIO_GUIDE,
    ACTION_TYPES.SHOW_PURCHASE_LINK,
  ],
  W: [
    ACTION_TYPES.CONNECT_WIFI,
    ACTION_TYPES.SHOW_NETWORK_INFO,
    ACTION_TYPES.REQUEST_PASSWORD,
  ],
  P: [
    ACTION_TYPES.INJECT_PROMPT,
    ACTION_TYPES.EXECUTE_PROMPT,
    ACTION_TYPES.PROMPT_CHAIN,
  ],
  E: [
    ACTION_TYPES.SHOW_EVENT,
    ACTION_TYPES.RSVP,
    ACTION_TYPES.CALENDAR_ADD,
    ACTION_TYPES.SHOW_DIRECTIONS,
  ],
  R: [
    ACTION_TYPES.REDIRECT_URL,
    ACTION_TYPES.CONDITIONAL_REDIRECT,
    ACTION_TYPES.TRACKED_REDIRECT,
  ],
  S: [
    ACTION_TYPES.OPEN_PROFILE,
    ACTION_TYPES.SHARE_CONTACT,
    ACTION_TYPES.FOLLOW_ACTION,
  ],
  T: [
    ACTION_TYPES.SMART_HOME,
    ACTION_TYPES.RUN_SHORTCUT,
    ACTION_TYPES.TRIGGER_ACTION,
  ],
  A: [
    ACTION_TYPES.WEBHOOK,
    ACTION_TYPES.GRAPHQL_QUERY,
    ACTION_TYPES.FUNCTION_CALL,
  ],
  M: [ACTION_TYPES.REDIRECT_URL, ACTION_TYPES.WEBHOOK],
};
