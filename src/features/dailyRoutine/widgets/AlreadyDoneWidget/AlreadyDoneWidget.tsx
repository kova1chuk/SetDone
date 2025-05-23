import React, { useMemo } from "react";

import { useExerciseStore } from "../../../../stores/exerciseStore";
import { ExerciseCardDone } from "./ExerciseCardDone";

/* ────── domain types ────── */
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

/* ────── fallback UI ────── */
const EmptyState = () => (
  <p className="text-gray-500 text-center py-4">No exercises completed yet</p>
);

interface AlreadyDoneWidgetProps {
  exerciseInputs: ExerciseInput[];
  exerciseSummaries: ExerciseSummary[];
}

export default function AlreadyDoneWidget({
  exerciseInputs = [],
  exerciseSummaries = [],
}: AlreadyDoneWidgetProps) {
  /*───────────────────────────────────────────────────────────────
    1.  Pull the *only* slice we need from the global store
  ───────────────────────────────────────────────────────────────*/
  const userExercises = useExerciseStore((s) => s.userExercises);

  /*───────────────────────────────────────────────────────────────
    2.  Collapse duplicate inputs → O(N)
  ───────────────────────────────────────────────────────────────*/
  const groupedInputs = useMemo(() => {
    const map = new Map<string, ExerciseInput>();

    for (const { exerciseId, value, unit } of exerciseInputs) {
      const existing = map.get(exerciseId);
      if (existing) {
        existing.value += value;
      } else {
        map.set(exerciseId, { exerciseId, value, unit });
      }
    }
    return Array.from(map.values());
  }, [exerciseInputs]);

  /*───────────────────────────────────────────────────────────────
    3.  Pre-index look-ups → O(1) in render loop
  ───────────────────────────────────────────────────────────────*/
  const exerciseById = useMemo(() => {
    const m = new Map<string, (typeof userExercises)[number]>();
    for (const e of userExercises) m.set(e.id, e);
    return m;
  }, [userExercises]);

  const summaryById = useMemo(() => {
    const m = new Map<string, ExerciseSummary>();
    for (const s of exerciseSummaries) m.set(s.exerciseId, s);
    return m;
  }, [exerciseSummaries]);

  /*───────────────────────────────────────────────────────────────
    4.  Build the vnode array once ⇒ zero logic in JSX
  ───────────────────────────────────────────────────────────────*/
  const cards = useMemo(() => {
    return groupedInputs
      .map((input) => {
        const exercise = exerciseById.get(input.exerciseId);
        if (!exercise) return null; // defensive: data out of sync
        return (
          <ExerciseCardDone
            key={exercise.id}
            exercise={exercise}
            input={input}
            summary={summaryById.get(exercise.id)}
          />
        );
      })
      .filter(Boolean) as React.ReactElement[];
  }, [groupedInputs, exerciseById, summaryById]);

  /*───────────────────────────────────────────────────────────────
    5.  Pure render – JSX is now declarative only
  ───────────────────────────────────────────────────────────────*/
  if (!cards.length) return <EmptyState />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {cards}
    </div>
  );
}
