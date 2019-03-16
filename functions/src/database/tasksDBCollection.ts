import DBCollection from './DBCollection';

export type Task = {
  comment: string,
  number: string,
  project: string,
  type: string,
}

export default class TasksDBCollection extends DBCollection<Task> {
  async byType(type: string): Promise<Task> {
    const data: Array<Task> = [];
    const querySnapshot = await this.snapshot.where('type', '==', type).limit(1).get();
    querySnapshot.forEach(documentSnapshot => {
      data.push(documentSnapshot.data() as Task);
    });

    return data[0];
  }
}
