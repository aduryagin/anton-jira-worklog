import TaskTimer, { TaskTimerInterface } from "./taskTimer";
import { DialogflowApp, DialogflowConversation } from "actions-on-google";
import { getNormalizedTime, declensionGenitive, declensionContinuePast } from "./utils";
import GlobalIntents from "../intents/globalIntents";
import JiraDBCollection from "../database/jiraDBCollection";
import Jira from "./jira";

export interface TaskInterface extends TaskTimerInterface {
  inProgress: boolean;
  app: DialogflowApp<any, any, any, any>;
  name: string;
  type: string;
  taskNumber: any;
  initIntents?: Function;
  formatName: (name: string, taskNumber: any) => string;
  takeInProgress: (conv: DialogflowConversation, params: { 'task-number': any }) => any;
  cancel: (conv: DialogflowConversation) => any;
  howLong: (conv: DialogflowConversation) => any;
  end: (conv: DialogflowConversation) => any;
}

export default class Task extends TaskTimer implements TaskInterface {
  [x: string]: any;
  inProgress: boolean = false;
  app: DialogflowApp<any, any, any, any>;
  jiraDBCollection: JiraDBCollection;
  name: string = '';
  type: string = '';
  jira: Jira;
  taskNumber: any = '';
  globalIntents: GlobalIntents;

  constructor(app: DialogflowApp<any, any, any, any>, globalIntents: GlobalIntents, jiraDBCollection: JiraDBCollection, jira: Jira) {
    super();

    this.app = app;
    globalIntents.push(this);
    this.globalIntents = globalIntents;
    this.jiraDBCollection = jiraDBCollection;
    this.jira = jira;

    if (this.initIntents) {
      this.initIntents();
    }
  }

  // in progress

  start(): any {
    this.inProgress = true;
    return super.start();
  }

  stop(): { time: number, started: number } {
    this.inProgress = false;
    this.taskNumber = '';
    return super.stop();
  }

  // utils

  formatName(name: string, taskNumber: any): string {
    return `${name}${taskNumber ? ` ${taskNumber}` : ''}`;
  }

  // chat actions

  takeInProgress(conv: DialogflowConversation, params: { 'task-number': any }) {
    if (this.globalIntents.checkThatSomeIntentInProgress(this)) return conv.close(this.globalIntents.whatsInProgress());
    if (this.inProgress) return conv.close(`${this.formatName(this.name, this.taskNumber)} уже идет`);
    this.taskNumber = params['task-number'];

    this.start();

    return conv.close(`Поставил таймер для ${declensionGenitive(this.name)}`);
  }

  cancel(conv: DialogflowConversation) {
    if (!this.inProgress) return conv.close(`${this.formatName(this.name, this.taskNumber)} еще не идет`);
    this.stop();

    return conv.close(`Отменил ${this.formatName(this.name, this.taskNumber)}`);
  }

  howLong(conv: DialogflowConversation) {
    if (!this.inProgress) return conv.close(`${this.formatName(this.name, this.taskNumber)} еще не идет`);

    const currentTime = getNormalizedTime(this.time());
    return conv.close(`${this.formatName(this.name, this.taskNumber)} длится ${currentTime}`);
  }

  async end(conv: DialogflowConversation) {
    if (!this.inProgress) return conv.close(`${this.formatName(this.name, this.taskNumber)} еще не идет`);

    const taskNumber = this.taskNumber;
    const { time, started } = this.stop();
    const currentTime = getNormalizedTime(time);

    await this.jira.workLog(this.type, taskNumber, started, time);

    return conv.close(`${this.formatName(this.name, taskNumber)} ${declensionContinuePast(this.name)} ${currentTime}`);
  }
}
