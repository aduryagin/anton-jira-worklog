import debounce from 'lodash/debounce';
import TaskTimer, { TaskTimerInterface } from "./taskTimer";
import { getNormalizedTime, declensionGenitive, declensionContinuePast } from "./utils";
import GlobalIntents from "../intents/globalIntents";
import JiraDBCollection from "../database/jiraDBCollection";
import Jira from "./jira";

export interface TaskInterface extends TaskTimerInterface {
  inProgress: boolean;
  intentMap: Map<string, any>;
  name: string;
  type: string;
  taskNumber: any;
  initIntents?: Function;
  formatName: (name: string, taskNumber: any) => string;
  takeInProgress: (agent: any) => any;
  cancel: (agent: any) => any;
  howLong: (agent: any) => any;
  end: (agent: any) => any;
}

export default class Task extends TaskTimer implements TaskInterface {
  [x: string]: any;
  inProgress: boolean = false;
  intentMap: Map<string, any>;
  jiraDBCollection: JiraDBCollection;
  name: string = '';
  type: string = '';
  jira: Jira;
  taskNumber: any = '';
  globalIntents: GlobalIntents;

  constructor(intentMap: Map<string, any>, globalIntents: GlobalIntents, jiraDBCollection: JiraDBCollection, jira: Jira) {
    super();

    this.intentMap = intentMap;
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

  debouncedSendWorkLog = debounce((agent: any) => {
    // tslint:disable-next-line: no-floating-promises
    this.end(agent);
  }, 1000 * 60 * 15);

  async sendInProgressWorkLog(agent: any) {
    if (!this.inProgress) {
      this.taskNumber = agent.parameters['task-number'];
      this.start();
    }

    if (this.inProgress && this.taskNumber !== agent.parameters['task-number']) {
      this.taskNumber = agent.parameters['task-number'];
      await this.end(agent);
      this.start();
    }

    this.debouncedSendWorkLog(agent);

    return agent.add('Ок');
  }

  takeInProgress(agent: any) {
    if (this.globalIntents.checkThatSomeIntentInProgress(this)) return agent.add(this.globalIntents.whatsInProgress());
    if (this.inProgress) return agent.add(`${this.formatName(this.name, this.taskNumber)} уже идет`);
    this.taskNumber = agent.parameters['task-number'];

    this.start();

    return agent.add(`Поставил таймер для ${declensionGenitive(this.name)}`);
  }

  cancel(agent: any) {
    if (!this.inProgress) return agent.add(`${this.formatName(this.name, this.taskNumber)} еще не идет`);
    this.stop();

    return agent.add(`Отменил ${this.formatName(this.name, this.taskNumber)}`);
  }

  howLong(agent: any) {
    if (!this.inProgress) return agent.add(`${this.formatName(this.name, this.taskNumber)} еще не идет`);

    const currentTime = getNormalizedTime(this.time());
    return agent.add(`${this.formatName(this.name, this.taskNumber)} длится ${currentTime}`);
  }

  async end(agent: any) {
    if (!this.inProgress) return agent.add(`${this.formatName(this.name, this.taskNumber)} еще не идет`);

    const taskNumber = this.taskNumber;
    const { time, started } = this.stop();

    if (taskNumber) {
      const currentTime = getNormalizedTime(time);
  
      await this.jira.workLog(this.type, taskNumber, started, time);
  
      return agent.add(`${this.formatName(this.name, taskNumber)} ${declensionContinuePast(this.name)} ${currentTime}`);
    }
  }
}
