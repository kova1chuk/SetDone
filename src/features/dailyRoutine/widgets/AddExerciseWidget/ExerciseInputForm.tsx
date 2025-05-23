import type { Exercise } from "../../../../stores/exerciseStore";

interface ExerciseInputFormProps {
  exercise: Exercise;
  value: number;
  onValueChange: (value: number) => void;
  onAdd: () => void;
  isSaving: boolean;
}

export function ExerciseInputForm({
  exercise,
  value,
  onValueChange,
  onAdd,
  isSaving,
}: ExerciseInputFormProps) {
  const handleIncrement = (amount: number) => {
    onValueChange(value + amount);
  };

  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {exercise.iconSvg ? (
            <img
              src={`data:image/svg+xml;utf8,${encodeURIComponent(
                exercise.iconSvg
              )}`}
              alt={`${exercise.name} icon`}
              className="w-8 h-8"
            />
          ) : exercise.icon ? (
            <span className="text-2xl">{exercise.icon}</span>
          ) : null}
          <div>
            <h3 className="font-medium">{exercise.name}</h3>
            <p className="text-sm text-gray-500">
              {exercise.type === "reps" ? "Repetitions" : "Time (seconds)"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleIncrement(-1)}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={isSaving}
            >
              -1
            </button>
            <button
              onClick={() => handleIncrement(1)}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={isSaving}
            >
              +1
            </button>
            <button
              onClick={() => handleIncrement(5)}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={isSaving}
            >
              +5
            </button>
            <button
              onClick={() => handleIncrement(10)}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={isSaving}
            >
              +10
            </button>
          </div>
          <input
            type="number"
            min="0"
            value={value}
            onChange={(e) => onValueChange(parseInt(e.target.value) || 0)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSaving}
          />
          <span className="text-gray-500">
            {exercise.type === "reps" ? "reps" : "sec"}
          </span>
          <button
            onClick={onAdd}
            disabled={value <= 0 || isSaving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              "Add"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
