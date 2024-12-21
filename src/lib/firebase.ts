import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyD92fXaAxrFRtgqESluBJb2zd7878hA3Go',
  authDomain: 'alias-ukr.firebaseapp.com',
  databaseURL: 'https://alias-ukr-default-rtdb.firebaseio.com',
  projectId: 'alias-ukr',
  storageBucket: 'alias-ukr.firebasestorage.app',
  messagingSenderId: '925249910837',
  appId: '1:925249910837:web:9ea2504d59bdb6298ad97c',
  measurementId: 'G-WQ7BKHNWTR',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database, app, analytics };
