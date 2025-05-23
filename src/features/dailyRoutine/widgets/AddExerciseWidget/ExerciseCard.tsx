interface ExerciseCardProps {
  name: string;
  icon: string;
  type: "reps" | "time";
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
      className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-4xl">{icon}</span>
          <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        </div>

        {isSelected && (
          <div
            className="flex flex-col space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              <button
                onClick={() => handleIncrement(-1)}
                className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 text-lg"
                disabled={isSaving}
              >
                -1
              </button>
              <button
                onClick={() => handleIncrement(1)}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-lg"
                disabled={isSaving}
              >
                +1
              </button>
              <button
                onClick={() => handleIncrement(5)}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-lg"
                disabled={isSaving}
              >
                +5
              </button>
              <button
                onClick={() => handleIncrement(10)}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-lg"
                disabled={isSaving}
              >
                +10
              </button>
            </div>
            <div className="flex items-center justify-center md:justify-end space-x-2">
              <input
                type="number"
                min="0"
                value={value || ""}
                placeholder={type === "reps" ? "reps" : "sec"}
                onChange={(e) => onValueChange(parseInt(e.target.value) || 0)}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                disabled={isSaving}
              />
              <button
                onClick={onAdd}
                disabled={value <= 0 || isSaving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Add"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
