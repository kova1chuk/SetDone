import { useEffect, useMemo, useState } from "react";

import type { Exercise } from "../stores/exerciseStore";
import { useExerciseStore } from "../stores/exerciseStore";

export default function ExerciseLibraryPage() {
  const {
    userExercises = [],
    exercisesLib = [],
    isLoading,
    error,
    fetchExercisesLib,
    fetchUserExercises,
    addLibExerciseToUser,
    removeUserExercise,
  } = useExerciseStore();

  useEffect(() => {
    fetchExercisesLib();
    fetchUserExercises();
  }, [fetchExercisesLib, fetchUserExercises]);

  // Filter out exercises that are already in user's list and sort them
  const availableExercises = useMemo(() => {
    const userExerciseIds = new Set(userExercises.map((ex) => ex.id));
    const filtered = exercisesLib.filter((ex) => !userExerciseIds.has(ex.id));
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [exercisesLib, userExercises]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-4">Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Exercise Library</h2>
        <div className="flex gap-4 items-center">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add Custom Exercise
          </button>
        </div>
      </div>

      {/* Recommended Exercises Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Recommended Exercises
        </h3>
        {availableExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableExercises.map((exercise) => (
              <ExerciseCardLibrary
                key={exercise.id}
                exercise={exercise}
                onAdd={addLibExerciseToUser}
                onRemove={removeUserExercise}
                isUser={false}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            All recommended exercises have been added to your list
          </p>
        )}
      </div>

      {/* My Exercises Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">My Exercises</h3>
        {userExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userExercises.map((exercise) => (
              <ExerciseCardLibrary
                key={exercise.id}
                exercise={exercise}
                onAdd={addLibExerciseToUser}
                onRemove={removeUserExercise}
                isUser={true}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            You haven't added any exercises yet
          </p>
        )}
      </div>
    </div>
  );
}

type ExerciseCardLibraryProps = {
  exercise: Exercise;
  onAdd?: (exercise: Exercise) => Promise<void>;
  onRemove?: (exerciseId: string) => Promise<void>;
  isUser?: boolean;
};

function ExerciseCardLibrary({
  exercise,
  onAdd = async () => {},
  onRemove = async () => {},
  isUser = false,
}: ExerciseCardLibraryProps) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [undoTimeout, setUndoTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    await onAdd(exercise);
    setAdding(false);
    setAdded(true);
    const timeout = setTimeout(() => setAdded(false), 1500);
    setUndoTimeout(timeout);
  };

  const handleUndo = () => {
    if (undoTimeout) clearTimeout(undoTimeout);
    setAdded(false);
    setUndoTimeout(null);
  };

  return (
    <div
      className={`bg-white p-4 rounded-lg ${
        isUser ? "shadow" : "shadow-lg"
      } flex items-center gap-4 transition-all`}
    >
      {/* Left column: Icon */}
      <div className="flex-shrink-0">
        {exercise.iconSvg ? (
          <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(
              exercise.iconSvg
            )}`}
            alt={`${exercise.name} icon`}
            className="w-16 h-16 drop-shadow"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
        ) : (
          <span className="text-4xl">{exercise.icon}</span>
        )}
        {showTooltip && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-gray-800 text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap shadow-lg">
            {exercise.description || "No description"}
          </div>
        )}
      </div>

      {/* Right column: Name and Functionality */}
      <div className="flex-grow min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-md truncate">{exercise.name}</h3>
            {/* Badges/tags */}
            <div className="flex flex-wrap gap-1 mt-1">
              {exercise.favorite && (
                <span className="bg-yellow-100 text-yellow-700 rounded-full px-2 py-0.5 text-xs font-medium flex items-center gap-1">
                  <span className="text-yellow-400">★</span> Favorite
                </span>
              )}
              {exercise.badges?.map((badge: string) => (
                <span
                  key={badge}
                  className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs font-medium"
                >
                  {badge}
                </span>
              ))}
              {exercise.bodyPart && (
                <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-medium">
                  {exercise.bodyPart}
                </span>
              )}
              {exercise.equipment && (
                <span className="bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs font-medium">
                  {exercise.equipment}
                </span>
              )}
            </div>
          </div>

          {/* Action Button */}
          {!isUser ? (
            <div className="flex-shrink-0">
              <button
                onClick={handleAdd}
                disabled={adding || added}
                className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors ${
                  adding
                    ? "bg-gray-200 text-gray-400"
                    : added
                    ? "bg-green-100 text-green-700"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {adding ? (
                  <span className="animate-spin h-4 w-4 border-2 border-green-700 border-t-transparent rounded-full"></span>
                ) : added ? (
                  <span className="mr-1">✅</span>
                ) : (
                  <span className="mr-1">➕</span>
                )}
                {added ? "Added!" : "Add"}
              </button>
              {added && (
                <button
                  onClick={handleUndo}
                  className="mt-1 text-xs text-blue-600 underline block w-full text-center"
                >
                  Undo
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => onRemove && onRemove(exercise.id)}
              className="flex-shrink-0 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
