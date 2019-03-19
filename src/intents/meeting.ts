import Task from '../core/task';

const MEETING_NAME = 'встреча';
const TYPE = 'MEETING';

class Meeting extends Task {
  name: string = MEETING_NAME;
  type: string = TYPE;

  initIntents() {
    this.intentMap.set('Meeting', (agent: any) => this.takeInProgress(agent));
    this.intentMap.set('Meeting cancel', (agent: any) => this.cancel(agent));
    this.intentMap.set('How long is the meeting', (agent: any) => this.howLong(agent));
    this.intentMap.set('Meeting ends', (agent: any) => this.end(agent));
  }
}

export default Meeting;
