export interface TaskTimerInterface {
  start: () => any;
  time: () => number;
  stop: () => { time: number, started: number };
}

class TaskTimer implements TaskTimerInterface {
  interval: any;
  seconds: number = 0;

  start() {
    const started: number = new Date().getTime();

    this.interval = setInterval(() => {
      this.seconds = Math.floor((new Date().getTime() - started) / 1000);
    }, 1000);
  
    return this.interval;
  }

  time() {
    return this.seconds;
  }

  stop() {
    clearInterval(this.interval);
    const time = this.time();
    this.seconds = 0;

    return { time, started: new Date().getTime() - time * 1000 };
  }
}

export default TaskTimer;
