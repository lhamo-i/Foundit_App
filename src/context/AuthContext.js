
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';

import { SEED_USERS } from '../data/seed';
import { CAMPUS_EMAIL_DOMAIN } from '../data/constants';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const getFriendlyError = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Your password must be at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Incorrect institutional email or password.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'permission-denied':
    case 'firestore/permission-denied':
      return 'Permission denied. Please check your Firebase Firestore rules.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(SEED_USERS);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Restore the Firebase login session when the app starts.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUserId(null);
        setCurrentProfile(null);
        setInitializing(false);
        return;
      }

      setUserId(firebaseUser.uid);

      try {
        const profileRef = doc(db, 'users', firebaseUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const profile = {
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            ...profileSnap.data(),
          };

          setCurrentProfile(profile);
          setUsers((prev) => [
            ...prev.filter((u) => u.id !== firebaseUser.uid),
            profile,
          ]);
        } else {
          setCurrentProfile(null);
        }
      } catch (error) {
        console.log('Unable to load user profile:', error);
        setCurrentProfile(null);
      } finally {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, []);

  const user =
    currentProfile ||
    users.find((u) => u.id === userId) ||
    null;

  const getUserById = (id) =>
    users.find((u) => u.id === id) || {
      id,
      name: 'Unknown user',
      studentId: '',
    };

  // LOGIN WITH INSTITUTIONAL EMAIL
  const login = async (email, password) => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      await signInWithEmailAndPassword(auth, cleanEmail, password);

      return { ok: true };
    } catch (error) {
      console.log('Login error:', error);
      return { ok: false, error: getFriendlyError(error) };
    }
  };

  // REGISTER A NEW USER AND SAVE THEIR PROFILE TO FIRESTORE
  const register = async ({ name, studentId, email, password }) => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanEmail.endsWith('@' + CAMPUS_EMAIL_DOMAIN)) {
        return {
          ok: false,
          error: `Use your campus email (@${CAMPUS_EMAIL_DOMAIN}).`,
        };
      }

      const credential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      const firebaseUser = credential.user;

      const newProfile = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        name: name.trim(),
        studentId: studentId.trim(),
        email: cleanEmail,
        phone: '',
        avatarUri: null,
        points: 0,
        returns: 0,
        createdAt: serverTimestamp(),
      };

      await setDoc(
        doc(db, 'users', firebaseUser.uid),
        newProfile
      );

      setCurrentProfile({
        ...newProfile,
        createdAt: new Date(),
      });

      setUsers((prev) => [
        ...prev.filter((u) => u.id !== firebaseUser.uid),
        { ...newProfile, createdAt: new Date() },
      ]);

      return { ok: true };
    } catch (error) {
      console.log('Registration error:', error);
      return { ok: false, error: getFriendlyError(error) };
    }
  };

  // LOG OUT
  const logout = async () => {
    try {
      await signOut(auth);
      return { ok: true };
    } catch (error) {
      console.log('Logout error:', error);
      return { ok: false, error: getFriendlyError(error) };
    }
  };

  // SEND PASSWORD RESET EMAIL
  const resetPassword = async (email) => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail.endsWith('@' + CAMPUS_EMAIL_DOMAIN)) {
      return {
        ok: false,
        error: `Use your campus email (@${CAMPUS_EMAIL_DOMAIN}).`,
      };
    }

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return { ok: true };
    } catch (error) {
      console.log('Password reset error:', error);

      // Avoid revealing whether an email has an account.
      if (error.code === 'auth/user-not-found') {
        return { ok: true };
      }

      return { ok: false, error: getFriendlyError(error) };
    }
  };

  // UPDATE PROFILE DETAILS IN FIRESTORE
  const updateProfile = async (changes) => {
    if (!auth.currentUser) {
      return { ok: false, error: 'Please log in again.' };
    }

    try {
      const profileRef = doc(db, 'users', auth.currentUser.uid);

      await setDoc(profileRef, changes, { merge: true });

      const updatedProfile = {
        ...currentProfile,
        ...changes,
        id: auth.currentUser.uid,
        uid: auth.currentUser.uid,
      };

      setCurrentProfile(updatedProfile);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === auth.currentUser.uid ? updatedProfile : u
        )
      );

      return { ok: true };
    } catch (error) {
      console.log('Profile update error:', error);
      return { ok: false, error: getFriendlyError(error) };
    }
  };

  // CHANGE PASSWORD
  const changePassword = async (oldPassword, newPassword) => {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser || !firebaseUser.email) {
      return { ok: false, error: 'Please log in again.' };
    }

    try {
      const credential = EmailAuthProvider.credential(
        firebaseUser.email,
        oldPassword
      );

      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, newPassword);

      return { ok: true };
    } catch (error) {
      console.log('Password change error:', error);

      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password'
      ) {
        return {
          ok: false,
          error: 'Your current password is incorrect.',
        };
      }

      return { ok: false, error: getFriendlyError(error) };
    }
  };

  // AWARD POINTS WHEN AN ITEM IS RETURNED
  const awardPoints = async (id, points) => {
    try {
      const profileRef = doc(db, 'users', id);

      await updateDoc(profileRef, {
        points: increment(points),
        returns: increment(1),
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                points: (u.points || 0) + points,
                returns: (u.returns || 0) + 1,
              }
            : u
        )
      );

      if (currentProfile?.id === id) {
        setCurrentProfile((prev) => ({
          ...prev,
          points: (prev.points || 0) + points,
          returns: (prev.returns || 0) + 1,
        }));
      }

      return { ok: true };
    } catch (error) {
      console.log('Award points error:', error);
      return { ok: false, error: getFriendlyError(error) };
    }
  };

  const value = {
    user,
    users,
    initializing,
    getUserById,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    changePassword,
    awardPoints,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
