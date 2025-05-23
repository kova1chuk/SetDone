import { useState } from "react";
import { useExerciseStore } from "../../../stores/exerciseStore";
import { DateTime } from "luxon";
import { useWorkoutLogStore } from "../../../stores/workoutLogStore";

interface ExerciseInput {
  exerciseId: string;
  value: number;
  unit: "reps" | "seconds";
}

interface ExerciseSummary {
  exerciseId: string;
  totalValue: number;
  count: number;
  unit: "reps" | "seconds";
}

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

  const handleAddExercise = async () => {
    if (!selectedExercise || tempValue <= 0) return;

    const exercise = userExercises.find((e) => e.id === selectedExercise);
    if (!exercise) return;

    const newInput: ExerciseInput = {
      exerciseId: selectedExercise,
      value: tempValue,
      unit: exercise.type === "reps" ? "reps" : "seconds",
    };

    setSavingExercise(selectedExercise);
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

          return (
            <div
              key={exercise.id}
              className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer ${
                selectedExercise === exercise.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => handleExerciseSelect(exercise.id)}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{exercise.icon}</span>
                <div>
                  <h3 className="font-medium">{exercise.name}</h3>
                  <p className="text-sm text-gray-500">
                    Type: {exercise.type === "reps" ? "Repetitions" : "Time"}
                  </p>
                  {summary && (
                    <p className="text-sm text-gray-500">
                      Total: {summary.totalValue} {summary.unit} (
                      {summary.count} times)
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input and Add Button for Selected Exercise */}
      {selectedExercise && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {userExercises.find((e) => e.id === selectedExercise)?.icon}
              </span>
              <div>
                <h3 className="font-medium">
                  {userExercises.find((e) => e.id === selectedExercise)?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {userExercises.find((e) => e.id === selectedExercise)
                    ?.type === "reps"
                    ? "Repetitions"
                    : "Time (seconds)"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="0"
                value={tempValue}
                onChange={(e) => setTempValue(parseInt(e.target.value) || 0)}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={savingExercise === selectedExercise}
              />
              <span className="text-gray-500">
                {userExercises.find((e) => e.id === selectedExercise)?.type ===
                "reps"
                  ? "reps"
                  : "sec"}
              </span>
              <button
                onClick={handleAddExercise}
                disabled={tempValue <= 0 || savingExercise === selectedExercise}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingExercise === selectedExercise ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  "Add"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
