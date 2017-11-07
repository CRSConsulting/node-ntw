// This is used for demo purposes.


const Book = require('../models/Book.js');

exports.getBooks = (req, res) => {
  Book.find((err, docs) => {
    console.log('books controller: getBooks ', docs);
    res.render('books', { books: docs });
  });
};