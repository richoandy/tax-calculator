const Purchase = require('../models').Purchase;

const getTaxAmount = require('../helpers/taxAmount');
const getTotals = require('../helpers/totals');

module.exports = {
  create (req, res) {
    return Purchase
      .create({
        name: req.body.name,
        tax_code: req.body.tax_code,
        price: req.body.price
      })
        .then(function (response) {
          res.status(201).send(response)
        })
        .catch(function (error) {
          res.status(400).send(error)
        });
  },
  readAll (req, res) {
    return Purchase
      .all()
      .then(function (response) {
        response.forEach(data => {
          const updatedData = getTaxAmount(data.dataValues)
        })
        const totals = getTotals(response)
        res.status(200).send({ totals, data: response })
      })
      .catch(function (error) {
        res.status(400).send(error)
      });
  }
};