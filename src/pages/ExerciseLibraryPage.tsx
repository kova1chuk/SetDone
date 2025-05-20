import { useEffect } from "react";
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
  } = useExerciseStore();

  useEffect(() => {
    fetchExercisesLib();
    fetchUserExercises();
  }, [fetchExercisesLib, fetchUserExercises]);

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
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Add Custom Exercise
        </button>
      </div>

      {/* Recommended Exercises Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Recommended Exercises
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercisesLib.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{exercise.icon}</span>
                  <div>
                    <h3 className="font-medium">{exercise.name}</h3>
                    <p className="text-sm text-gray-500">
                      Type: {exercise.type === "reps" ? "Repetitions" : "Time"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => addLibExerciseToUser(exercise)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Add to My List
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Exercises Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">My Exercises</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{exercise.icon}</span>
                <div>
                  <h3 className="font-medium">{exercise.name}</h3>
                  <p className="text-sm text-gray-500">
                    Type: {exercise.type === "reps" ? "Repetitions" : "Time"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
