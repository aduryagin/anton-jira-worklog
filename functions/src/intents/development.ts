import Task from '../core/task';
import { DialogflowConversation } from 'actions-on-google';

const DEVELOPMENT_NAME = 'разработка';
const TYPE = 'DEV';

class Development extends Task {
  name: string = DEVELOPMENT_NAME;
  type: string = TYPE;

  initIntents() {
    this.app.intent('Development', (conv: DialogflowConversation, params: { 'task-number': any }) => this.takeInProgress(conv, params));
    this.app.intent('Development cancel', (conv: DialogflowConversation) => this.cancel(conv));
    this.app.intent('How long is the development', (conv: DialogflowConversation) => this.howLong(conv));
    this.app.intent('Development ends', (conv: DialogflowConversation) => this.end(conv));
  }
}

export default Development;
