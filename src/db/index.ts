import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";

interface SetDoneDB extends DBSchema {
  exercises: {
    key: string;
    value: {
      id: string;
      name: string;
      type: "reps" | "time";
      icon?: string;
    };
  };
  workoutLogs: {
    key: string; // YYYY-MM-DD
    value: {
      date: string;
      exercises: Array<{
        exerciseId: string;
        value: number;
        unit: "reps" | "seconds";
      }>;
    };
  };
}

const DB_NAME = "setdone-db";
const DB_VERSION = 1;

export const initDB = async (): Promise<IDBPDatabase<SetDoneDB>> => {
  return openDB<SetDoneDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("exercises")) {
        db.createObjectStore("exercises", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("workoutLogs")) {
        db.createObjectStore("workoutLogs", { keyPath: "date" });
      }
    },
  });
};

export const db = await initDB();

// Exercise operations
export const addExercise = async (
  exercise: SetDoneDB["exercises"]["value"]
) => {
  return db.add("exercises", exercise);
};

export const upsertExercise = async (
  exercise: SetDoneDB["exercises"]["value"]
) => {
  return db.put("exercises", exercise);
};

export const getExercises = async () => {
  return db.getAll("exercises");
};

// Workout log operations
export const saveWorkoutLog = async (
  log: SetDoneDB["workoutLogs"]["value"]
) => {
  return db.put("workoutLogs", log);
};

export const getWorkoutLog = async (date: string) => {
  return db.get("workoutLogs", date);
};

export const getAllWorkoutLogs = async () => {
  return db.getAll("workoutLogs");
};

export const deleteWorkoutLog = async (date: string) => {
  return db.delete("workoutLogs", date);
};
