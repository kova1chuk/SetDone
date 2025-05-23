import { collection, doc, setDoc } from "firebase/firestore";

import { db } from "../firebase";

const exercises = [
  {
    id: "pull-ups",
    name: "Pull-ups",
    type: "reps",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><rect x="12" y="8" width="40" height="6" rx="3" fill="#1f2937"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "dips",
    name: "Dips",
    type: "reps",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><circle cx="32" cy="32" r="16" fill="#4b5563" stroke="#2d3748" stroke-width="2"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "crunches",
    name: "Crunches",
    type: "reps",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><path d="M16 44 Q32 20, 48 44" stroke="#10b981" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "leg-raises",
    name: "Leg Raises",
    type: "reps",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><path d="M20 48 Q32 16, 44 48" stroke="#f59e0b" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "bicep-curl-with-dumbbell",
    name: "Bicep Curl with Dumbbell",
    type: "reps",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><rect x="24" y="24" width="16" height="16" rx="6" fill="#8b5cf6"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "overhead-press-with-dumbbell",
    name: "Overhead Press with Dumbbell",
    type: "reps",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><polygon points="32,12 52,52 12,52" fill="#3b82f6"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "lateral-raises-with-dumbbell",
    name: "Lateral Raises with Dumbbell",
    type: "reps",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><path d="M16 48 Q32 32, 48 16" stroke="#0ea5e9" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "kettlebell-bicep-curl",
    name: "Kettlebell Bicep Curl",
    type: "reps",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><rect x="24" y="24" width="16" height="16" rx="6" fill="#8b5cf6"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "overhead-press-with-kettlebell",
    name: "Overhead Press with Kettlebell",
    type: "reps",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><polygon points="32,12 52,52 12,52" fill="#3b82f6"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "double-arm-kettlebell-curl",
    name: "Double-arm Kettlebell Curl",
    type: "reps",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><rect x="24" y="24" width="16" height="16" rx="4" fill="#d1d5db"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "push-ups",
    name: "Push-ups",
    type: "reps",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><rect x="12" y="28" width="40" height="8" rx="4" fill="#ef4444"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "plank",
    name: "Plank",
    type: "seconds",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><line x1="8" y1="32" x2="56" y2="32" stroke="#6b7280" stroke-width="6" stroke-linecap="round"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "squats",
    name: "Squats",
    type: "reps",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><circle cx="32" cy="32" r="12" fill="#facc15" stroke="#d97706" stroke-width="2"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "lunges",
    name: "Lunges",
    type: "reps",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><ellipse cx="32" cy="40" rx="16" ry="8" fill="#22c55e"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "burpees",
    name: "Burpees",
    type: "reps",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><polygon points="32,12 56,52 8,52" fill="#dc2626"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    type: "reps",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><polyline points="8,56 24,16 32,36 56,16" stroke="#16a34a" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "wall-sit",
    name: "Wall Sit",
    type: "seconds",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><rect x="20" y="20" width="24" height="24" rx="8" fill="#374151"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "superman-hold",
    name: "Superman Hold",
    type: "seconds",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><path d="M16 32 Q32 12, 48 32 Q32 52, 16 32" fill="#2563eb"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    type: "reps",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><path d="M32 8 Q52 32, 32 56 Q12 32, 32 8" fill="#eab308"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
  {
    id: "high-knees",
    name: "High Knees",
    type: "reps",
    iconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" style="background:transparent"><path d="M24 48 Q32 24, 40 48" stroke="#1e40af" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="32" cy="20" r="3" fill="#facc15"/><path d="M32 23 Q32 29, 32 35" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 18 Q30 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 18 Q34 20, 32 23" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q30 40, 28 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 35 Q34 40, 36 45" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  },
];

export const uploadExercises = async () => {
  const uploadPromises = exercises.map((exercise) => {
    const exerciseRef = doc(collection(db, "exercisesLib"), exercise.id);
    return setDoc(exerciseRef, exercise);
  });
  await Promise.all(uploadPromises);
  console.log("Global exercisesLib uploaded");
};
