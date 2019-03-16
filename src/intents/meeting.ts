import Task from '../core/task';
import { DialogflowConversation } from 'actions-on-google';

const MEETING_NAME = 'встреча';
const TYPE = 'MEETING';

class Meeting extends Task {
  name: string = MEETING_NAME;
  type: string = TYPE;

  initIntents() {
    this.app.intent('Meeting', (conv: DialogflowConversation, params: { 'task-number': any }) => this.takeInProgress(conv, params));
    this.app.intent('Meeting cancel', (conv: DialogflowConversation) => this.cancel(conv));
    this.app.intent('How long is the meeting', (conv: DialogflowConversation) => this.howLong(conv));
    this.app.intent('Meeting ends', (conv: DialogflowConversation) => this.end(conv));
  }
}

export default Meeting;
