export default function EventFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  sort,
  onSortChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search events by name, venue, or description..."
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
      >
        <option value="date_asc">Date: Soonest first</option>
        <option value="date_desc">Date: Latest first</option>
        <option value="name_asc">Name: A-Z</option>
        <option value="name_desc">Name: Z-A</option>
        <option value="price_asc">Price: Low to high</option>
        <option value="price_desc">Price: High to low</option>
      </select>
    </div>
  );
}
