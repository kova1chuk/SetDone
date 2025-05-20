import { create } from "zustand";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "../firebase";
import { clearLocalDb } from "../db/clearLocalDb";

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => {
  // Listen to auth state changes
  onAuthStateChanged(auth, (user) => {
    set({ user, loading: false });
  });

  return {
    user: null,
    loading: false,
    error: null,
    signInWithGoogle: async () => {
      set({ loading: true, error: null });
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        set({ loading: false });
      } catch (error: unknown) {
        set({
          error: error instanceof Error ? error.message : String(error),
          loading: false,
        });
      }
    },
    signOut: async () => {
      set({ loading: true, error: null });
      try {
        await fbSignOut(auth);
        await clearLocalDb();
        set({ user: null, loading: false });
      } catch (error: unknown) {
        set({
          error: error instanceof Error ? error.message : String(error),
          loading: false,
        });
      }
    },
  };
});
