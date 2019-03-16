import { dialogflow } from 'actions-on-google';
import { https } from 'firebase-functions'; 
import * as admin from 'firebase-admin';
import Request from './core/request';
import Jira from './core/jira';
import { initAllIntents } from './intents';
import { initDBCollections } from './database';
import firebaseAccount from '../firebase-keys.json';

const serviceAccount = firebaseAccount as admin.ServiceAccount;
process.env.DEBUG = 'dialogflow:debug';
const app = dialogflow();

const main = async () => {
  // Init firestore
  const adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  const firestore = admin.firestore(adminApp);

  // Get all db data
  const { jiraDBCollection, usersDBCollection, tasksDBCollection } = await initDBCollections(firestore);

  // Request
  const request = new Request(jiraDBCollection, usersDBCollection);

  // Jira API
  const jira = new Jira(request, jiraDBCollection, tasksDBCollection);

  // Intents
  initAllIntents(app, jiraDBCollection, jira);
};

main()
  .then(() => {
    console.log('App was successfully init');
  })
  .catch(e => console.error(e));

https.onRequest(app);
