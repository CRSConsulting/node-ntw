const zipcode = require('zippity-do-dah');

const fiveMinimum = 50; // set minimum donation to get 5 chances
const twentyMinimum = 100; // set minimum donation to get 20 chances
const unpaidDupeMax = 20;

exports.getChancesForAll = (req) => {

  return req.reduce(
    (r, a) => {
      let chances = 0;
      
      for (let i = 0; i < chances; i += 1) {
        r.push(a);
      }
      return r;
    }
    , []
  );
};

const getChancesForOne = (req) => {
  let chances = 1;
  if (req.collected_amount && req.collected_amount !== null) { // if money was donated
    const currency = req.collected_amount;
    const number = Number(currency.replace(/[^0-9.-]+/g, '')); // convert dollar to number
    if (number >= twentyMinimum) {
      chances = 20;
    } else if (number >= fiveMinimum) {
      chances = 5;
    } else if (number === 0) {
      const multiEntries = r.filter(mobile => (mobile.phone === a.phone && mobile.collected_amount === '$0.00')); // get count in weighted array of duplicate phone entries
      if (multiEntries.length === unpaidDupeMax) {
        chances = 0;
      }
      const multiEntriesEmail = r.filter(mobile => (mobile.email === a.email && mobile.collected_amount === '$0.00')); // get count in weighted array of duplicate email entries
      if (multiEntriesEmail.length === unpaidDupeMax) {
        chances = 0;
      }
      console.log(a);
      const address = zipcode.zipcode(a.zipcode);
      console.log(address);
      if (!address.state || address.state === 'FL' || address.state === 'NY') {
        chances = 0;
      }
    }
  }
  return chances;
}

exports.getChancesForOne = getChancesForOne;
