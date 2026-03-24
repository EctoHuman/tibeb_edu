// Mock Firebase implementation
import { User } from './types';

// Mock Auth
export const auth = {
  currentUser: null as User | null,
};

export const signInWithGoogle = async () => {
  const mockUser: User = {
    uid: 'mock-user-123',
    email: 'abebe@example.com',
    displayName: 'Abebe Bikila',
    photoURL: 'https://picsum.photos/seed/abebe/200',
  };
  auth.currentUser = mockUser;
  // Trigger a custom event or just return the user
  window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: mockUser }));
  return mockUser;
};

export const logOut = async () => {
  auth.currentUser = null;
  window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: null }));
};

export const onAuthStateChanged = (authInstance: any, callback: (user: User | null) => void) => {
  const handler = (event: any) => callback(event.detail);
  window.addEventListener('auth-state-changed', handler);
  // Initial call
  setTimeout(() => callback(auth.currentUser), 0);
  return () => window.removeEventListener('auth-state-changed', handler);
};

// Mock Firestore
export const db = {};

export const doc = (dbOrCol: any, ...rest: any[]) => {
  if (dbOrCol.path && rest.length === 0) {
    const id = Math.random().toString(36).substring(7);
    return { id, collection: dbOrCol.name, path: `${dbOrCol.path}/${id}` };
  }
  if (dbOrCol.path && rest.length === 1) {
    const id = rest[0];
    return { id, collection: dbOrCol.name, path: `${dbOrCol.path}/${id}` };
  }
  const id = rest[rest.length - 1];
  const path = [rest[0], ...rest.slice(1)].join('/');
  return { id, collection: rest[0], path };
};
export const collection = (db: any, name: string, ...rest: string[]) => ({ name, path: [name, ...rest].join('/') });
export const query = (collection: any, ...args: any[]) => ({ collection, args, name: collection.name });
export const where = (field: string, op: string, value: any) => ({ field, op, value });
export const orderBy = (field: string, dir?: string) => ({ field, dir });
export const limit = (n: number) => ({ n });
export const getDoc = async (docRef: any) => {
  const data = localStorage.getItem(`mock-db-${docRef.path}`);
  return {
    exists: () => !!data,
    data: () => data ? JSON.parse(data) : null,
  };
};
export const setDoc = async (docRef: any, data: any) => {
  localStorage.setItem(`mock-db-${docRef.path}`, JSON.stringify(data));
};
export const addDoc = async (colRef: any, data: any) => {
  const id = Math.random().toString(36).substring(7);
  const path = `${colRef.path || colRef.name}/${id}`;
  localStorage.setItem(`mock-db-${path}`, JSON.stringify({ ...data, id }));
  return { id };
};
export const updateDoc = async (docRef: any, data: any) => {
  const existing = localStorage.getItem(`mock-db-${docRef.path}`);
  if (existing) {
    const updated = { ...JSON.parse(existing), ...data };
    localStorage.setItem(`mock-db-${docRef.path}`, JSON.stringify(updated));
  }
};
export const getDocs = async (query: any) => {
  const results: any[] = [];
  const colPath = query.collection?.path || query.path || query.name;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(`mock-db-${colPath}/`)) {
      results.push({
        id: key.split('/').pop(),
        data: () => JSON.parse(localStorage.getItem(key)!),
      });
    }
  }
  return { 
    docs: results,
    forEach: (callback: (doc: any) => void) => results.forEach(callback)
  };
};
export const onSnapshot = (ref: any, callback: (snapshot: any) => void, errorCallback?: (err: any) => void) => {
  const handler = () => {
    if (ref.id) {
      getDoc(ref).then(callback);
    } else {
      getDocs(ref).then(callback);
    }
  };
  window.addEventListener('storage', handler);
  handler();
  return () => window.removeEventListener('storage', handler);
};

export const serverTimestamp = () => new Date().toISOString();
export const arrayUnion = (item: any) => item; // Simplified
export const arrayRemove = (item: any) => item; // Simplified
export const writeBatch = (db: any) => ({
  set: (ref: any, data: any) => setDoc(ref, data),
  commit: async () => {},
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export const increment = (n: number) => n; // Simplified for mock

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.error('Mock Firestore Error: ', error, operationType, path);
}
