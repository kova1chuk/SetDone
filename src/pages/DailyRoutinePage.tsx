import { useEffect, useState } from "react";
import { useExerciseStore } from "../stores/exerciseStore";
import { useWorkoutLogStore } from "../stores/workoutLogStore";
import { DateTime } from "luxon";

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

export default function DailyRoutinePage() {
  const { userExercises, isLoading: exercisesLoading } = useExerciseStore();
  const {
    isLoading: logLoading,
    saveLog,
    fetchLogByDate,
    currentLog,
    logs,
    fetchAllLogs,
  } = useWorkoutLogStore();
  const [exerciseInputs, setExerciseInputs] = useState<ExerciseInput[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<number>(0);
  const [savingExercise, setSavingExercise] = useState<string | null>(null);

  useEffect(() => {
    const today = DateTime.now().toFormat("yyyy-MM-dd");
    fetchLogByDate(today);
    fetchAllLogs();
  }, [fetchLogByDate, fetchAllLogs]);

  useEffect(() => {
    if (currentLog) {
      setExerciseInputs(
        currentLog.exercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          value: exercise.value,
          unit: exercise.unit,
        }))
      );
    } else if (userExercises.length > 0) {
      setExerciseInputs([]);
    }
  }, [currentLog, userExercises]);

  const handleExerciseSelect = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setTempValue(0);
  };

  const handleAddExercise = async () => {
    if (!selectedExercise || tempValue <= 0) return;

    const exercise = userExercises.find((e) => e.id === selectedExercise);
    if (!exercise) return;

    const newInput: ExerciseInput = {
      exerciseId: selectedExercise,
      value: tempValue,
      unit: exercise.type === "reps" ? "reps" : "seconds",
    };

    setSavingExercise(selectedExercise);
    const today = DateTime.now().toFormat("yyyy-MM-dd");
    const updatedInputs = [...exerciseInputs, newInput];

    await saveLog({
      date: today,
      exercises: updatedInputs,
    });

    setExerciseInputs(updatedInputs);
    setSelectedExercise(null);
    setTempValue(0);
    setSavingExercise(null);
  };

  const getExerciseSummaries = (): ExerciseSummary[] => {
    const summaries: Record<string, ExerciseSummary> = {};

    Object.values(logs).forEach((log) => {
      log.exercises.forEach((exercise) => {
        if (!summaries[exercise.exerciseId]) {
          const exerciseInfo = userExercises.find(
            (e) => e.id === exercise.exerciseId
          );
          if (!exerciseInfo) return;

          summaries[exercise.exerciseId] = {
            exerciseId: exercise.exerciseId,
            totalValue: exercise.value,
            count: 1,
            unit: exercise.unit,
          };
        } else {
          summaries[exercise.exerciseId].totalValue += exercise.value;
          summaries[exercise.exerciseId].count += 1;
        }
      });
    });

    return Object.values(summaries);
  };

  if (exercisesLoading || logLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const exerciseSummaries = getExerciseSummaries();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Today's Workout</h2>
      </div>

      {/* Already Done Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Already Done</h3>
        {exerciseInputs.length > 0 ? (
          <div className="space-y-4">
            {Array.from(
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
            ).map((input) => {
              const exercise = userExercises.find(
                (e) => e.id === input.exerciseId
              );
              if (!exercise) return null;
              const summary = exerciseSummaries.find(
                (s) => s.exerciseId === exercise.id
              );
              return (
                <div
                  key={exercise.id}
                  className="bg-white p-4 rounded-lg shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{exercise.icon}</span>
                      <div>
                        <h3 className="font-medium">{exercise.name}</h3>
                        <p className="text-sm text-gray-500">
                          {exercise.type === "reps"
                            ? "Repetitions"
                            : "Time (seconds)"}
                        </p>
                        {summary && (
                          <p className="text-sm text-gray-500">
                            Total: {input.value} {input.unit}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No exercises completed yet
          </p>
        )}
      </div>

      {/* Add Exercises Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Add Exercise</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userExercises.map((exercise) => {
            const summary = exerciseSummaries.find(
              (s) => s.exerciseId === exercise.id
            );

            return (
              <div
                key={exercise.id}
                className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer ${
                  selectedExercise === exercise.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handleExerciseSelect(exercise.id)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{exercise.icon}</span>
                  <div>
                    <h3 className="font-medium">{exercise.name}</h3>
                    <p className="text-sm text-gray-500">
                      Type: {exercise.type === "reps" ? "Repetitions" : "Time"}
                    </p>
                    {summary && (
                      <p className="text-sm text-gray-500">
                        Total: {summary.totalValue} {summary.unit} (
                        {summary.count} times)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input and Add Button for Selected Exercise */}
        {selectedExercise && (
          <div className="mt-4 bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {userExercises.find((e) => e.id === selectedExercise)?.icon}
                </span>
                <div>
                  <h3 className="font-medium">
                    {userExercises.find((e) => e.id === selectedExercise)?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {userExercises.find((e) => e.id === selectedExercise)
                      ?.type === "reps"
                      ? "Repetitions"
                      : "Time (seconds)"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="0"
                  value={tempValue}
                  onChange={(e) => setTempValue(parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={savingExercise === selectedExercise}
                />
                <span className="text-gray-500">
                  {userExercises.find((e) => e.id === selectedExercise)
                    ?.type === "reps"
                    ? "reps"
                    : "sec"}
                </span>
                <button
                  onClick={handleAddExercise}
                  disabled={
                    tempValue <= 0 || savingExercise === selectedExercise
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingExercise === selectedExercise ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Exercise History Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Exercise History
        </h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exercise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userExercises.map((exercise) => {
                  // Gather all log entries for this exercise
                  const entries: {
                    date: string;
                    value: number;
                    unit: string;
                  }[] = [];
                  Object.values(logs).forEach((log) => {
                    log.exercises.forEach((ex) => {
                      if (ex.exerciseId === exercise.id) {
                        entries.push({
                          date: log.date,
                          value: ex.value,
                          unit: ex.unit,
                        });
                      }
                    });
                  });
                  if (entries.length === 0) return null;
                  // Sort entries by date descending
                  entries.sort((a, b) => b.date.localeCompare(a.date));
                  return entries.map((entry, idx) => (
                    <tr key={exercise.id + entry.date + idx}>
                      {idx === 0 && (
                        <td
                          className="px-6 py-4 whitespace-nowrap align-top"
                          rowSpan={entries.length}
                        >
                          <div className="flex items-center">
                            <span className="text-2xl mr-2">
                              {exercise.icon}
                            </span>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {exercise.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {exercise.type === "reps"
                                  ? "Repetitions"
                                  : "Time"}
                              </div>
                            </div>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {entry.date}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {entry.value} {entry.unit}
                        </div>
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
