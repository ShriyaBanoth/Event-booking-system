import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-500 mb-6 text-sm">{user?.email}</p>

        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500">
          This is a protected page — you can only see it while logged in. Event
          listings and your bookings will appear here starting Phase 3.
        </div>
      </div>
    </div>
  );
}
