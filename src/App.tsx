import "./firebase";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useExerciseStore } from "./stores/exerciseStore";
import { useWorkoutLogStore } from "./stores/workoutLogStore";
import { useAuthStore } from "./stores/authStore";
import ExerciseLibraryPage from "./pages/ExerciseLibraryPage";
import DailyRoutinePage from "./pages/DailyRoutinePage";
import HistoryPage from "./pages/HistoryPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import "./App.css";
// import { uploadExercises } from "./data/exercises";

function App() {
  const { fetchExercisesLib, fetchUserExercises } = useExerciseStore();
  const { fetchAllLogs } = useWorkoutLogStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchExercisesLib();
    fetchUserExercises();
    fetchAllLogs();
  }, [fetchExercisesLib, fetchUserExercises, fetchAllLogs]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 pb-16">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Routes>
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route
                path="/*"
                element={
                  user ? (
                    <Routes>
                      <Route path="/" element={<DailyRoutinePage />} />
                      <Route
                        path="/library"
                        element={<ExerciseLibraryPage />}
                      />
                      <Route path="/history" element={<HistoryPage />} />
                    </Routes>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  )
                }
              />
            </Routes>
          </div>
        </main>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;
