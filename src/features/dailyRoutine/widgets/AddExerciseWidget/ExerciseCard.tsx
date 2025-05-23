import { type ExerciseSummary } from "./types";

interface ExerciseCardProps {
  name: string;
  icon: string;
  type: "reps" | "time";
  summary?: ExerciseSummary;
  isSelected: boolean;
  value: number;
  onValueChange: (value: number) => void;
  onAdd: () => void;
  isSaving: boolean;
  onClick: () => void;
}

export function ExerciseCard({
  name,
  icon,
  type,
  summary,
  isSelected,
  value,
  onValueChange,
  onAdd,
  isSaving,
  onClick,
}: ExerciseCardProps) {
  const handleIncrement = (amount: number) => {
    onValueChange(value + amount);
  };

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="flex items-center space-x-3 mb-3" onClick={onClick}>
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-gray-500">
            Type: {type === "reps" ? "Repetitions" : "Time"}
          </p>
          {summary && (
            <p className="text-sm text-gray-500">
              Total: {summary.totalValue} {summary.unit} ({summary.count} times)
            </p>
          )}
        </div>
      </div>

      {isSelected && (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleIncrement(-1)}
            className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
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
          <input
            type="number"
            min="0"
            value={value}
            onChange={(e) => onValueChange(parseInt(e.target.value) || 0)}
            className="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSaving}
          />
          <span className="text-gray-500 text-sm">
            {type === "reps" ? "reps" : "sec"}
          </span>
          <button
            onClick={onAdd}
            disabled={value <= 0 || isSaving}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              "Add"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
