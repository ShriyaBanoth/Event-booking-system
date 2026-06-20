export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
