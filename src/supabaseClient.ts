import { createClient } from "@supabase/supabase-js";

// Check if variables are configured
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Use a fallback/simulator if credentials are not configured, are placeholder default values, or are invalid URLs
let isRealSupabaseConfigured = false;
try {
  if (
    supabaseUrl &&
    typeof supabaseUrl === "string" &&
    supabaseUrl.trim() !== "" &&
    supabaseUrl !== "https://your-supabase-project.supabase.co" &&
    supabaseAnonKey &&
    typeof supabaseAnonKey === "string" &&
    supabaseAnonKey.trim() !== "" &&
    supabaseAnonKey !== "your-anon-key-here"
  ) {
    const parsedUrl = new URL(supabaseUrl.trim());
    if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
      isRealSupabaseConfigured = true;
    }
  }
} catch (e) {
  isRealSupabaseConfigured = false;
}

let realSupabase: any = null;

if (isRealSupabaseConfigured) {
  try {
    realSupabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error("Failed to initialize real Supabase client:", err);
  }
}

// In-memory simulation state for a seamless local developer trial experience
const mockUsersKey = "spark_mock_users";
const currentSessionKey = "spark_session";

const getMockUsers = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(mockUsersKey);
    return raw ? JSON.parse(raw) : { "demo@example.com": "password123" };
  } catch {
    return { "demo@example.com": "password123" };
  }
};

const saveMockUsers = (users: Record<string, string>) => {
  localStorage.setItem(mockUsersKey, JSON.stringify(users));
};

const getStoredSession = () => {
  try {
    const raw = localStorage.getItem(currentSessionKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveStoredSession = (session: any) => {
  if (session) {
    localStorage.setItem(currentSessionKey, JSON.stringify(session));
  } else {
    localStorage.removeItem(currentSessionKey);
  }
};

const authListeners = new Set<(event: string, session: any) => void>();

// Exported standard Supabase Client wrapper
export const supabase = isRealSupabaseConfigured && realSupabase
  ? realSupabase
  : {
      auth: {
        signUp: async ({ email, password }: any) => {
          console.log("[Supabase Simulator] signUp:", email);
          await new Promise((r) => setTimeout(r, 600));

          if (!email || !password) {
            return { data: { user: null, session: null }, error: { message: "Email and password are required." } };
          }
          if (password.length < 6) {
            return { data: { user: null, session: null }, error: { message: "Password must be at least 6 characters." } };
          }

          const users = getMockUsers();
          if (users[email]) {
            return { data: { user: null, session: null }, error: { message: "User already exists." } };
          }

          // Register user
          users[email] = password;
          saveMockUsers(users);

          // By default, let's require email verification to match user requested behavior:
          // "After signUp(), if data.session is null, don't redirect to the dashboard.
          //  Just show: 'Check your email and confirm your account before logging in.'
          //  Only redirect when a real session exists after login."
          return {
            data: {
              user: { id: "mock-uid-" + Math.random().toString(36).substr(2, 9), email },
              session: null, // Force null session to mimic email verification scenario requested
            },
            error: null,
          };
        },

        signInWithPassword: async ({ email, password }: any) => {
          console.log("[Supabase Simulator] signInWithPassword:", email);
          await new Promise((r) => setTimeout(r, 600));

          if (!email || !password) {
            return { data: { session: null, user: null }, error: { message: "Email and password are required" } };
          }

          const users = getMockUsers();
          if (!users[email] || users[email] !== password) {
            return { data: { session: null, user: null }, error: { message: "Invalid login credentials." } };
          }

          const newSession = {
            access_token: "mock-access-token-" + Math.random().toString(36),
            user: {
              id: "mock-uid-" + email.replace(/[@.]/g, "-"),
              email,
              user_metadata: {},
            },
          };

          saveStoredSession(newSession);
          authListeners.forEach((listener) => listener("SIGNED_IN", newSession));

          return {
            data: {
              session: newSession,
              user: newSession.user,
            },
            error: null,
          };
        },

        getSession: async () => {
          const session = getStoredSession();
          return { data: { session }, error: null };
        },

        signOut: async () => {
          console.log("[Supabase Simulator] signOut");
          saveStoredSession(null);
          authListeners.forEach((listener) => listener("SIGNED_OUT", null));
          return { error: null };
        },

        onAuthStateChange: (callback: (event: string, session: any) => void) => {
          authListeners.add(callback);
          // Fire initial callback
          const session = getStoredSession();
          setTimeout(() => callback(session ? "SIGNED_IN" : "SIGNED_OUT", session), 0);

          return {
            data: {
              subscription: {
                unsubscribe: () => {
                  authListeners.delete(callback);
                },
              },
            },
          };
        },
      },
    };
