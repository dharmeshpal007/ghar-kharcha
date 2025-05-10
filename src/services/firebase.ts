// Firebase initialization for the project
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, push, onValue, remove, update } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDTr2Fbr8Q4X3QmaN5E8hHYq0yasz8sjtY",
    authDomain: "ghar-kharcha-bafce.firebaseapp.com",
    databaseURL: "https://ghar-kharcha-bafce-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ghar-kharcha-bafce",
    storageBucket: "ghar-kharcha-bafce.firebasestorage.app",
    messagingSenderId: "709429468143",
    appId: "1:709429468143:web:4306ceb53cab9d8c1eb41a",
    measurementId: "G-SLJ015W1ET"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export const database = getDatabase(app);

export interface Expense {
  key?: string;
  date: string;
  amount: number;
  category: string;
  mood: string;
  notes: string;
  user: string;
  recurring: boolean;
  goal: string;
  type: 'income' | 'expense';
}

export const addExpense = (expense: Expense) => {
  const expensesRef = ref(database, "expenses");
  return push(expensesRef, expense);
};

export const deleteExpense = (key: string) => {
  const expenseRef = ref(database, `expenses/${key}`);
  return remove(expenseRef);
};

export const listenExpenses = (callback: (expenses: Expense[]) => void) => {
  const expensesRef = ref(database, "expenses");
  return onValue(expensesRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    // Convert object to array and include key
    const expensesArr = Object.entries(data).map(([key, value]) => ({ ...(value as Expense), key }));
    callback(expensesArr.reverse()); // latest first
  });
};

export const updateExpense = (key: string, updatedExpense: Partial<Expense>) => {
  const expenseRef = ref(database, `expenses/${key}`);
  return update(expenseRef, updatedExpense);
};

export { app, auth, db }; 