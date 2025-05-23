import type { Exercise } from "../../../../stores/exerciseStore";

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

interface ExerciseCardDoneProps {
  exercise: Exercise;
  input: ExerciseInput;
  summary?: ExerciseSummary;
}

export function ExerciseCardDone({
  exercise,
  input,
  summary,
}: ExerciseCardDoneProps) {
  console.log("re");
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center text-center space-y-2">
        {exercise.icon && <span className="text-4xl">{exercise.icon}</span>}
        <div className="flex items-end justify-center space-x-2">
          <h3 className="font-medium text-lg">{exercise.name}</h3>
          <p className="text-sm text-gray-500 mb-1">({input.unit})</p>
        </div>
        {summary && (
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{input.value}</p>
          </div>
        )}
      </div>
    </div>
  );
}
