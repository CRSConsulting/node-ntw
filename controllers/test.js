const json2csv = require('json2csv');
const Promise = require('bluebird');
const fs = require('fs');

Promise.promisifyAll(fs);

const fields = ['car', 'price', 'color'];
const myCars = [
  {
    car: 'Audi',
    price: 40000,
    color: 'blue'
  }, {
    car: 'BMW',
    price: 35000,
    color: 'black'
  }, {
    car: 'Porsche',
    price: 60000,
    color: 'green'
  }
];
const csv = json2csv({ data: myCars, fields });

fs.writeFile('file.csv', csv, (err) => {
  if (err) throw err;
  console.log('file saved');
});

