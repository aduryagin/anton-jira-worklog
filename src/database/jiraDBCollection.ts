import DBCollection from './DBCollection';

export type Config = {
  basic_login: string,
  basic_password: string,
  host: string,
}

export default class JiraDBCollection extends DBCollection<Config>{
}
