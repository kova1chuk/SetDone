import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";

import AddExerciseWidget from "../features/dailyRoutine/widgets/AddExerciseWidget";
import AlreadyDoneWidget from "../features/dailyRoutine/widgets/AlreadyDoneWidget";
import { useExerciseStore } from "../stores/exerciseStore";
import { useWorkoutLogStore } from "../stores/workoutLogStore";

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
    fetchLogByDate,
    currentLog,
    logs,
    fetchAllLogs,
  } = useWorkoutLogStore();
  const [exerciseInputs, setExerciseInputs] = useState<ExerciseInput[]>([]);

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
    } else {
      setExerciseInputs([]);
    }
  }, [currentLog]);

  const exerciseSummaries = useMemo(() => {
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
  }, [logs, userExercises]);

  if ((exercisesLoading || logLoading) && !userExercises.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 py-4 space-y-8">
      <div className="flex flex-col items-center text-center space-y-1 pb-2">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Today's Workout
        </h2>
        <p className="text-gray-500 text-base">
          Stay consistent. Log your progress below.
        </p>
      </div>
      <div className="border-b border-gray-200 mb-2" />

      <AlreadyDoneWidget
        exerciseInputs={exerciseInputs}
        exerciseSummaries={exerciseSummaries}
      />

      <AddExerciseWidget exerciseInputs={exerciseInputs} />
    </div>
  );
}
