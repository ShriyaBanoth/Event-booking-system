import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import MyBookings from "./pages/MyBookings";
import VenueRecommendations from "./pages/VenueRecommendations";
import NotFound from "./pages/NotFound";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <div className="min-h-screen flex flex-col">
          <Navbar />

          <div className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/venues" element={<VenueRecommendations />} />
              <Route path="/about" element={<About />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/bookings" element={<MyBookings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
