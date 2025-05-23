import { collection,doc, setDoc } from "firebase/firestore";

import { db } from "../firebase";

const exercises = [
  {
    id: "pushups",
    name: "Push-ups",
    type: "reps",
    icon: "💪",
  },
  {
    id: "pullups",
    name: "Pull-ups",
    type: "reps",
    icon: "🏋️",
  },
  {
    id: "squats",
    name: "Squats",
    type: "reps",
    icon: "🦵",
  },
  {
    id: "plank",
    name: "Plank",
    type: "time",
    icon: "⏱️",
  },
  {
    id: "lunges",
    name: "Lunges",
    type: "reps",
    icon: "🚶",
  },
  {
    id: "dips",
    name: "Dips",
    type: "reps",
    icon: "💪",
  },
  {
    id: "burpees",
    name: "Burpees",
    type: "reps",
    icon: "⚡",
  },
  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    type: "reps",
    icon: "🏃",
  },
];

export const uploadExercises = async () => {
  // Upload each exercise to the global exercisesLib collection
  const uploadPromises = exercises.map((exercise) => {
    const exerciseRef = doc(collection(db, "exercisesLib"), exercise.id);
    return setDoc(exerciseRef, exercise);
  });

  await Promise.all(uploadPromises);
  console.log("Global exercisesLib uploaded");
};
