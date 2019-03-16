import Task from '../core/task';
import { DialogflowConversation } from 'actions-on-google';

const STANDUP_NAME = 'стендап';
const TYPE = 'STANDUP';

class StandUp extends Task {
  name: string = STANDUP_NAME;
  type: string = TYPE;

  initIntents() {
    this.app.intent('Stand-up', (conv: DialogflowConversation, params: { 'task-number': any }) => this.takeInProgress(conv, params) );
    this.app.intent('Stand-up cancel', (conv: DialogflowConversation) => this.cancel(conv));
    this.app.intent('How long is the stand-up', (conv: DialogflowConversation) => this.howLong(conv));
    this.app.intent('Stand-up ends', (conv: DialogflowConversation) => this.end(conv));
  }
}

export default StandUp;
