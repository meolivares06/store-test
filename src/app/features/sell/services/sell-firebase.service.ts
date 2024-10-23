import {inject, Injectable} from '@angular/core';
import {addDoc, collection, collectionData, deleteDoc, doc, Firestore, setDoc} from '@angular/fire/firestore';
import {catchError, from, map, Observable, of} from 'rxjs';
import {FirebaseService} from '@app/shared/components/base-crud/basecrud.model';
import {Sell} from '@feat/sell/sell.model';
import {sellAdapter} from '@app/core/adapters/sell.adapter';

@Injectable({
  providedIn: 'root'
})
export class SellFirebaseService implements FirebaseService<Sell> {
  firestore = inject(Firestore);
  basePath = 'sell';
  clientCollection = collection(this.firestore, this.basePath);

  constructor() {
  }

  get(): Observable<Sell[]> {
    return collectionData(this.clientCollection, {idField: 'id'}).pipe(
      map(document => {
        return sellAdapter((document as (unknown & { creationDate: any })[]));
      }),
      catchError(() => of([]))
    );
  }

  add(data: Sell): Observable<string> {
    const promise = addDoc(this.clientCollection, data).then((p) => p.id);
    return from(promise);
  }

  delete(id: string): Observable<void> {
    const docRef = doc(this.firestore, `${this.basePath}/${id}`);
    const promise = deleteDoc(docRef);
    return from(promise);
  }

  update(item: Sell): Observable<void> {
    const ref = doc(this.firestore, `${this.basePath}/${item.id}`);
    const promise = setDoc(ref, item);
    return from(promise);
  }
}
