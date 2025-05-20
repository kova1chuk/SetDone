import "./firebase";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { useExerciseStore } from "./stores/exerciseStore";
import { useWorkoutLogStore } from "./stores/workoutLogStore";
import ExerciseLibraryPage from "./pages/ExerciseLibraryPage";
import DailyRoutinePage from "./pages/DailyRoutinePage";
import HistoryPage from "./pages/HistoryPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./stores/authStore";
import "./App.css";
// import { uploadExercises } from "./data/exercises";

function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // useEffect(() => {
  //   uploadExercises();
  // }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around">
          <Link
            to="/"
            className={`flex flex-col items-center py-3 px-4 ${
              isActive("/") ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-xs mt-1">Today</span>
          </Link>
          <Link
            to="/library"
            className={`flex flex-col items-center py-3 px-4 ${
              isActive("/library") ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span className="text-xs mt-1">Library</span>
          </Link>
          <Link
            to="/history"
            className={`flex flex-col items-center py-3 px-4 ${
              isActive("/history") ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs mt-1">History</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const { fetchExercisesLib, fetchUserExercises } = useExerciseStore();
  const { fetchAllLogs } = useWorkoutLogStore();
  const { user, signOut } = useAuthStore();

  useEffect(() => {
    fetchExercisesLib();
    fetchUserExercises();
    fetchAllLogs();
  }, [fetchExercisesLib, fetchUserExercises, fetchAllLogs]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 pb-16">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">SetDone</h1>
            {user && (
              <button
                onClick={signOut}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-gray-800"
              >
                Sign Out
              </button>
            )}
          </div>
        </header>
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
                    <SignInPage />
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
