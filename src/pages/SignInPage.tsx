import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../stores/authStore";

export default function SignInPage() {
  const { user, loading, error, signInWithGoogle } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <span className="text-lg">🔒</span>
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
      </div>
    </div>
  );
}
