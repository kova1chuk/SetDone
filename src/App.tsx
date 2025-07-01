import "./App.css";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
// import { uploadExercises } from "./data/exercises";
import { auth } from "./firebase";
import DailyRoutinePage from "./pages/DailyRoutinePage";
import ExerciseLibraryPage from "./pages/ExerciseLibraryPage";
import HistoryPage from "./pages/HistoryPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./stores/authStore";
import { useExerciseStore } from "./stores/exerciseStore";
import { useWorkoutLogStore } from "./stores/workoutLogStore";

function App() {
  const { fetchExercisesLib } = useExerciseStore();
  const { fetchAllLogs } = useWorkoutLogStore();
  const { user, setUser, loading: isUserLoading } = useAuthStore();

  // uploadExercises();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    fetchExercisesLib();
    fetchAllLogs();
  }, [fetchExercisesLib, fetchAllLogs]);

  console.log(user);

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
                  user && !isUserLoading ? (
                    <Routes>
                      <Route path="/" element={<DailyRoutinePage />} />
                      <Route
                        path="/library"
                        element={<ExerciseLibraryPage />}
                      />
                      <Route path="/history" element={<HistoryPage />} />
                    </Routes>
                  ) : isUserLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <Navigate to="/signin" />
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
