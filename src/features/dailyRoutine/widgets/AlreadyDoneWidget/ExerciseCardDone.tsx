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
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-green-100 cursor-pointer">
      <div className="flex flex-col items-center text-center space-y-2">
        {exercise.iconSvg ? (
          <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(
              exercise.iconSvg
            )}`}
            alt={`${exercise.name} icon`}
            className="w-12 h-12"
          />
        ) : exercise.icon ? (
          <span className="text-4xl">{exercise.icon}</span>
        ) : null}
        <div className="flex items-center justify-center gap-2">
          <h3 className="font-medium text-lg">{exercise.name}</h3>
          <p className="text-sm text-gray-500">({input.unit})</p>
        </div>
        {summary && (
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{input.value}</p>
          </div>
        )}
      </div>
    </div>
  );
}
