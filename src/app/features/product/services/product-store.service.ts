import {inject, Injectable, signal} from '@angular/core';
import {Client} from '@feat/client/client.model';
import {ClientFirebaseService} from '@feat/client/services/client-firebase.service';
import {Observable, of, switchMap, tap} from 'rxjs';
import {StoreService} from '@app/shared/components/base-crud/basecrud.model';
import {Product} from '@feat/product/product.model';
import {ProductFirebaseService} from '@feat/product/services/product-firebase.service';


@Injectable({
  providedIn: 'root'
})
export class ProductStoreService implements StoreService<Product> {
  firebaseService = inject(ProductFirebaseService);
  list = signal<Product[]>([]);

  constructor() { }

  addList(items: Product[]): void {
    this.list.update(l => [...items]);
  }

  add(item: Product): void {
    this.list.update(l => [...l, item]);
  }

  remove(id: string): void {
    this.list.update(l => l.filter(item => item.id !== id))
  }

  update(client: Product): void {
    this.list.update(l => l.map(item => {
      if (item.id === client.id) {
        return client;
      } else {
        return item;
      }
    }))
  }

  addFirebase(rawValue: any): Observable<string> {
    return this.firebaseService.add(rawValue).pipe(
      tap(result => this.add({id: result, ...rawValue}))
    );
  }

  updateFirebase(rawValue: any): Observable<void> {
    return this.firebaseService.update(rawValue).pipe(
      tap(result => this.update(rawValue))
    );
  }

  deleteFirebase(rowData: any): Observable<void> {
    return this.firebaseService.delete(rowData.id).pipe(
      tap(r => {
        this.remove(rowData.id);
      })
    );
  }

  getFirebase(): Observable<Product[]> {
    return this.firebaseService.get().pipe(
      tap(l => this.addList(l))
    );
  }

  refresh(): Observable<Product[]> {
    return of([]).pipe(
      switchMap(() => this.firebaseService.get()),
      tap(l => this.list.set(l)),
    )
  }
}
