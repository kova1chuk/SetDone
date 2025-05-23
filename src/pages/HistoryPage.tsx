import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { DateTime } from "luxon";
import { useWorkoutLogStore } from "../stores/workoutLogStore";
import { useExerciseStore } from "../stores/exerciseStore";

export default function HistoryPage() {
  const { logs, isLoading, fetchAllLogs, clearLogByDate } =
    useWorkoutLogStore();
  const { userExercises = [] } = useExerciseStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    fetchAllLogs();
  }, [fetchAllLogs]);

  const getTileClassName = ({ date }: { date: Date }) => {
    const dateStr = DateTime.fromJSDate(date).toFormat("yyyy-MM-dd");
    const log = logs[dateStr];

    if (!log) return "";

    const totalExercises = log.exercises.length;
    if (totalExercises >= 5) return "bg-green-500";
    if (totalExercises >= 3) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getSelectedDateLog = () => {
    if (!selectedDate) return null;
    const dateStr = DateTime.fromJSDate(selectedDate).toFormat("yyyy-MM-dd");
    return logs[dateStr];
  };

  const selectedLog = getSelectedDateLog();

  const handleClearHistory = async () => {
    if (!selectedDate) return;
    if (
      !window.confirm(
        "Are you sure you want to clear this day's workout history?"
      )
    ) {
      return;
    }
    setIsClearing(true);
    const dateStr = DateTime.fromJSDate(selectedDate).toFormat("yyyy-MM-dd");
    await clearLogByDate(dateStr);
    setIsClearing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Workout History</h2>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <Calendar
            onChange={(value) => setSelectedDate(value as Date)}
            value={selectedDate}
            tileClassName={getTileClassName}
            className="w-full"
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          {selectedLog ? (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {DateTime.fromFormat(selectedLog.date, "yyyy-MM-dd").toFormat(
                    "MMMM d, yyyy"
                  )}
                </h3>
                <button
                  onClick={handleClearHistory}
                  disabled={isClearing}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isClearing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Clearing...</span>
                    </>
                  ) : (
                    <>
                      <span>🗑️</span>
                      <span>Clear Day</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {selectedLog.exercises.map((exercise, index) => {
                  const exerciseInfo = userExercises.find(
                    (e) => e.id === exercise.exerciseId
                  );
                  if (!exerciseInfo) return null;

                  return (
                    <div
                      key={`${exercise.exerciseId}-${index}`}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <span>{exerciseInfo.icon}</span>
                        <span>{exerciseInfo.name}</span>
                      </div>
                      <span className="font-medium">
                        {exercise.value} {exercise.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Select a date to view workout details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
