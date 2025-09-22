import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


const SESSION_ID_KEY = 'chat_session_id';
export const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
};

export const clearSessionId = () => {
  localStorage.removeItem(SESSION_ID_KEY);
};

export const getAgentTrainingStatusColor = (status: string) => {
  switch (status) {
    case "trained": return "bg-green-500/20 text-green-400 border-green-500/50";
    case "not trained": return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    case "training": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
  }
};

const USER_ID_KEY = 'chat_user_id';
export const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};
