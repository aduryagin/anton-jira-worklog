import { DialogflowApp, DialogflowConversation } from "actions-on-google";
import Task from "../core/task";
import { getNormalizedTime } from "../core/utils";

export default class GlobalIntents {
  app: DialogflowApp<any, any, any, any>; 
  intents: Array<Task> = [];

  constructor(app: DialogflowApp<any, any, any, any>) {
    this.app = app;
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
    this.app.intent(`What's in progress`, (conv: DialogflowConversation): any => {
      const somethingInProgress = this.whatsInProgress();

      if (somethingInProgress) {
        return conv.close(somethingInProgress);
      }

      return conv.close('Вы ничего не делаете');
    });
  }
}