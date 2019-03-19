import GlobalIntents from "./globalIntents";
import Jira from "../core/jira";
import JiraDBCollection from "../database/jiraDBCollection";
import StandUp from './standUp';
import Review from './review';
import Development from './development';
import Meeting from './meeting';

export const initAllIntents = (jiraDBCollection: JiraDBCollection, jira: Jira): Map<string, any> => {
  const intentMap = new Map();

  // Global intents
  const globalIntents = new GlobalIntents(intentMap);
  globalIntents.initIntents();

  // Task intents  
  const standUp = new StandUp(intentMap, globalIntents, jiraDBCollection, jira);
  globalIntents.push(standUp);

  const review = new Review(intentMap, globalIntents, jiraDBCollection, jira);
  globalIntents.push(review);

  const development = new Development(intentMap, globalIntents, jiraDBCollection, jira);
  globalIntents.push(development);

  const meeting = new Meeting(intentMap, globalIntents, jiraDBCollection, jira);
  globalIntents.push(meeting);

  return intentMap;
};
