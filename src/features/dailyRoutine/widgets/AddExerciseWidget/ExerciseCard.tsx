interface ExerciseCardProps {
  name: string;
  icon?: string;
  iconSvg?: string;
  type: "reps" | "time";
  value: number;
  onValueChange: (value: number) => void;
  onAdd: () => void;
  isSaving: boolean;
  favorite?: boolean;
  onToggleFavorite: () => void;
}

export function ExerciseCard({
  name,
  icon,
  iconSvg,
  type,
  value,
  onValueChange,
  onAdd,
  isSaving,
  favorite,
  onToggleFavorite,
}: ExerciseCardProps) {
  const handleIncrement = (amount: number) => {
    onValueChange(value + amount);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
  };

  return (
    <div className="relative bg-white px-5 py-4 rounded-xl shadow hover:shadow-md transition-shadow">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {iconSvg ? (
              <img
                src={`data:image/svg+xml;utf8,${encodeURIComponent(iconSvg)}`}
                alt={`${name} icon`}
                className="w-32 h-32"
              />
            ) : icon ? (
              <span className="text-2xl">{icon}</span>
            ) : null}
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{name}</h3>
              <span className="text-sm text-gray-500">
                ({type === "reps" ? "reps" : "sec"})
              </span>
            </div>
          </div>
          <button
            onClick={handleToggleFavorite}
            className="focus:outline-none hover:scale-110 transition-transform"
            title={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <span
              className={`text-2xl ${
                favorite ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              {favorite ? "★" : "☆"}
            </span>
          </button>
        </div>
        {favorite && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 rounded-full px-2 py-0.5 text-xs font-medium shadow">
            <span className="text-yellow-400">★</span> Favorite
          </span>
        )}
        <div className="space-y-0">
          <div className="flex gap-3 items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleIncrement(-1);
              }}
              className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-lg transition-colors"
              disabled={isSaving}
            >
              -1
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleIncrement(1);
              }}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-lg transition-colors"
              disabled={isSaving}
            >
              +1
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleIncrement(5);
              }}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-lg transition-colors"
              disabled={isSaving}
            >
              +5
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleIncrement(10);
              }}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-lg transition-colors"
              disabled={isSaving}
            >
              +10
            </button>
          </div>
          <div className="flex gap-3 items-center justify-center md:justify-end mt-3">
            <input
              type="number"
              min="0"
              value={value || ""}
              placeholder={type === "reps" ? "reps" : "sec"}
              onChange={(e) => onValueChange(parseInt(e.target.value) || 0)}
              className="min-w-[80px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-center"
              disabled={isSaving}
              onFocus={(e) => e.target.select()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              disabled={value <= 0 || isSaving}
              className="flex-1 md:flex-none bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Add"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
