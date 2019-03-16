import * as admin from 'firebase-admin';

export default class DBCollection<Data> {
  firestore: admin.firestore.Firestore;
  snapshot: FirebaseFirestore.CollectionReference;
  data: Array<Data> = [];

  constructor(firestore: admin.firestore.Firestore, collectionName: string) {
    this.firestore = firestore;
    this.snapshot = this.firestore.collection(collectionName);
    this.subscribe().then(() => { console.log(`${collectionName}: successfully subscribed`) }).catch((e) => console.error(e));
  }

  updateData(querySnapshot: FirebaseFirestore.QuerySnapshot) {
    const data: Array<Data> = [];

    querySnapshot.forEach(documentSnapshot => {
      data.push(documentSnapshot.data() as Data);
    });

    this.data = data;
  }

  async get(): Promise<Array<Data>> {
    const querySnapshot = await this.snapshot.get();
    this.updateData(querySnapshot);

    return this.data;
  }

  async subscribe(): Promise<Array<Data>> {
    this.snapshot.onSnapshot((querySnapshot: FirebaseFirestore.QuerySnapshot) => this.updateData(querySnapshot));

    return this.data;
  }
}
