export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
        <span>© {new Date().getFullYear()} EventBooking. All rights reserved.</span>
        <span>Built with React, Express &amp; MongoDB</span>
      </div>
    </footer>
  );
}
