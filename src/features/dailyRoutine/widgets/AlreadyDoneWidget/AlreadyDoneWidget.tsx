import { useExerciseStore } from "../../../../stores/exerciseStore";
import { ExerciseCardDone } from "./ExerciseCardDone";

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

function EmptyState() {
  return (
    <p className="text-gray-500 text-center py-4">No exercises completed yet</p>
  );
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

  const groupedInputs = Array.from(
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
  );

  return (
    <div className="space-y-4">
      {/* <h3 className="text-xl font-semibold text-gray-800">Already Done</h3> */}
      {exerciseInputs.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {groupedInputs.map((input) => {
            const exercise = userExercises.find(
              (e) => e.id === input.exerciseId
            );
            if (!exercise) return null;
            const summary = exerciseSummaries.find(
              (s) => s.exerciseId === exercise.id
            );
            return (
              <ExerciseCardDone
                key={exercise.id}
                exercise={exercise}
                input={input}
                summary={summary}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
