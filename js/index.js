document.addEventListener('DOMContentLoaded', () => {
    const endpoint = 'https://free.currencyconverterapi.com/api/v5/currencies';
    const inputCurrency = document.querySelector('.currency_convert_from');
    const outputCurrency = document.querySelector('.currency_convert_to');
    const convertButton = document.querySelector('#convert_currency');
    const currencyTobeConverted = document.querySelector('input#currency_to_be_converted',);
    const convertedCurrencyOutput = document.querySelector('input#converted_currency',);


    
    function createOption(currency) {
        if (currency === "undefined") {
            return 'Currency cannot be empty.';
        }

        let optionNode = document.createElement('option');
        optionNode.innerText = currency;

        return optionNode;
    }

    
    function addCurrenciesToSelect(currencies) {
        if (currencies.length === 0 || currencies === 'undefined') {
            return "Currencies cannot be empty.";
        }

        currencies.map(currency => {
            inputCurrency.appendChild(createOption(currency));
            outputCurrency.appendChild(createOption(currency));
        });
    }

    
    function getInput() {
        return document.querySelector('input#amount').value;
    }

    
    function fetchListOfCurrencies() {
        fetch(endpoint)
            .then(response => response.json())
            .then(myJson => {
                const currencies = Object.keys(myJson.results).sort();

                addCurrenciesToSelect(currencies);
            })
            .catch(err =>
                console.error(
                    `The following error occured while getting currencies. ${err}`,
                ),
            );
    }

    
    function fetchCurrencyRate(url) {
        if (url === 'undefined') {
            return 'URL cannot be empty.';
        }

        fetch(url)
            .then(response => response.json())
            .then(myJson => {
                const inputAmount = getInput();
                const exchangeRate = Object.values(myJson);

                calculateExchangeRate(...exchangeRate, inputAmount);
            })
            .catch(err =>
                console.error(
                    `The following error occured while getting the conversion rate. ${err}`,
                ),
            );
    }

    
    function buildAPIUrl(currency1, currency2) {
        if (arguments.length !== 2) {
            return 'A source and destination currencies need to be provided to build the URL.';
        }

        return `https://free.currencyconverterapi.com/api/v5/convert?q=${currency1}_${currency2}&compact=ultra`;
    }

    
    function getExchangeRate() {
        const sourceCurrency = document.querySelector('.currency_convert_from').value;
        const destinationCurrency = document.querySelector('.currency_convert_to').value;

        const url = buildAPIUrl(sourceCurrency, destinationCurrency);
        fetchCurrencyRate(url);
    }

    
    function calculateExchangeRate(exchangeRate, input) {
        if (arguments.length !== 2) {
            return 'An input amount and exchange rate must be provided.';
        }

        const convertedCurrency = input * exchangeRate;

        currencyTobeConverted.value = input;
        convertedCurrencyOutput.value = convertedCurrency.toFixed(2);
    }

  
    function addEventListeners() {
        convertButton.addEventListener('click', getExchangeRate);
    }

    
    function main() {
        addEventListeners();
        fetchListOfCurrencies();
    }

    main();

})
