import debounce from 'lodash/debounce';
import Task from '../core/task';

const DEVELOPMENT_NAME = 'разработка';
const TYPE = 'DEV';

class Development extends Task {
  name: string = DEVELOPMENT_NAME;
  type: string = TYPE;

  debouncedSendWorkLog = debounce((agent: any) => {
    this.end(agent);
  }, 1000 * 60 * 5);

  sendDevelopmentWorkLog(agent: any) {
    if (!this.inProgress) this.start();

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
