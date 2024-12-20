import { db } from "../firebase";
import {
  arrayUnion,
  serverTimestamp,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { createContext, useContext } from "react";

/**
 * Firestore context to provide Firestore functions throughout the app.
 * @type {React.Context<Object>}
 */
const FirestoreContext = createContext();

/**
 * Custom hook to access Firestore context.
 *
 * @function useFirestore
 * @returns {Object} The Firestore context value containing Firestore methods.
 */
export const useFirestore = () => useContext(FirestoreContext);

/**
 * FirestoreProvider component that wraps the application and provides Firestore functions via context.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element} The Firestore context provider wrapping the children.
 */
export const FirestoreProvider = ({ children }) => {
  /**
   * Creates a user document in Firestore with the specified ID, email, and a creation timestamp.
   *
   * @async
   * @function createUser
   * @param {string} id - The unique identifier for the user.
   * @param {string} email - The user's email address.
   * @returns {Promise<void>} A promise that resolves when the user is created.
   * @throws {Error} If an error occurs while creating the user document.
   */
  const createUser = async (id, email) => {
    try {
      await setDoc(doc(db, "users", id), {
        email: email,
        created: serverTimestamp(),
      });
    } catch (e) {
      console.error("Error adding user document: ", e);
      throw e;
    }
  };

  /**
   * Updates fields of an existing user document in Firestore.
   *
   * @async
   * @function updateUser
   * @param {string} id - The unique identifier for the user.
   * @param {Object} userData - An object containing the user fields to update.
   * @returns {Promise<void>} A promise that resolves when the user is updated.
   * @throws {Error} If an error occurs while updating the user document.
   */
  const updateUser = async (id, userData) => {
    try {
      await setDoc(doc(db, "users", id), userData, { merge: true });
    } catch (e) {
      console.error("Error updating user document: ", e);
      throw e;
    }
  };

  /**
   * Retrieves user data from Firestore for the specified user ID.
   *
   * @async
   * @function getUserData
   * @param {string} id - The unique identifier for the user.
   * @returns {Promise<Object|null>} A promise that resolves to the user data object or null if not found.
   * @throws {Error} If an error occurs while retrieving user data.
   */
  const getUserData = async (id) => {
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such user document.");
        return null;
      }
    } catch (e) {
      console.error("Error retrieving user data: ", e);
      throw e;
    }
  };

  /**
   * Adds income data to the user's document in Firestore.
   *
   * @async
   * @function addIncome
   * @param {string} id - The unique identifier for the user.
   * @param {Object} incomeData - An object containing income details.
   * @returns {Promise<void>} A promise that resolves when the income is added.
   * @throws {Error} If an error occurs while adding income data.
   */
  const addIncome = async (id, incomeData) => {
    try {
      incomeData.id = Date.now().toString(); // Unique ID for income
      incomeData.active = true;
      await setDoc(
        doc(db, "users", id),
        { income: arrayUnion(incomeData) },
        { merge: true }
      );
    } catch (e) {
      console.error("Error adding income data: ", e);
      throw e;
    }
  };

  /**
   * Retrieves income entries from the user's document in Firestore.
   *
   * @async
   * @function getIncome
   * @param {string} id - The unique identifier for the user.
   * @param {number|string} [num="all"] - The number of income entries to retrieve or "all" for all entries.
   * @returns {Promise<Array|null>} A promise that resolves to an array of income objects or null if none found.
   * @throws {Error} If an error occurs while retrieving income data.
   */
  const getIncome = async (id, num = "all") => {
    try {
      const docSnap = await getDoc(doc(db, "users", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.income || data.income.length === 0) return null;

        return num === "all" ? data.income : data.income.slice(0, num);
      }
      return null;
    } catch (e) {
      console.error("Error retrieving user income: ", e);
      throw e;
    }
  };

  /**
   * Updates an existing income entry in the user's document in Firestore.
   *
   * @async
   * @function updateIncome
   * @param {string} id - The unique identifier for the user.
   * @param {string} incomeId - The unique identifier for the income entry.
   * @param {Object} updatedData - An object containing the updated income fields.
   * @returns {Promise<void>} A promise that resolves when the income is updated.
   * @throws {Error} If an error occurs while updating the income entry.
   */
  const updateIncome = async (id, incomeId, updatedData) => {
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const incomeArr = docSnap.data().income || [];
        const updatedIncome = incomeArr.map((income) =>
          income.id === incomeId ? { ...income, ...updatedData } : income
        );
        await updateDoc(docRef, { income: updatedIncome });
      }
    } catch (e) {
      console.error("Error updating income: ", e);
      throw e;
    }
  };

  /**
   * Deletes an income entry from the user's document in Firestore.
   *
   * @async
   * @function deleteIncome
   * @param {string} id - The unique identifier for the user.
   * @param {string} incomeId - The unique identifier for the income entry to delete.
   * @returns {Promise<void>} A promise that resolves when the income is deleted.
   * @throws {Error} If an error occurs while deleting the income entry.
   */
  const deleteIncome = async (id, incomeId) => {
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const incomeArr = docSnap.data().income || [];
        const updatedIncome = incomeArr.filter((income) => income.id !== incomeId);
        await updateDoc(docRef, { income: updatedIncome });
      }
    } catch (e) {
      console.error("Error deleting income: ", e);
      throw e;
    }
  };

  /**
   * Adds expense data to the user's document in Firestore.
   *
   * @async
   * @function addExpenses
   * @param {string} id - The unique identifier for the user.
   * @param {Object} expenseData - An object containing expense details.
   * @returns {Promise<void>} A promise that resolves when the expense is added.
   * @throws {Error} If an error occurs while adding expense data.
   */
  const addExpenses = async (id, expenseData) => {
    try {
      expenseData.id = Date.now().toString(); // Unique ID for expense
      await setDoc(
        doc(db, "users", id),
        { expenses: arrayUnion(expenseData) },
        { merge: true }
      );
    } catch (e) {
      console.error("Error adding expense data: ", e);
      throw e;
    }
  };

  /**
   * Retrieves expense entries from the user's document in Firestore.
   *
   * @async
   * @function getExpenses
   * @param {string} id - The unique identifier for the user.
   * @param {number|string} [num="all"] - The number of expense entries to retrieve or "all" for all entries.
   * @param {string} [category=""] - The category to filter expenses by.
   * @returns {Promise<Array|null>} A promise that resolves to an array of expense objects or null if none found.
   * @throws {Error} If an error occurs while retrieving expenses.
   */
  const getExpenses = async (id, num = "all", category = "") => {
    try {
      const docSnap = await getDoc(doc(db, "users", id));
      if (docSnap.exists()) {
        let expensesArr = docSnap.data().expenses || [];
        if (category) {
          expensesArr = expensesArr.filter(
            (expense) =>
              expense.category &&
              expense.category.toLowerCase() === category.toLowerCase()
          );
        }
        return num === "all" ? expensesArr : expensesArr.slice(0, num);
      }
      return null;
    } catch (e) {
      console.error("Error retrieving expenses: ", e);
      throw e;
    }
  };

  /**
   * Updates an existing expense entry in the user's document in Firestore.
   *
   * @async
   * @function updateExpense
   * @param {string} id - The unique identifier for the user.
   * @param {string} expenseId - The unique identifier for the expense entry.
   * @param {Object} updatedData - An object containing the updated expense fields.
   * @returns {Promise<void>} A promise that resolves when the expense is updated.
   * @throws {Error} If an error occurs while updating the expense entry.
   */
  const updateExpense = async (id, expenseId, updatedData) => {
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const expensesArr = docSnap.data().expenses || [];
        const updatedExpenses = expensesArr.map((expense) =>
          expense.id === expenseId ? { ...expense, ...updatedData } : expense
        );
        await updateDoc(docRef, { expenses: updatedExpenses });
      }
    } catch (e) {
      console.error("Error updating expense: ", e);
      throw e;
    }
  };

  /**
   * Deletes an expense entry from the user's document in Firestore.
   *
   * @async
   * @function deleteExpense
   * @param {string} id - The unique identifier for the user.
   * @param {string} expenseId - The unique identifier for the expense entry to delete.
   * @returns {Promise<void>} A promise that resolves when the expense is deleted.
   * @throws {Error} If an error occurs while deleting the expense entry.
   */
  const deleteExpense = async (id, expenseId) => {
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const expensesArr = docSnap.data().expenses || [];
        const updatedExpenses = expensesArr.filter((expense) => expense.id !== expenseId);
        await updateDoc(docRef, { expenses: updatedExpenses });
      }
    } catch (e) {
      console.error("Error deleting expense: ", e);
      throw e;
    }
  };

  /**
   * Adds a user goal to the user's document in Firestore.
   *
   * @async
   * @function addUserGoal
   * @param {string} id - The unique identifier for the user.
   * @param {Object} userGoal - An object containing goal details.
   * @returns {Promise<void>} A promise that resolves when the goal is added.
   * @throws {Error} If an error occurs while adding the user goal.
   */
  const addUserGoal = async (id, userGoal) => {
    try {
      userGoal.id = Date.now().toString(); // Unique ID for goal
      await setDoc(
        doc(db, "users", id),
        { goals: arrayUnion(userGoal) },
        { merge: true }
      );
    } catch (e) {
      console.error("Error adding user goal: ", e);
      throw e;
    }
  };

  /**
   * Retrieves user goals from the user's document in Firestore.
   *
   * @async
   * @function getUserGoals
   * @param {string} id - The unique identifier for the user.
   * @param {number|string} [num="all"] - The number of goals to retrieve or "all" for all goals.
   * @returns {Promise<Array|null>} A promise that resolves to an array of goal objects or null if none found.
   * @throws {Error} If an error occurs while retrieving user goals.
   */
  const getUserGoals = async (id, num = "all") => {
    try {
      const docSnap = await getDoc(doc(db, "users", id));
      if (docSnap.exists()) {
        const goalsArr = docSnap.data().goals || [];
        return num === "all" ? goalsArr : goalsArr.slice(0, num);
      }
      return null;
    } catch (e) {
      console.error("Error retrieving user goals: ", e);
      throw e;
    }
  };

  /**
   * Updates an existing user goal in the user's document in Firestore.
   *
   * @async
   * @function updateUserGoal
   * @param {string} id - The unique identifier for the user.
   * @param {string} goalId - The unique identifier for the goal entry.
   * @param {Object} updatedData - An object containing the updated goal fields.
   * @returns {Promise<void>} A promise that resolves when the goal is updated.
   * @throws {Error} If an error occurs while updating the goal.
   */
  const updateUserGoal = async (id, goalId, updatedData) => {
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const goalsArr = docSnap.data().goals || [];
        const updatedGoals = goalsArr.map((goal) =>
          goal.id === goalId ? { ...goal, ...updatedData } : goal
        );
        await updateDoc(docRef, { goals: updatedGoals });
      }
    } catch (e) {
      console.error("Error updating goal: ", e);
      throw e;
    }
  };

  /**
   * Deletes a user goal from the user's document in Firestore.
   *
   * @async
   * @function deleteUserGoal
   * @param {string} id - The unique identifier for the user.
   * @param {string} goalId - The unique identifier for the goal entry to delete.
   * @returns {Promise<void>} A promise that resolves when the goal is deleted.
   * @throws {Error} If an error occurs while deleting the goal entry.
   */
  const deleteUserGoal = async (id, goalId) => {
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const goalsArr = docSnap.data().goals || [];
        const updatedGoals = goalsArr.filter((goal) => goal.id !== goalId);
        await updateDoc(docRef, { goals: updatedGoals });
      }
    } catch (e) {
      console.error("Error deleting goal: ", e);
      throw e;
    }
  };

  const value = {
    createUser,
    updateUser,
    getUserData,
    addIncome,
    getIncome,
    updateIncome,
    deleteIncome,
    addExpenses,
    getExpenses,
    updateExpense,
    deleteExpense,
    addUserGoal,
    getUserGoals,
    updateUserGoal,
    deleteUserGoal,
  };

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
};
