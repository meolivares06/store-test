import {inject, Injectable} from '@angular/core';
import {addDoc, collection, collectionData, deleteDoc, doc, Firestore, setDoc} from '@angular/fire/firestore';
import {catchError, from, map, Observable, of} from 'rxjs';
import {FirebaseService} from '@app/shared/components/base-crud/basecrud.model';
import {Product} from '@feat/product/product.model';
import {productAdapter} from '@app/core/adapters';

@Injectable({
  providedIn: 'root'
})
export class ProductFirebaseService implements FirebaseService<Product> {
  firestore = inject(Firestore);
  basePath = 'product';
  clientCollection = collection(this.firestore, this.basePath);

  constructor() {
  }

  get(): Observable<Product[]> {
    return collectionData(this.clientCollection, {idField: 'id'}).pipe(
      map(document => {
        return productAdapter((document as unknown[]));
      }),
      catchError(() => of([]))
    );
  }

  add(data: Product): Observable<string> {
    const promise = addDoc(this.clientCollection, data).then((p) => p.id);
    return from(promise);
  }

  delete(id: string): Observable<void> {
    const docRef = doc(this.firestore, `${this.basePath}/${id}`);
    const promise = deleteDoc(docRef);
    return from(promise);
  }

  update(item: Product): Observable<void> {
    const ref = doc(this.firestore, `${this.basePath}/${item.id}`);
    const promise = setDoc(ref, item);
    return from(promise);
  }
}