import Task from '../core/task';

const DEVELOPMENT_NAME = 'разработка';
const TYPE = 'DEV';

class Development extends Task {
  name: string = DEVELOPMENT_NAME;
  type: string = TYPE;

  initIntents() {
    this.intentMap.set('Development', (agent: any) => this.takeInProgress(agent));
    this.intentMap.set('Development cancel', (agent: any) => this.cancel(agent));
    this.intentMap.set('How long is the development', (agent: any) => this.howLong(agent));
    this.intentMap.set('Development ends', (agent: any) => this.end(agent));
    this.intentMap.set('Development in progress', (agent: any) => this.sendInProgressWorkLog(agent));
  }
}

export default Development;
