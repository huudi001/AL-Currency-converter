const endpoint = `https://free.currencyconverterapi.com/api/v5/currencies`;
let countryOfcurrency;
const dbPromise = idb.open('currencies', 1, upgradeDB => {

  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('objs', {keyPath: 'id'});
      upgradeDB.createObjectStore('rates', {keyPath: 'id'});
  }
});
fetch(endpoint)
  .then( response => {
  return response.json();
})
  .then(currencies => {
  dbPromise.then(db => {
    if(!db) return;
    countryOfcurrency = [currencies.results];
    const tx = db.transaction('objs', 'readwrite');
    const store = tx.objectStore('objs');
    let i = 0;
    countryOfcurrency.forEach(function(currency) {
      for (let value in currency) {
        store.put(currency[value]);
      }
    });
    return tx.complete;
  });
});


dbPromise.then(db => {
  return db.transaction('objs')
    .objectStore('objs').getAll();
}).then(results => {
        results.forEach(e=> {
            let opt = document.createElement('option');
            let opt2 = document.createElement('option');
            opt.value = e.id;
            opt.text = `${e.currencyName} (${e.id})`;

            opt2 = opt.cloneNode(true);
            currency_converted_from.add(opt);
            currency_converted_to.add(opt2);

        });
        console.log(results);
    });






const generateCurrency = currency => {
    let element = document.getElementById('currency_converted_from');
    let selected = element.options[element.selectedIndex].value;
    let element2= document.getElementById('currency_converted_to');
    let selected2 = element2.options[element2.selectedIndex].value;
    let amounts = document.getElementById("currency_value").value;
    let query = `${selected}_${selected2}`;
    console.log(selected2);
    console.log(selected);
    const Api = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`;
    let newrates;
fetch(Api)
  .then( response => {
  return response.json();
})
  .then(data => {
    data.id= `${query}`;
    newrates = data;
    let rate = newrates[query];
    conversion = amounts * rate;
    console.log(conversion);
    document.getElementById('ans').innerHTML = `Amount: ${conversion}`;

  dbPromise.then(db => {
    if(!db) return;
    const tx = db.transaction('rates', 'readwrite');
    const store = tx.objectStore('rates');
    store.put(newrates);
    return tx.complete;
  });

}).catch(oldrate =>{
    dbPromise.then(db => {
  return db.transaction('rates')
    .objectStore('rates').getAll(query);
}).then(results =>{
        let rate = results[0][query];
        conversion = amounts * rate;
        console.log(conversion);
        document.getElementById('ans').innerHTML = `Amount: ${conversion}`;
    })
});
    }
