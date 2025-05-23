import { useState, useCallback, useMemo } from "react";
import { useExerciseStore } from "../../../../stores/exerciseStore";
import { DateTime } from "luxon";
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
  const { userExercises } = useExerciseStore();
  const { saveLog } = useWorkoutLogStore();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<number>(0);
  const [savingExercise, setSavingExercise] = useState<string | null>(null);

  const handleExerciseSelect = useCallback((exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setTempValue(0);
  }, []);

  const handleAddExercise = useCallback(
    async (exerciseId: string) => {
      if (tempValue <= 0) return;

      const exercise = userExercises.find((e) => e.id === exerciseId);
      if (!exercise) return;

      const newInput: ExerciseInput = {
        exerciseId,
        value: tempValue,
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

        setSelectedExercise(null);
        setTempValue(0);
      } catch (error) {
        console.error("Failed to save exercise:", error);
      } finally {
        setSavingExercise(null);
      }
    },
    [tempValue, userExercises, exerciseInputs, saveLog]
  );

  const handleValueChange = useCallback((value: number) => {
    setTempValue(value);
  }, []);

  const exerciseCards = useMemo(() => {
    return userExercises
      .filter(
        (exercise): exercise is typeof exercise & { icon: string } =>
          exercise.icon !== undefined && exercise.icon !== null
      )
      .map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          name={exercise.name}
          icon={exercise.icon}
          type={exercise.type}
          isSelected={selectedExercise === exercise.id}
          value={tempValue}
          onValueChange={handleValueChange}
          onAdd={() => handleAddExercise(exercise.id)}
          isSaving={savingExercise === exercise.id}
          onClick={() => handleExerciseSelect(exercise.id)}
        />
      ));
  }, [
    userExercises,
    selectedExercise,
    tempValue,
    savingExercise,
    handleValueChange,
    handleAddExercise,
    handleExerciseSelect,
  ]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Add Exercise</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exerciseCards}
      </div>
    </div>
  );
}
