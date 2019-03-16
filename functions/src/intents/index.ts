import { DialogflowApp } from "actions-on-google";
import GlobalIntents from "./globalIntents";
import Jira from "../core/jira";
import JiraDBCollection from "../database/jiraDBCollection";
import StandUp from './standUp';
import Review from './review';
import Development from './development';
import Meeting from './meeting';

export const initAllIntents = (app: DialogflowApp<any, any, any, any>, jiraDBCollection: JiraDBCollection, jira: Jira) => {
  // Global intents
  const globalIntents = new GlobalIntents(app);
  globalIntents.initIntents();

  // Task intents  
  const standUp = new StandUp(app, globalIntents, jiraDBCollection, jira);
  globalIntents.push(standUp);

  const review = new Review(app, globalIntents, jiraDBCollection, jira);
  globalIntents.push(review);

  const development = new Development(app, globalIntents, jiraDBCollection, jira);
  globalIntents.push(development);

  const meeting = new Meeting(app, globalIntents, jiraDBCollection, jira);
  globalIntents.push(meeting);
};
