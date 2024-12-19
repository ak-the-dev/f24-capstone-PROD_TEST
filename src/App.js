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

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;

  // Check if the user has already seen the splash screen
  const hasSeenSplash = localStorage.getItem("hasSeenSplash");

  if (!hasSeenSplash) {
    localStorage.setItem("hasSeenSplash", "true"); // Mark splash screen as seen
    return <Navigate to="/" replace />;
  }

  return <Sidebar>{children}</Sidebar>;
};

function App() {
  return (
    <AuthProvider>
      <FirestoreProvider>
        <Router>
          <Routes>
            {/* Splash Screen / Landing Page */}
            <Route path="/" element={<LandingPage />} />
            {/* Login */}
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
            {/* Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </FirestoreProvider>
    </AuthProvider>
  );
}

export default App;
