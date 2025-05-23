export interface ExerciseInput {
  exerciseId: string;
  value: number;
  unit: "reps" | "seconds";
}

export interface ExerciseSummary {
  exerciseId: string;
  totalValue: number;
  count: number;
  unit: "reps" | "seconds";
}
