import Request from "./request";
import JiraDBCollection from "../database/jiraDBCollection";
import TasksDBCollection from "../database/tasksDBCollection";

export default class Jira {
  request: Request;
  jiraDBCollection: JiraDBCollection;
  tasksDBCollection: TasksDBCollection;

  constructor(request: Request, jiraDBCollection: JiraDBCollection, tasksDBCollection: TasksDBCollection) {
    this.request = request;
    this.jiraDBCollection = jiraDBCollection;
    this.tasksDBCollection = tasksDBCollection;
  }

  async workLog(taskType: string, taskNumber: string, started: number, seconds: number) {
    try {
      const task = await this.tasksDBCollection.byType(taskType);
      const spentSeconds = seconds < 60 ? 60 : seconds;
      const taskWorkLogNumber = taskNumber || task.number;

      const data = await this.request.instance.post(`/rest/api/2/issue/${task.project}-${taskWorkLogNumber}/worklog`, {
        ...(task.comment ? { comment: task.comment } : {}),
        started: new Date(started).toISOString().replace('Z', '+0000'),
        timeSpentSeconds: spentSeconds.toString(),
      });

      return data;
    } catch (e) {
      console.log(e);
    }
  }
}