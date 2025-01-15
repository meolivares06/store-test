import {Observable} from 'rxjs';
import {WritableSignal} from '@angular/core';
import {Firestore} from '@angular/fire/firestore';

export interface StoreService<T> {
  firebaseService: FirebaseService<T>;
  list: WritableSignal<T[]>;
  loading: boolean;

  addList(items: T[]): void;

  add(item: T): void;

  remove(id: string): void;

  update(client: T): void;

  addFirebase(rawValue: any): Observable<string>;

  updateFirebase(rawValue: any): Observable<void>;

  deleteFirebase(rowData: any): Observable<void>;

  getFirebase(): Observable<T[]>;

  refresh(): Observable<T[]>;
}

export interface FirebaseService<T> {
  firestore: Firestore;
  basePath: string;
  clientCollection: any;

  get(): Observable<T[]>;

  add(data: T): Observable<string>;

  delete(id: string): Observable<void>;

  update(item: T): Observable<void>;
}
