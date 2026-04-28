
const amountFrom = document.getElementById('amountFrom'); // Fixed "Frorm"
const amountTo = document.getElementById('amountTo');     // Fixed "TO"
const currencyFrom = document.getElementById('currencyFrom');
const currencyTo = document.getElementById('currencyTo');
const swapBtn = document.getElementById('swapBtn');
const rateDetail = document.getElementById('rateDetail');

async function getCurrencyData(currency) {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
    const data = await res.json();
    const rate = data.rates.GEL;

    return {
        official: rate.toFixed(4),
        buy: (rate * 0.987).toFixed(3),
        sell: (rate * 1.025).toFixed(3)
    };
}

//fetch left list and  dawn table
async function updateAllRows() {
    try {
        const usd = await getCurrencyData('USD');
        const eur = await getCurrencyData('EUR');
        // USD left side up
        document.getElementById('usd-off').innerText = usd.official;
        document.getElementById('usd-buy').innerText = usd.buy;
        document.getElementById('usd-sell').innerText = usd.sell;
        // EUR left side up
        document.getElementById('eur-off').innerText = eur.official;
        document.getElementById('eur-buy').innerText = eur.buy;
        document.getElementById('eur-sell').innerText = eur.sell;

    } catch (e) {
        console.error(e);
    }
}

// Fetch and convert currency
async function convertCurrency() {
    const from = currencyFrom.value;
    const to = currencyTo.value;
    const amount = parseFloat(amountFrom.value);

    try {
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
        const data = await res.json();

        const rate = data.rates[to];
        const result = (amount * rate).toFixed(2);

        amountTo.value = result;
        rateDetail.innerText = `1 ${from} = ${rate} ${to}`;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
    }
}

    // Event listeners
    amountFrom.addEventListener("input", convertCurrency);
    currencyFrom.addEventListener("change", convertCurrency);
    currencyTo.addEventListener("change", convertCurrency);

    // Swap currencies
    swapBtn.addEventListener("click", () => {
        const tempCurrency = currencyFrom.value;
        currencyFrom.value = currencyTo.value;
        currencyTo.value = tempCurrency;

    convertCurrency();
});

// Initial call
updateAllRows();

convertCurrency();