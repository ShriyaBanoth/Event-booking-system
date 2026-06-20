import { useEffect, useState } from "react";
import { getEventsRequest, getEventCategoriesRequest } from "../api/events";
import EventCard from "../components/EventCard";
import EventFilters from "../components/EventFilters";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import useDebounce from "../hooks/useDebounce";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("date_asc");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  // Load category options once
  useEffect(() => {
    getEventCategoriesRequest()
      .then((res) => setCategories(res.data.data.categories))
      .catch(() => setCategories([]));
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, sort]);

  useEffect(() => {
    setLoading(true);
    setError("");

    getEventsRequest({ search: debouncedSearch, category, sort, page, limit: 9 })
      .then((res) => {
        setEvents(res.data.data.events);
        setPagination(res.data.data.pagination);
      })
      .catch(() => {
        setError("Couldn't load events. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [debouncedSearch, category, sort, page]);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Browse Events</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Find something happening near you and book your seats.
        </p>

        <EventFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
          sort={sort}
          onSortChange={setSort}
        />

        {loading ? (
          <LoadingSpinner label="Loading events..." />
        ) : error ? (
          <EmptyState title="Something went wrong" message={error} />
        ) : events.length === 0 ? (
          <EmptyState
            title="No events found"
            message="Try adjusting your search or filters."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
