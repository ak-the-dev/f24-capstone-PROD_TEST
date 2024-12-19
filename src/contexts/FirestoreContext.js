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

const FirestoreContext = createContext();

export const useFirestore = () => useContext(FirestoreContext);

export const FirestoreProvider = ({ children }) => {
  /**
   * Create a document indexed by UserID with user's email and a creation timestamp.
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
   * Update fields of user document.
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
   * Returns document containing user data.
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
   * Adds income data to user document.
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
   * Gets income from user document.
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
   * Updates an existing income entry.
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
   * Deletes an income entry.
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
   * Adds expense data to user document.
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
   * Gets expenses from user document.
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
   * Updates an existing expense entry.
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
   * Deletes an expense entry.
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
   * Adds user goal to user document.
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
   * Gets user goals from user document.
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
   * Updates an existing goal entry.
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
   * Deletes a goal entry.
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
