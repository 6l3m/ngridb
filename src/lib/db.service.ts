import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  db: IDBDatabase;

  openDb(name: string, version: number, stores: string[]): Promise<any> {
    const req = indexedDB.open(name, version);
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = ((evt: any) => {
        this.db = evt.target.result;
        resolve(`[NGRIDB] 🙂 ${this.db.name} successfully opened`);
      }).bind(this);

      req.onerror = (evt: any) => {
        reject('[NGRIDB] 🙁 ' + evt.target.error.message);
      };

      req.onupgradeneeded = ((evt: any) => {
        stores.forEach((store) => {
          this.createStore(store, 'id', evt);
        });
        resolve(`[NGRIDB] 👌 ${evt.target.result.name} successfully upgraded`);
      }).bind(this);
    });
  }

  createStore(storeName: string, keyPath: string, evt: any) {
    const db = evt.target.result as IDBDatabase;
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, {
        keyPath,
      });
    }
  }
}
