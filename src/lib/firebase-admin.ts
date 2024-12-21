import admin from 'firebase-admin';

let isInitialized = false;
let _firestore: admin.firestore.Firestore | null = null;
let _auth: admin.auth.Auth | null = null;

console.log('Firebase Admin module loaded.');

try {
  console.log('Attempting to initialize Firebase Admin SDK.');
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  console.log('GOOGLE_APPLICATION_CREDENTIALS:', credentialsPath); // Debugging line
  if (!credentialsPath) {
    console.error(
      'Error initializing Firebase Admin SDK: GOOGLE_APPLICATION_CREDENTIALS environment variable not set.'
    );
    throw new Error(
      'GOOGLE_APPLICATION_CREDENTIALS environment variable not set'
    );
  }
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(credentialsPath),
    });
    isInitialized = true;
    _firestore = admin.firestore();
    _auth = admin.auth();
    console.log('Firebase Admin SDK initialized successfully.');
  } else {
    _firestore = admin.firestore();
    _auth = admin.auth();
    isInitialized = true;
    console.log('Firebase Admin SDK already initialized.');
  }
} catch (error) {
  isInitialized = false;
  console.error('Error initializing Firebase Admin SDK:', error);
}

export const firestore = () => {
  if (!isInitialized) return null;
  return _firestore;
};
export const auth = () => {
  if (!isInitialized) return null;
  return _auth;
};
export { admin };
