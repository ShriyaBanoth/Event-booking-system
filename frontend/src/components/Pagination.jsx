export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Prev
      </button>

      {pages.map((p, idx) => {
        const prevPage = pages[idx - 1];
        const showEllipsis = prevPage && p - prevPage > 1;
        return (
          <span key={p} className="flex items-center">
            {showEllipsis && <span className="px-1.5 text-gray-400">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 text-sm rounded-lg ${
                p === page
                  ? "bg-indigo-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50 text-gray-700"
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
}
