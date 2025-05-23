import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";

import { useExerciseStore } from "../../../../stores/exerciseStore";
import { useWorkoutLogStore } from "../../../../stores/workoutLogStore";
import { ExerciseCard } from "./ExerciseCard";
import type { ExerciseInput } from "./types";

interface AddExerciseWidgetProps {
  exerciseInputs: ExerciseInput[];
  // onExerciseAdded: (newInput: ExerciseInput) => void;
}

export default function AddExerciseWidget({
  exerciseInputs,
}: // onExerciseAdded,
AddExerciseWidgetProps) {
  const { userExercises, fetchUserExercises, toggleFavoriteExercise } =
    useExerciseStore(useShallow((state) => state));
  const { saveLog } = useWorkoutLogStore();
  const [inputValues, setInputValues] = useState<{
    [exerciseId: string]: number;
  }>({});
  const [savingExercise, setSavingExercise] = useState<string | null>(null);
  const [showFavoritesFirst, setShowFavoritesFirst] = useState(true);

  useEffect(() => {
    fetchUserExercises();
  }, [fetchUserExercises]);

  const handleValueChange = useCallback((exerciseId: string, value: number) => {
    setInputValues((prev) => ({ ...prev, [exerciseId]: value }));
  }, []);

  const handleAddExercise = useCallback(
    async (exerciseId: string) => {
      const value = inputValues[exerciseId] || 0;
      if (value <= 0) return;

      const exercise = userExercises.find((e) => e.id === exerciseId);
      if (!exercise) return;

      const newInput: ExerciseInput = {
        exerciseId,
        value,
        unit: exercise.type === "reps" ? "reps" : "seconds",
      };

      setSavingExercise(exerciseId);
      const today = DateTime.now().toFormat("yyyy-MM-dd");
      const updatedInputs = [...exerciseInputs, newInput];

      try {
        await saveLog({
          date: today,
          exercises: updatedInputs,
        });
        setInputValues((prev) => ({ ...prev, [exerciseId]: 0 }));
      } catch (error) {
        console.error("Failed to save exercise:", error);
      } finally {
        setSavingExercise(null);
      }
    },
    [inputValues, userExercises, exerciseInputs, saveLog]
  );

  const exerciseCards = useMemo(() => {
    const sortedExercises = [...userExercises].sort((a, b) => {
      if (showFavoritesFirst) {
        if (a.favorite && !b.favorite) return -1;
        if (!a.favorite && b.favorite) return 1;
      }
      return a.name.localeCompare(b.name);
    });

    return sortedExercises.map((exercise) => (
      <ExerciseCard
        key={exercise.id}
        name={exercise.name}
        icon={exercise.icon}
        iconSvg={exercise.iconSvg}
        type={exercise.type}
        value={inputValues[exercise.id] || 0}
        onValueChange={(value) => handleValueChange(exercise.id, value)}
        onAdd={() => handleAddExercise(exercise.id)}
        isSaving={savingExercise === exercise.id}
        favorite={exercise.favorite}
        onToggleFavorite={() => toggleFavoriteExercise(exercise.id)}
      />
    ));
  }, [
    userExercises,
    inputValues,
    savingExercise,
    handleValueChange,
    handleAddExercise,
    showFavoritesFirst,
    toggleFavoriteExercise,
  ]);

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Add Exercise</h3>
        <button
          onClick={() => setShowFavoritesFirst(!showFavoritesFirst)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showFavoritesFirst
              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span className="text-xl">{showFavoritesFirst ? "★" : "☆"}</span>
          <span>Show Favorites First</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exerciseCards}
      </div>
    </div>
  );
}
