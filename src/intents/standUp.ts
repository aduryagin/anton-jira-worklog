import Task from '../core/task';

const STANDUP_NAME = 'стендап';
const TYPE = 'STANDUP';

class StandUp extends Task {
  name: string = STANDUP_NAME;
  type: string = TYPE;

  initIntents() {
    this.intentMap.set('Stand-up', (agent: any) => this.takeInProgress(agent) );
    this.intentMap.set('Stand-up cancel', (agent: any) => this.cancel(agent));
    this.intentMap.set('How long is the stand-up', (agent: any) => this.howLong(agent));
    this.intentMap.set('Stand-up ends', (agent: any) => this.end(agent));
  }
}

export default StandUp;
