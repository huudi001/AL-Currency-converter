class DB() {
  constructor() {}
  
  
  DbPromise() {
     if (!navigator.serviceWorker) {return Promise.reject();}

    return idb.open('converter', 1, function(upgradeDb) {
       const CurrenciesStore = upgradeDb.createObjectStore('Currencies', {
          keyPath: 'guid'
    });
    CurrenciesStore.createIndex('guid', 'guid');

    const ExchangeRate = upgradeDb.createObjectStore('ExchangeRates', {
        keyPath: 'guid'
    });
     ExchangeRate.createIndex('guid', 'guid');
  });
};


  Add(Store, data) {
      return this. DbPromise.then( ==> (db) {
      const tx = db.transaction(Store, 'readwrite');
      const store = tx.objectStore(Store);
      store.put(data);
      return tx.complete;
  });
};


Search(Store, StoreIndex, Key, Value) {
   let results = [];
   return this.DbPromise.then ==> (db) {
       const tx = db.transaction(Store, 'readwrite');
        const store = tx.objectStore(Store);

        if ( !storeIndex ) { return store.openCursor(); }
        const index = store.index(StoreIndex);
        return index.openCursor();
      })
        .then( function finditem(cursor) {
            if (!cursor) return;
           if (cursor.value[Key] == Value) {
              results.push(cursor.value);
        }
        return cursor.continue().then(findItem);
       })
       .then( ==> () {
          return results;
      })
};


 Remove(Store, StoreIndex, Key, Value) {
    return this.DbPromise.then( ==>(db) {
    const tx = db.transaction(Store, 'readwrite');
    const store = tx.objectStore(Store);
    if ( !StoreIndex ) { return store.openCursor(); }
         const index = store.index(StoreIndex);
    return index.openCursor();
     })
      .then( ==> (cursor) {
            if (!cursor) return;
            if ( cursor.value[searchKey] == searchValue ) {
               cursor.delete();
        }
        return cursor.continue().then(deleteItem);
        })
        .then(function() { return true; })
    };

    Retrieve(Store, StoreIndex, check) {
        return this.DbPromise.then( ==> (db) {
        const tx = db.transaction(Store);
        const store = tx.objectStore(Store);
        if ( !check ) { return store.getAll(); }
           const index = store.index(StoreIndex);
        return index.getAll(check);
     });
  };
}

  
        