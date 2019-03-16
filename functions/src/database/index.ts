import * as admin from 'firebase-admin';
import UsersDBCollection from "./usersDBCollection";
import JiraDBCollection from "./jiraDBCollection";
import TasksDBCollection from "./tasksDBCollection";

export const initDBCollections = async (firestore: admin.firestore.Firestore) => {
  const jiraDBCollection = new JiraDBCollection(firestore, 'jira');
  await jiraDBCollection.get();
  
  const usersDBCollection = new UsersDBCollection(firestore, 'users', jiraDBCollection);
  await usersDBCollection.get();

  const tasksDBCollection = new TasksDBCollection(firestore, 'tasks');
  await tasksDBCollection.get();

  return { usersDBCollection, jiraDBCollection, tasksDBCollection };
}