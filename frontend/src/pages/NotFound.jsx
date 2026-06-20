import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="text-5xl font-semibold text-gray-300 mb-2">404</div>
        <h1 className="text-xl font-medium text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 text-sm mb-6">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-5 py-2.5 text-sm"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
