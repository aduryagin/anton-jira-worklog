import { dialogflow } from 'actions-on-google';
import * as admin from 'firebase-admin';
import express from 'express';
import bodyParser from 'body-parser';
import Request from './core/request';
import Jira from './core/jira';
import { initAllIntents } from './intents';
import { initDBCollections } from './database';
import firebaseAccount from '../firebase-keys.json';

const app = dialogflow();

const expressApp = express().use(bodyParser.json());
expressApp.post('/', app);

const main = async () => {
  // Init firestore
  const serviceAccount = firebaseAccount as admin.ServiceAccount;
  const adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://anton-jira-worklog.firebaseio.com"
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
    expressApp.listen(3000, () => {
      console.log('App was successfully init. Port: 3000');
    });
  })
  .catch(e => console.error(e));
