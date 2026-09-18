import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

function profileRef(uid) {
  return doc(db, 'users', uid, 'profile', 'settings');
}

export async function registerAccount(email, password, username) {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(credential.user, { displayName: username.trim() });
  await setDoc(profileRef(credential.user.uid), {
    username: username.trim(),
    avatar: { text: username.trim().slice(0, 2).toUpperCase(), color: '#2563eb' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return credential.user;
}

export async function loginAccount(email, password) {
  return (await signInWithEmailAndPassword(auth, email.trim(), password)).user;
}

export async function changeAccountPassword(newPassword) {
  if (!auth.currentUser) throw new Error('You must be signed in');
  await updatePassword(auth.currentUser, newPassword);
}

export async function updateAccountProfile(uid, profile) {
  await setDoc(profileRef(uid), { ...profile, updatedAt: new Date().toISOString() }, { merge: true });
  if (auth.currentUser && profile.username) {
    await updateProfile(auth.currentUser, { displayName: profile.username });
  }
}

export async function getAccountProfile(uid) {
  const snapshot = await getDoc(profileRef(uid));
  return snapshot.exists() ? snapshot.data() : null;
}

export function logoutAccount() {
  return signOut(auth);
}
