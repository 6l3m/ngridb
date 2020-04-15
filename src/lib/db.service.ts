import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
/**
 * Service handling database operations.
 */
export class DbService {
  db: IDBDatabase;

  /**
   * Opens and structures the database with object stores.
   * @param name Name of the database.
   * @param version Version of the database. Has to be greater than existing database for new structure.
   * @param stores Structure of the database. Autoincremantal keys.
   */
  openDb(name: string, version: number, stores: string[]): Promise<string> {
    const req = indexedDB.open(name, version);
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = ((evt: any) => {
        // request is the target of the DOM event
        this.db = evt.target.result;
        resolve(`[NGRIDB] 🙂 ${this.db.name} successfully opened.`);
      }).bind(this);

      req.onerror = (evt: any) => {
        reject(
          `[NGRIDB] 🙁 ${evt.target.error.name}: ${evt.target.error.message}`
        );
      };

      req.onupgradeneeded = ((evt: any) => {
        const db = evt.target.result as IDBDatabase;
        stores.forEach((store) => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, {
              autoIncrement: true,
            });
          }
        });
        resolve(`[NGRIDB] 👌 ${evt.target.result.name} successfully upgraded.`);
      }).bind(this);
    });
  }

  /**
   * Write data into one or multiple stores of the database.
   * @param stores List of object stores defining the scope of the transaction.
   * @param data Objects to be written in stores (multiple objects accepted).
   */
  addDb(stores: string[], ...data: any[]): Promise<any> {
    const transaction = this.db.transaction(stores, 'readwrite');
    stores.forEach((store: string) => {
      const objectStore = transaction.objectStore(store);
      data.forEach((x: any) => {
        objectStore.add(x);
      });
    });
    return new Promise<any>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = (evt: any) =>
        reject(
          `[NGRIDB] 🙁 ${evt.target.error.name}: ${evt.target.error.message}`
        );
    });
  }
}
