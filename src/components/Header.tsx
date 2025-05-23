import { useAuthStore } from "../stores/authStore";

export function Header() {
  const { user, signOut } = useAuthStore();

  return (
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
  );
}
