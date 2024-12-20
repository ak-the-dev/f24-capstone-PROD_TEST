// Import necessary modules from Firebase and React
import { auth } from "../firebase"; // Firebase authentication module
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"; // Firebase methods for authentication
import { useState, useContext, useEffect, createContext } from "react"; // React hooks for state and context management

/**
 * React context for authentication.
 * Provides authentication-related data and functions to consuming components.
 * @type {React.Context<Object>}
 */
const AuthContext = createContext();

/**
 * Custom hook to access the AuthContext.
 *
 * @function useAuth
 * @returns {Object} The authentication context value containing user data and auth methods.
 */
export const useAuth = () => useContext(AuthContext);

/**
 * AuthProvider component.
 * Provides authentication-related functionality to its children components.
 *
 * @component
 * @param {Object} props - Props passed to the component.
 * @param {React.ReactNode} props.children - Child components to render.
 * @returns {JSX.Element} The AuthContext provider wrapping the children components.
 */
export const AuthProvider = ({ children }) => {
  /**
   * State to store the currently logged-in user.
   * @type {[Object|null, Function]}
   */
  const [currentUser, setCurrentUser] = useState(null);

  /**
   * State to track the loading status during authentication initialization.
   * @type {[boolean, Function]}
   */
  const [loading, setLoading] = useState(true);

  /**
   * Signs up a new user with email and password.
   *
   * @async
   * @function signup
   * @param {string} email - Email address for the new account.
   * @param {string} password - Password for the new account.
   * @returns {Promise<import("firebase/auth").UserCredential>} - Resolves with user credentials on successful signup.
   * @throws {Error} If an error occurs during signup.
   */
  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  };

  /**
   * Logs in an existing user with email and password.
   *
   * @async
   * @function login
   * @param {string} email - Email address of the user.
   * @param {string} password - Password of the user.
   * @returns {Promise<import("firebase/auth").UserCredential>} - Resolves with user credentials on successful login.
   * @throws {Error} If an error occurs during login.
   */
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  /**
   * Logs out the currently logged-in user.
   *
   * @async
   * @function logout
   * @returns {Promise<void>} - Resolves when the user is successfully logged out.
   * @throws {Error} If an error occurs during logout.
   */
  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  /**
   * React useEffect hook to monitor authentication state changes.
   * Updates the currentUser and loading state based on Firebase auth events.
   */
  useEffect(() => {
    /**
     * Callback function to handle auth state changes.
     *
     * @param {import("firebase/auth").User|null} user - The authenticated user or null if not authenticated.
     */
    const handleAuthStateChanged = (user) => {
      setCurrentUser(user); // Update the current user when authentication state changes
      setLoading(false); // Set loading to false once auth state is resolved
    };

    // Subscribe to authentication state changes
    const unsubscribe = auth.onAuthStateChanged(handleAuthStateChanged);

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  /**
   * Value provided by the AuthContext.
   * Contains the current user and authentication methods.
   *
   * @type {Object}
   * @property {Object|null} currentUser - The currently authenticated user.
   * @property {Function} signup - Function to sign up a new user.
   * @property {Function} login - Function to log in an existing user.
   * @property {Function} logout - Function to log out the current user.
   */
  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  /**
   * Renders the AuthContext.Provider with the provided value.
   * Only renders children once the loading state is resolved.
   *
   * @returns {JSX.Element} The provider component with context values.
   */
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
