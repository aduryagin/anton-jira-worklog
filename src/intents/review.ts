import Task from '../core/task';

const REVIEW_NAME = 'ревью';
const TYPE = 'REVIEW';

class Review extends Task {
  name: string = REVIEW_NAME;
  type: string = TYPE;

  initIntents() {
    this.intentMap.set('Review', (agent: any) => this.takeInProgress(agent));
    this.intentMap.set('Review cancel', (agent: any) => this.cancel(agent));
    this.intentMap.set('How long is the review', (agent: any) => this.howLong(agent));
    this.intentMap.set('Review ends', (agent: any) => this.end(agent));
  }
}

export default Review;
