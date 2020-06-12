import { Injectable } from '@angular/core';

import { IDBEntry } from './idbEntry.interface';

@Injectable({
  providedIn: 'root',
})
/**
 * Service handling database operations. Returns Promises.
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
      req.onupgradeneeded = (evt: any) => {
        const db = evt.target.result as IDBDatabase;
        // In case of db opened and deleted multiple times to avoid blocking.
        db.onversionchange = () => db.close();
        stores.forEach((store) => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, {
              autoIncrement: true,
            });
          }
        });
        console.log(
          `[NGRIDB] 👌 ${evt.target.result.name} successfully upgraded.`
        );
      };
    });
  }

  /**
   * Writes data into one or multiple stores of the database.
   * @param stores List of object stores defining the scope of the transaction.
   * @param data Objects to be written in stores (multiple objects accepted).
   */
  addDb(stores: string[], ...data: any[]): Promise<any> {
    const transaction = this.db.transaction(stores, 'readwrite');
    let result: IDBEntry<any>[] = [];
    stores.forEach((store: string) => {
      const objectStore = transaction.objectStore(store);
      data.forEach((x: any) => {
        const request = objectStore.add(x);
        request.onsuccess = (evt: any) =>
          (result = [...result, { key: evt.target.result, value: x }]);
      });
    });
    return new Promise<any>((resolve, reject) => {
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = (evt: any) =>
        reject(
          `[NGRIDB] 🙁 ${evt.target.error.name}: ${evt.target.error.message}`
        );
    });
  }

  /**
   * Remove data from one or multiple stores of the database.
   * @param stores List of object stores defining the scope of the transaction.
   * @param keys Keys of objects to be removed from database.
   */
  deleteDb(stores: string[], ...keys: number[]): Promise<any> {
    const transaction = this.db.transaction(stores, 'readwrite');
    stores.forEach((store: string) => {
      const objectStore = transaction.objectStore(store);
      keys.forEach((key: any) => {
        objectStore.delete(key);
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

  getDb(stores: string[], key: number): Promise<any[] | string> {
    try {
      const transaction = this.db.transaction(stores, 'readonly');
      let result: any[] = [];
      stores.forEach((store: string) => {
        const objectStore = transaction.objectStore(store);
        const request = objectStore.get(key);
        request.onsuccess = (evt: any) =>
          (result = [...result, evt.target.result]);
      });
      return new Promise<IDBEntry<any>[]>((resolve, reject) => {
        transaction.oncomplete = () => resolve(result);
        transaction.onerror = (evt: any) =>
          reject(
            `[NGRIDB] 🙁 ${evt.target.error.name}: ${evt.target.error.message}`
          );
      });
    } catch (error) {
      return new Promise<string>((resolve, reject) =>
        reject(`[NGRIDB] 🙁 ${error.name}: ${error.message}`)
      );
    }
  }
}
