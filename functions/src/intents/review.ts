import Task from '../core/task';
import { DialogflowConversation } from 'actions-on-google';

const REVIEW_NAME = 'ревью';
const TYPE = 'REVIEW';

class Review extends Task {
  name: string = REVIEW_NAME;
  type: string = TYPE;

  initIntents() {
    this.app.intent('Review', (conv: DialogflowConversation, params: { 'task-number': any }) => this.takeInProgress(conv, params));
    this.app.intent('Review cancel', (conv: DialogflowConversation) => this.cancel(conv));
    this.app.intent('How long is the review', (conv: DialogflowConversation) => this.howLong(conv));
    this.app.intent('Review ends', (conv: DialogflowConversation) => this.end(conv));
  }
}

export default Review;
