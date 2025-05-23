import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { create } from "zustand";

import { getExercises as getLocalExercises, upsertExercise } from "../db";
import { clearLocalDb } from "../db/clearLocalDb";
import { db } from "../firebase";
import { useAuthStore } from "./authStore";

export interface Exercise {
  id: string;
  name: string;
  type: "reps" | "time";
  icon?: string;
  iconSvg?: string;
  isRecommended?: boolean;
}

interface ExerciseStore {
  exercisesLib: Exercise[];
  userExercises: Exercise[];
  isLoading: boolean;
  error: string | null;
  fetchExercisesLib: () => Promise<void>;
  fetchUserExercises: () => Promise<void>;
  addUserExercise: (exercise: Exercise) => Promise<void>;
  addLibExerciseToUser: (exercise: Exercise) => Promise<void>;
  removeUserExercise: (exerciseId: string) => Promise<void>;
  reset: () => void;
}

const RECOMMENDED_EXERCISES: Exercise[] = [
  {
    id: "pushup",
    name: "Push-ups",
    type: "reps",
    icon: "💪",
    isRecommended: true,
  },
  {
    id: "plank",
    name: "Plank",
    type: "time",
    icon: "⏱️",
    isRecommended: true,
  },
  {
    id: "squat",
    name: "Squats",
    type: "reps",
    icon: "🦵",
    isRecommended: true,
  },
  {
    id: "burpee",
    name: "Burpees",
    type: "reps",
    icon: "🔥",
    isRecommended: true,
  },
  {
    id: "mountain-climber",
    name: "Mountain Climbers",
    type: "time",
    icon: "🏃",
    isRecommended: true,
  },
];

export const useExerciseStore = create<ExerciseStore>((set) => ({
  exercisesLib: RECOMMENDED_EXERCISES,
  userExercises: [],
  isLoading: false,
  error: null,
  fetchExercisesLib: async () => {
    set({ isLoading: true, error: null });
    try {
      const colRef = collection(db, "exercisesLib");
      const snapshot = await getDocs(colRef);
      const exercisesLib: Exercise[] = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Exercise)
      );
      set({ exercisesLib, isLoading: false });
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "Failed to fetch library exercises",
        isLoading: false,
      });
    }
  },
  fetchUserExercises: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        set({ userExercises: [], isLoading: false });
        return;
      }
      // Fetch from Firestore
      const colRef = collection(db, "users", user.uid, "exercises");
      const snapshot = await getDocs(colRef);
      let userExercises: Exercise[] = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Exercise)
      );
      // If Firestore is empty, migrate from local DB
      if (userExercises.length === 0) {
        const localExercises = await getLocalExercises();
        for (const ex of localExercises) {
          const docRef = doc(colRef, ex.id);
          await setDoc(docRef, ex);
        }
        userExercises = localExercises;
      }
      // Write all to local DB
      for (const ex of userExercises) {
        await upsertExercise(ex);
      }
      set({ userExercises, isLoading: false });
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "Failed to fetch user exercises",
        isLoading: false,
      });
    }
  },
  addUserExercise: async (exercise) => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("Not authenticated");
      const colRef = collection(db, "users", user.uid, "exercises");
      const docRef = doc(colRef, exercise.id);
      await setDoc(docRef, exercise);
      await upsertExercise(exercise);
      set((state) => ({
        userExercises: [...state.userExercises, exercise],
        isLoading: false,
      }));
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "Failed to add user exercise",
        isLoading: false,
      });
    }
  },
  addLibExerciseToUser: async (exercise) => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("Not authenticated");
      const newExercise = { ...exercise, isRecommended: false };
      const colRef = collection(db, "users", user.uid, "exercises");
      const docRef = doc(colRef, newExercise.id);
      await setDoc(docRef, newExercise);
      await upsertExercise(newExercise);
      set((state) => ({
        userExercises: [...state.userExercises, newExercise],
        isLoading: false,
      }));
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "Failed to add library exercise to user",
        isLoading: false,
      });
    }
  },
  removeUserExercise: async (exerciseId) => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("Not authenticated");
      const colRef = collection(db, "users", user.uid, "exercises");
      const docRef = doc(colRef, exerciseId);
      await deleteDoc(docRef);
      set((state) => ({
        userExercises: state.userExercises.filter((ex) => ex.id !== exerciseId),
        isLoading: false,
      }));
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "Failed to remove user exercise",
        isLoading: false,
      });
    }
  },
  reset: async () => {
    await clearLocalDb();
    set({
      userExercises: [],
      exercisesLib: RECOMMENDED_EXERCISES,
      isLoading: false,
      error: null,
    });
  },
}));
