import axios from 'axios';
import UsersDBCollection from '../database/usersDBCollection';
import JiraDBCollection from '../database/jiraDBCollection';

class Request {
  instance: any;
  jira: JiraDBCollection;
  users: UsersDBCollection;

  constructor(jira: JiraDBCollection, users: UsersDBCollection) {
    this.jira = jira;
    this.users = users;

    this.instance = axios.create({
      baseURL: jira.data[0].host,
      headers: this.getHeaders(),
    });

    this.instance.interceptors.response.use((response: any) => response, async (error: { response: { status: number; }; config: { headers: any; }; }) => {
      if (error.response && error.response.status === 401) {
        await this.users.login();
        error.config.headers = this.getHeaders();
        return this.instance.request(error.config);
      }

      return Promise.reject(error);
    });
  }

  getHeaders() {
    const user = this.users.data[0];
    const jira = this.jira.data[0];

    return {
        'Content-Type': 'application/json',
        ...(user.session ? { 'Cookie': `JSESSIONID=${user.session}`} : {}),
        ...(
          jira.basic_login && jira.basic_password ?
            {
              Authorization: `Basic ${Buffer.from(`${jira.basic_login}:${jira.basic_password}`).toString('base64')}`
            } :
            {}
          )
    }
  };
}

export default Request;
