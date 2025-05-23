import { useExerciseStore } from "../../../stores/exerciseStore";

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

interface AlreadyDoneWidgetProps {
  exerciseInputs: ExerciseInput[];
  exerciseSummaries: ExerciseSummary[];
}

export default function AlreadyDoneWidget({
  exerciseInputs,
  exerciseSummaries,
}: AlreadyDoneWidgetProps) {
  const { userExercises } = useExerciseStore();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Already Done</h3>
      {exerciseInputs.length > 0 ? (
        <div className="space-y-4">
          {Array.from(
            exerciseInputs
              .reduce((acc, input) => {
                if (!acc.has(input.exerciseId)) {
                  acc.set(input.exerciseId, { ...input });
                } else {
                  acc.get(input.exerciseId)!.value += input.value;
                }
                return acc;
              }, new Map<string, ExerciseInput>())
              .values()
          ).map((input) => {
            const exercise = userExercises.find(
              (e) => e.id === input.exerciseId
            );
            if (!exercise) return null;
            const summary = exerciseSummaries.find(
              (s) => s.exerciseId === exercise.id
            );
            return (
              <div key={exercise.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{exercise.icon}</span>
                    <div>
                      <h3 className="font-medium">{exercise.name}</h3>
                      <p className="text-sm text-gray-500">
                        {exercise.type === "reps"
                          ? "Repetitions"
                          : "Time (seconds)"}
                      </p>
                      {summary && (
                        <p className="text-sm text-gray-500">
                          Total: {input.value} {input.unit}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          No exercises completed yet
        </p>
      )}
    </div>
  );
}
