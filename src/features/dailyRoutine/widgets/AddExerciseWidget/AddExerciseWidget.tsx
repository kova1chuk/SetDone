import { useState } from "react";
import { useExerciseStore } from "../../../../stores/exerciseStore";
import { DateTime } from "luxon";
import { useWorkoutLogStore } from "../../../../stores/workoutLogStore";
import { ExerciseCard } from "./ExerciseCard";
import type { ExerciseInput, ExerciseSummary } from "./types";

interface AddExerciseWidgetProps {
  exerciseInputs: ExerciseInput[];
  exerciseSummaries: ExerciseSummary[];
  onExerciseAdded: (newInput: ExerciseInput) => void;
}

export default function AddExerciseWidget({
  exerciseInputs,
  exerciseSummaries,
  onExerciseAdded,
}: AddExerciseWidgetProps) {
  const { userExercises } = useExerciseStore();
  const { saveLog } = useWorkoutLogStore();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<number>(0);
  const [savingExercise, setSavingExercise] = useState<string | null>(null);

  const handleExerciseSelect = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setTempValue(0);
  };

  const handleAddExercise = async (exerciseId: string) => {
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

    await saveLog({
      date: today,
      exercises: updatedInputs,
    });

    onExerciseAdded(newInput);
    setSelectedExercise(null);
    setTempValue(0);
    setSavingExercise(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Add Exercise</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userExercises.map((exercise) => {
          const summary = exerciseSummaries.find(
            (s) => s.exerciseId === exercise.id
          );

          if (!exercise.icon) return null;

          return (
            <ExerciseCard
              key={exercise.id}
              name={exercise.name}
              icon={exercise.icon}
              type={exercise.type}
              summary={summary}
              isSelected={selectedExercise === exercise.id}
              value={tempValue}
              onValueChange={setTempValue}
              onAdd={() => handleAddExercise(exercise.id)}
              isSaving={savingExercise === exercise.id}
              onClick={() => handleExerciseSelect(exercise.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
