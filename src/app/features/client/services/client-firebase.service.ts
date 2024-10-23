import {inject, Injectable} from '@angular/core';
import {addDoc, collection, collectionData, deleteDoc, doc, Firestore, setDoc} from '@angular/fire/firestore';
import {Client} from '@feat/client/client.model';
import {catchError, from, map, Observable, of} from 'rxjs';
import {clientAdapter} from '@app/core/adapters';

@Injectable({
  providedIn: 'root'
})
export class ClientFirebaseService {
  firestore = inject(Firestore);
  basePath = 'client';
  clientCollection = collection(this.firestore, this.basePath);

  constructor() {
  }

  get(): Observable<Client[]> {
    return collectionData(this.clientCollection, { idField: 'id'}).pipe(
      map(document => {
        return clientAdapter(document as (unknown & {birthday: any})[]);
      }),
      catchError(() => of([]))
    );
  }

  add(data: Client): Observable<string> {
    const promise = addDoc(this.clientCollection, data).then((p) => p.id);
    return from(promise);
  }

  delete(id: string): Observable<void> {
    const docRef = doc(this.firestore, `${this.basePath}/${id}`);
    const promise = deleteDoc(docRef);
    return from(promise);
  }

  update(item: Client): Observable<void> {
    const ref = doc(this.firestore, `${this.basePath}/${item.id}`);
    const promise = setDoc(ref, item);
    return from(promise);
  }

  // getByID(id: string) {
  //   const ref = doc(this.firestore, `${this.basePath}/${id}`);
  //   return docData(ref, { idField: 'id' }) as Observable<CultoInformation>;
  // }
}
