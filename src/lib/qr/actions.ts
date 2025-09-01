import { ACTION_TYPES, ActionType, CATEGORY_ACTION_MAP } from './categories';

export { ACTION_TYPES, CATEGORY_ACTION_MAP };

export interface QRAction {
  id: number;
  qr_code_id: number;
  action_type: ActionType;
  action_data: Record<string, unknown>;
  priority: number;
  valid_from?: string;
  valid_until?: string;
  max_scans?: number;
  requires_auth: boolean;
}

export interface ActionResult {
  success: boolean;
  type: 'redirect' | 'wifi' | 'prompt' | 'display' | 'api' | 'error';
  data?: Record<string, unknown>;
  error?: string;
}

export async function executeAction(action: QRAction, userId?: string): Promise<ActionResult> {
  // Check validity
  const now = new Date();
  if (action.valid_from && new Date(action.valid_from) > now) {
    return { success: false, type: 'error', error: 'This QR code is not yet active' };
  }
  if (action.valid_until && new Date(action.valid_until) < now) {
    return { success: false, type: 'error', error: 'This QR code has expired' };
  }

  // Check auth requirement
  if (action.requires_auth && !userId) {
    return { success: false, type: 'error', error: 'Authentication required' };
  }

  // Execute based on action type
  switch (action.action_type) {
    // Catalogue actions
    case ACTION_TYPES.SHOW_ITEM_DETAILS:
      return {
        success: true,
        type: 'display',
        data: {
          component: 'CatalogueItem',
          props: action.action_data
        }
      };

    // WiFi actions
    case ACTION_TYPES.CONNECT_WIFI:
      return {
        success: true,
        type: 'wifi',
        data: {
          ssid: action.action_data.ssid,
          password: action.action_data.password,
          security: action.action_data.security || 'WPA'
        }
      };

    // Prompt actions
    case ACTION_TYPES.INJECT_PROMPT:
      return {
        success: true,
        type: 'prompt',
        data: {
          prompt: action.action_data.prompt,
          autoExecute: false
        }
      };

    case ACTION_TYPES.EXECUTE_PROMPT:
      return {
        success: true,
        type: 'prompt',
        data: {
          prompt: action.action_data.prompt,
          autoExecute: true
        }
      };

    // Event actions
    case ACTION_TYPES.SHOW_EVENT:
      return {
        success: true,
        type: 'display',
        data: {
          component: 'EventDetails',
          props: action.action_data
        }
      };

    // Redirect actions
    case ACTION_TYPES.REDIRECT_URL:
      return {
        success: true,
        type: 'redirect',
        data: {
          url: action.action_data.url,
          newTab: action.action_data.newTab || false
        }
      };

    // Social actions
    case ACTION_TYPES.OPEN_PROFILE:
      const socialUrls: Record<string, string> = {
        github: 'https://github.com/',
        linkedin: 'https://linkedin.com/in/',
        instagram: 'https://instagram.com/',
        twitter: 'https://twitter.com/',
      };
      
      const platform = String(action.action_data.platform || '');
      const username = String(action.action_data.username || '');
      const baseUrl = socialUrls[platform as keyof typeof socialUrls];
      
      if (!baseUrl) {
        return { success: false, type: 'error', error: 'Unknown social platform' };
      }
      
      return {
        success: true,
        type: 'redirect',
        data: {
          url: `${baseUrl}${username}`,
          newTab: true
        }
      };

    // Tool actions
    case ACTION_TYPES.SMART_HOME:
      return {
        success: true,
        type: 'api',
        data: {
          endpoint: action.action_data.endpoint,
          method: action.action_data.method || 'POST',
          payload: action.action_data.payload
        }
      };

    // API actions
    case ACTION_TYPES.WEBHOOK:
      return {
        success: true,
        type: 'api',
        data: {
          url: action.action_data.url,
          method: action.action_data.method || 'POST',
          headers: action.action_data.headers,
          body: action.action_data.body
        }
      };

    default:
      return { success: false, type: 'error', error: 'Unknown action type' };
  }
}

export function getActionIcon(actionType: ActionType): string {
  const iconMap: Record<ActionType, string> = {
    [ACTION_TYPES.SHOW_ITEM_DETAILS]: '🖼️',
    [ACTION_TYPES.SHOW_ARTIST_INFO]: '🎨',
    [ACTION_TYPES.PLAY_AUDIO_GUIDE]: '🎧',
    [ACTION_TYPES.SHOW_PURCHASE_LINK]: '🛒',
    [ACTION_TYPES.CONNECT_WIFI]: '📶',
    [ACTION_TYPES.SHOW_NETWORK_INFO]: 'ℹ️',
    [ACTION_TYPES.REQUEST_PASSWORD]: '🔒',
    [ACTION_TYPES.INJECT_PROMPT]: '💬',
    [ACTION_TYPES.EXECUTE_PROMPT]: '⚡',
    [ACTION_TYPES.PROMPT_CHAIN]: '🔗',
    [ACTION_TYPES.SHOW_EVENT]: '🎉',
    [ACTION_TYPES.RSVP]: '✅',
    [ACTION_TYPES.CALENDAR_ADD]: '📅',
    [ACTION_TYPES.SHOW_DIRECTIONS]: '🗺️',
    [ACTION_TYPES.REDIRECT_URL]: '🔗',
    [ACTION_TYPES.CONDITIONAL_REDIRECT]: '🔀',
    [ACTION_TYPES.TRACKED_REDIRECT]: '📊',
    [ACTION_TYPES.OPEN_PROFILE]: '👤',
    [ACTION_TYPES.SHARE_CONTACT]: '📇',
    [ACTION_TYPES.FOLLOW_ACTION]: '➕',
    [ACTION_TYPES.SMART_HOME]: '🏠',
    [ACTION_TYPES.RUN_SHORTCUT]: '⚡',
    [ACTION_TYPES.TRIGGER_ACTION]: '🎯',
    [ACTION_TYPES.WEBHOOK]: '🪝',
    [ACTION_TYPES.GRAPHQL_QUERY]: '📊',
    [ACTION_TYPES.FUNCTION_CALL]: '⚙️',
  };
  
  return iconMap[actionType] || '❓';
}