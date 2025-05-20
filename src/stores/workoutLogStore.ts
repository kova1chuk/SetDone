import { create } from "zustand";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuthStore } from "./authStore";
import {
  saveWorkoutLog as saveLocalWorkoutLog,
  getWorkoutLog as getLocalWorkoutLog,
  getAllWorkoutLogs as getAllLocalWorkoutLogs,
  deleteWorkoutLog as deleteLocalWorkoutLog,
} from "../db";
import { clearLocalDb } from "../db/clearLocalDb";

interface WorkoutExercise {
  exerciseId: string;
  value: number;
  unit: "reps" | "seconds";
}

interface WorkoutLog {
  date: string;
  exercises: WorkoutExercise[];
}

interface WorkoutLogStore {
  logs: Record<string, WorkoutLog>;
  currentLog: WorkoutLog | null;
  isLoading: boolean;
  error: string | null;
  fetchAllLogs: () => Promise<void>;
  fetchLogByDate: (date: string) => Promise<void>;
  saveLog: (log: WorkoutLog) => Promise<void>;
  clearLogByDate: (date: string) => Promise<void>;
  reset: () => void;
}

export const useWorkoutLogStore = create<WorkoutLogStore>((set) => ({
  logs: {},
  currentLog: null,
  isLoading: false,
  error: null,
  fetchAllLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        set({ logs: {}, isLoading: false });
        return;
      }
      // Fetch from Firestore
      const colRef = collection(db, "users", user.uid, "workoutLogs");
      const snapshot = await getDocs(colRef);
      let logsArr: WorkoutLog[] = snapshot.docs.map(
        (doc) => ({ date: doc.id, ...doc.data() } as WorkoutLog)
      );
      // If Firestore is empty, migrate from local DB
      if (logsArr.length === 0) {
        const localLogs = await getAllLocalWorkoutLogs();
        for (const log of localLogs) {
          const docRef = doc(colRef, log.date);
          await setDoc(docRef, log);
        }
        logsArr = localLogs;
      }
      // Write all to local DB
      for (const log of logsArr) {
        await saveLocalWorkoutLog(log);
      }
      const logsMap = logsArr.reduce((acc, log) => {
        acc[log.date] = log;
        return acc;
      }, {} as Record<string, WorkoutLog>);
      set({ logs: logsMap, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch logs",
        isLoading: false,
      });
    }
  },
  fetchLogByDate: async (date: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        set({ currentLog: null, isLoading: false });
        return;
      }
      const docRef = doc(db, "users", user.uid, "workoutLogs", date);
      const docSnap = await getDoc(docRef);
      let log: WorkoutLog | null = null;
      if (docSnap.exists()) {
        log = { date: docSnap.id, ...docSnap.data() } as WorkoutLog;
      } else {
        log = (await getLocalWorkoutLog(date)) || null;
      }
      set({ currentLog: log, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch log",
        isLoading: false,
      });
    }
  },
  saveLog: async (log: WorkoutLog) => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("Not authenticated");
      const docRef = doc(db, "users", user.uid, "workoutLogs", log.date);
      await setDoc(docRef, log);
      await saveLocalWorkoutLog(log);
      set((state) => ({
        logs: { ...state.logs, [log.date]: log },
        currentLog: log,
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to save log",
        isLoading: false,
      });
    }
  },
  clearLogByDate: async (date: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("Not authenticated");
      const docRef = doc(db, "users", user.uid, "workoutLogs", date);
      await deleteDoc(docRef);
      await deleteLocalWorkoutLog(date);
      set((state) => {
        const remainingLogs = Object.assign({}, state.logs);
        delete remainingLogs[date];
        return {
          logs: remainingLogs,
          currentLog: state.currentLog?.date === date ? null : state.currentLog,
          isLoading: false,
        };
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to clear log",
        isLoading: false,
      });
    }
  },
  reset: async () => {
    await clearLocalDb();
    set({ logs: {}, currentLog: null, isLoading: false, error: null });
  },
}));
