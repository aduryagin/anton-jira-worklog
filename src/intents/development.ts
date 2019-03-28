import debounce from 'lodash/debounce';
import Task from '../core/task';

const DEVELOPMENT_NAME = 'разработка';
const TYPE = 'DEV';

class Development extends Task {
  name: string = DEVELOPMENT_NAME;
  type: string = TYPE;
  currentTaskNumber: string = '';

  debouncedSendWorkLog = debounce((agent: any) => {
    // tslint:disable-next-line: no-floating-promises
    this.end(agent);
  }, 1000 * 60 * 5);

  sendDevelopmentWorkLog(agent: any) {
    if (!this.inProgress) {
      this.currentTaskNumber = agent.parameters['task-number'];
      this.start();
    }

    if (this.inProgress && this.currentTaskNumber !== agent.parameters['task-number']) {
      this.currentTaskNumber = agent.parameters['task-number'];
      // tslint:disable-next-line: no-floating-promises
      this.end(agent);
      this.start();
    }

    this.debouncedSendWorkLog(agent);

    return agent.add('Ок');
  }

  initIntents() {
    this.intentMap.set('Development', (agent: any) => this.takeInProgress(agent));
    this.intentMap.set('Development cancel', (agent: any) => this.cancel(agent));
    this.intentMap.set('How long is the development', (agent: any) => this.howLong(agent));
    this.intentMap.set('Development ends', (agent: any) => this.end(agent));
    this.intentMap.set('Development in progress', (agent: any) => this.sendDevelopmentWorkLog(agent))
  }
}

export default Development;
