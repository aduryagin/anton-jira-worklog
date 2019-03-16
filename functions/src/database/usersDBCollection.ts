import * as admin from 'firebase-admin';
import axios from 'axios';
import DBCollection from './DBCollection';
import JiraDBCollection from './jiraDBCollection';

export type User = {
  login: string,
  password: string,
  session: string,
}

export default class UsersDBCollection extends DBCollection<User> {
  jiraDBCollection: JiraDBCollection;

  constructor(firestore: admin.firestore.Firestore, collectionName: string, jiraDBCollection: JiraDBCollection) {
    super(firestore, collectionName);
    this.jiraDBCollection = jiraDBCollection;
  }

  async login() {
    const user = this.data[0];
    const jira = this.jiraDBCollection.data[0];

    try {
      const { data } = await axios.post(`${jira.host}/rest/auth/1/session`, { username: user.login, password: user.password }, {
        headers: {
          'Content-Type': 'application/json',
          ...(
            jira.basic_login && jira.basic_password ?
              {
                Authorization: `Basic ${Buffer.from(`${jira.basic_login}:${jira.basic_password}`).toString('base64')}`
              } :
              {}
            )
        }
      });

      try {
        await this.updateSession(user.login, data.session.value);
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.error(`Login or password is incorrect.\n${e}`);
    }
  }

  async updateSession(login: string, session: string) {
    const users = await this.snapshot.where('login', '==', login).get();
    users.forEach(async (user: { id: string | undefined; }) => {
      try {
        await this.snapshot.doc(user.id).update({ login: session });
      } catch (e) {
        console.log(e);
      }

      const userToUpdate = this.data.find((userData) => userData.login === login);
      
      if (userToUpdate) {
        userToUpdate.session = session;
      }
    });
  }
}
