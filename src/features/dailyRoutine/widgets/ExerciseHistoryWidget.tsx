import { useExerciseStore } from "../../../stores/exerciseStore";
import { useWorkoutLogStore } from "../../../stores/workoutLogStore";

export default function ExerciseHistoryWidget() {
  const { userExercises } = useExerciseStore();
  const { logs } = useWorkoutLogStore();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Exercise History</h3>
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
                          <span className="text-2xl mr-2">{exercise.icon}</span>
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
                      <div className="text-sm text-gray-900">{entry.date}</div>
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
  );
}
