import {inject, Injectable, signal} from '@angular/core';
import {Observable, of, switchMap, tap} from 'rxjs';
import {StoreService} from '@app/shared/components/base-crud/basecrud.model';
import {Sell} from '@feat/sell/sell.model';
import {SellFirebaseService} from '@feat/sell/services/sell-firebase.service';


@Injectable({
  providedIn: 'root'
})
export class SellStoreService implements StoreService<Sell> {
  firebaseService = inject(SellFirebaseService);
  list = signal<Sell[]>([]);

  constructor() { }

  addList(items: Sell[]): void {
    this.list.update(l => [...items]);
  }

  add(item: Sell): void {
    this.list.update(l => [...l, item]);
  }

  remove(id: string): void {
    this.list.update(l => l.filter(item => item.id !== id))
  }

  update(client: Sell): void {
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

  getFirebase(): Observable<Sell[]> {
    return this.firebaseService.get().pipe(
      tap(l => this.addList(l))
    );
  }

  refresh(): Observable<Sell[]> {
    return of([]).pipe(
      switchMap(() => this.firebaseService.get()),
      tap(l => this.list.set(l)),
    )
  }
}
