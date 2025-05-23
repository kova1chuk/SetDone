interface ExerciseCardProps {
  name: string;
  icon?: string;
  iconSvg?: string;
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
  iconSvg,
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
      onClick={onClick}
      className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-3">
          {iconSvg ? (
            <img
              src={`data:image/svg+xml;utf8,${encodeURIComponent(iconSvg)}`}
              alt={`${name} icon`}
              className="w-8 h-8"
            />
          ) : icon ? (
            <span className="text-2xl">{icon}</span>
          ) : null}
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-gray-500">
              Type: {type === "reps" ? "Repetitions" : "Time"}
            </p>
          </div>
        </div>

        {isSelected && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleIncrement(-1);
                }}
                className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 text-lg"
                disabled={isSaving}
              >
                -1
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleIncrement(1);
                }}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-lg"
                disabled={isSaving}
              >
                +1
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleIncrement(5);
                }}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-lg"
                disabled={isSaving}
              >
                +5
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleIncrement(10);
                }}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-lg"
                disabled={isSaving}
              >
                +10
              </button>
            </div>
            <div className="flex items-center justify-center md:justify-end space-x-2 w-[calc(100%-0.5rem)] md:w-auto">
              <input
                type="number"
                min="0"
                value={value || ""}
                placeholder={type === "reps" ? "reps" : "sec"}
                onChange={(e) => onValueChange(parseInt(e.target.value) || 0)}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                disabled={isSaving}
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd();
                }}
                disabled={value <= 0 || isSaving}
                className="flex-1 md:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
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
