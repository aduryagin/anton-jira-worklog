import Task from "../core/task";
import { getNormalizedTime } from "../core/utils";

export default class GlobalIntents {
  intentMap: Map<string, any>; 
  intents: Array<Task> = [];

  constructor(intentMap: Map<string, any>) {
    this.intentMap = intentMap;
  }

  checkThatSomeIntentInProgress(excludeIntent?: Task) {
    const intentInProgress = this.intents.find(intent => {
      if (excludeIntent && excludeIntent.name === intent.name) {
        return false;
      }

      return intent.inProgress;
    });
    
    return intentInProgress;
  }

  whatsInProgress(): string {
    const intentInProgress = this.intents.find(intent => intent.inProgress);

    if (intentInProgress) {
      return `${intentInProgress.formatName(intentInProgress.name, intentInProgress.taskNumber)} идет уже ${getNormalizedTime(intentInProgress.time())}`;
    }

    return '';
  }

  push(intent: Task): Array<Task> {
    this.intents.push(intent);
    return this.intents;
  }

  initIntents() {
    this.intentMap.set(`What's in progress`, (agent: any): any => {
      const somethingInProgress = this.whatsInProgress();

      if (somethingInProgress) {
        return agent.add(somethingInProgress);
      }

      return agent.add('Вы ничего не делаете');
    });
  }
}