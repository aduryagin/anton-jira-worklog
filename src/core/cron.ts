import { CronJob } from 'cron';
import Request from "./request";
import UsersDBCollection from '../database/usersDBCollection';
import TasksDBCollection from '../database/tasksDBCollection';

class Cron {
  request: Request;
  users: UsersDBCollection;
  tasks: TasksDBCollection;

  constructor(request: Request, users: UsersDBCollection, tasks: TasksDBCollection) {
    this.request = request;
    this.users = users;
    this.tasks = tasks;

    this.start();
  }

  start() {
    new CronJob('0 0 18 * * 1-5', async () => {
      await this.addSomeWorkLogInEndOfDay();
      // tslint:disable-next-line: no-empty
    }, () => {}, true, 'Europe/Moscow');

    new CronJob('0 0 12 * * 1-5', async () => {
      await this.addSomeStandUp();
      // tslint:disable-next-line: no-empty
    }, () => {}, true, 'Europe/Moscow');
  }

  // auto standup

  async addSomeStandUp() {
    const task = await this.tasks.byType('STANDUP');
    const standupDate = new Date();
    standupDate.setHours(12);
    standupDate.setMinutes(0);
    standupDate.setSeconds(0);
    standupDate.setMilliseconds(0);

    const data = await this.request.instance.post(`/rest/api/2/issue/${task.project}-${task.number}/worklog`, {
      ...(task.comment ? { comment: task.comment } : {}),
      started: new Date(standupDate.getTime()).toISOString().replace('Z', '+0000'),
      timeSpentSeconds: Number(60 * 60).toString(),
    });

    return data;
  }

  // auto add some work log in end of day

  async getTodayWorkLogIds(nextPage?: string): Promise<Array<number>> {
    const morningDate = new Date();
    morningDate.setHours(6);
    morningDate.setMinutes(0);
    morningDate.setSeconds(0);
    morningDate.setMilliseconds(0);
    morningDate.setTime(morningDate.getTime() - 180 * 60 * 1000); // Moscow time

    const since = morningDate.getTime();
    const { data } = await this.request.instance.get(nextPage || `/rest/api/2/worklog/updated?since=${since}`);
    const ids = data.values.reduce((accumulator: { concat: (arg0: any) => Array<number>; }, value: any) => {
      return accumulator.concat(value.worklogId);
    }, []);

    if (!data.lastPage) {
      const moreIds = await this.getTodayWorkLogIds(data.nextPage);
      ids.concat(moreIds);
    }

    return ids;
  }

  async getTodayWorklogSeconds(): Promise<number> {
    const ids = await this.getTodayWorkLogIds();
    const { data } = await this.request.instance.post('/rest/api/2/worklog/list', {
      ids
    });

    const seconds = data.reduce((accumulator: number, worklog: { started: string, author: { name: string; }; timeSpentSeconds: number; }) => {
      const today = new Date();
      const worklogDay = new Date(worklog.started);
      const currentMonth = today.getMonth();
      const currentDate = today.getDate();
      const worklogMonth = worklogDay.getMonth();
      const worklogDate = worklogDay.getDate();

      if (worklog.author.name === this.users.data[0].login && currentMonth === worklogMonth && currentDate === worklogDate) {
        return accumulator + worklog.timeSpentSeconds; 
      }

      return accumulator;
    }, 0);

    return seconds;
  }

  async addSomeWorkLogInEndOfDay() {
    const seconds = await this.getTodayWorklogSeconds();
    const restSeconds = 8 * 60 * 60 - seconds;
    const task = await this.tasks.byType('REST');
    const eveningDate = new Date();
    eveningDate.setHours(18);
    eveningDate.setMinutes(0);
    eveningDate.setSeconds(0);
    eveningDate.setMilliseconds(0);

    if (restSeconds > 0) {
      const data = await this.request.instance.post(`/rest/api/2/issue/${task.project}-${task.number}/worklog`, {
        ...(task.comment ? { comment: task.comment } : {}),
        started: new Date(eveningDate.getTime()).toISOString().replace('Z', '+0000'),
        timeSpentSeconds: restSeconds < 60 ? '60' : restSeconds.toString(),
      });
  
      return data;
    }
  }
}

export default Cron;
