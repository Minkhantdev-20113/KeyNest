import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { generateId } from '../utils/helpers';

function keysCollection(uid) {
  if (!uid) throw new Error('You must be signed in to access keys');
  return collection(db, 'users', uid, 'keys');
}

function normalizeKey(snapshot) {
  const data = snapshot.data();
  const normalizeTimestamp = (value) => value?.toDate?.().toISOString() || value;
  return {
    ...data,
    id: snapshot.id,
    createdAt: normalizeTimestamp(data.createdAt),
    updatedAt: normalizeTimestamp(data.updatedAt),
  };
}

export async function getAllKeys(uid) {
  const result = await getDocs(query(keysCollection(uid), orderBy('createdAt', 'desc')));
  return result.docs.map(normalizeKey);
}

export async function addKey(uid, keyData) {
  const id = generateId();
  const now = new Date().toISOString();
  const key = { ...keyData, id, createdAt: now, updatedAt: now };
  await setDoc(doc(keysCollection(uid), id), {
    ...key,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return key;
}

export async function updateKey(uid, id, updates) {
  const updated = { ...updates, id, updatedAt: new Date().toISOString() };
  await setDoc(doc(keysCollection(uid), id), { ...updates, updatedAt: serverTimestamp() }, { merge: true });
  return updated;
}

export async function deleteKey(uid, id) {
  await deleteDoc(doc(keysCollection(uid), id));
}
