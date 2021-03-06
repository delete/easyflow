import firebase from 'firebase/app';
import 'firebase/firestore';
import { initFirestorter } from 'firestorter';

import { Activity } from 'modules/Activity/domain/activity';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);

  // @ts-ignore
  initFirestorter({ firebase });
}
class FirebaseService {
  app: firebase.app.App;
  db: firebase.firestore.Firestore;

  constructor() {
    /* Firebase APIs */
    this.db = firebase.firestore();
  }

  getUsers = () => this.db.collection('users');

  getBoards = () => this.db.collection('boards');

  getBoardInvites = () => this.db.collection('board_invites');

  getUser = (email: string) => this.getUsers().doc(email);

  getBoard = (id: string) => this.getBoards().doc(id);

  getBoardInvite = (id: string) => this.getBoardInvites().doc(id);

  createActivity = (activity: Activity) => {
    return this.db.collection('actions').add(activity);
  };
}

export default new FirebaseService();
