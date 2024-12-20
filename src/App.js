import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import { FirestoreProvider } from "./contexts/FirestoreContext";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import AddPurchase from "./pages/AddPurchase";
import AddGoal from "./pages/AddGoal";
import AddPaycheck from "./pages/AddPaycheck";
import Spending from "./pages/Spending";
import LandingPage from "./pages/LandingPage"; // Splash screen

/**
 * ProtectedRoute component.
 * Ensures that only authenticated users can access certain routes.
 * Redirects unauthenticated users to the login page.
 * Additionally, handles the display of a splash screen on the first visit.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components to render if authenticated.
 * @returns {JSX.Element} The rendered ProtectedRoute component.
 */
const ProtectedRoute = ({ children }) => {
  /**
   * Current authenticated user.
   * Retrieved from the AuthContext.
   *
   * @type {Object|null}
   * @property {string} uid - The unique identifier of the user.
   */
  const { currentUser } = useAuth();

  /**
   * Checks if the user is authenticated.
   * If not, redirects to the login page.
   */
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  /**
   * Checks if the user has already seen the splash screen.
   * Uses localStorage to persist this information across sessions.
   *
   * @type {string|null}
   */
  const hasSeenSplash = localStorage.getItem("hasSeenSplash");

  /**
   * If the user hasn't seen the splash screen, navigate to it.
   * Marks the splash screen as seen in localStorage to prevent future redirects.
   */
  if (!hasSeenSplash) {
    localStorage.setItem("hasSeenSplash", "true"); // Mark splash screen as seen
    return <Navigate to="/" replace />; // Redirect to the splash screen
  }

  /**
   * If the user is authenticated and has seen the splash screen,
   * render the children components within the Sidebar layout.
   */
  return <Sidebar>{children}</Sidebar>;
};

/**
 * App component.
 * Serves as the root component of the application.
 * Sets up context providers, routing, and protected routes.
 *
 * @component
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  return (
    /**
     * AuthProvider wraps the application to provide authentication context.
     * FirestoreProvider wraps the application to provide Firestore context.
     * Ensures that authentication and Firestore functionalities are accessible throughout the app.
     */
    <AuthProvider>
      <FirestoreProvider>
        {/* Router uses HashRouter for client-side routing.
            HashRouter uses the hash portion of the URL (window.location.hash) to keep the UI in sync with the URL.
            This is useful for static file servers where you don't have server-side routing.
        */}
        <Router>
          {/* Routes define the mapping between URL paths and components */}
          <Routes>
            {/* Splash Screen / Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Login Page */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/spendings"
              element={
                <ProtectedRoute>
                  <Spending />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-purchase"
              element={
                <ProtectedRoute>
                  <AddPurchase />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-goal"
              element={
                <ProtectedRoute>
                  <AddGoal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/income"
              element={
                <ProtectedRoute>
                  <AddPaycheck />
                </ProtectedRoute>
              }
            />

            {/* Catch-All Route
                Redirects any undefined routes to the splash screen.
                Enhances user experience by preventing 404 errors.
            */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </FirestoreProvider>
    </AuthProvider>
  );
}

export default App;
