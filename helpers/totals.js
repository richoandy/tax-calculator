const getTotals = (data) => {
  let grandTotal = 0;
  let totalTax = 0;
  let totalPrice = 0;
  
  data.forEach(e => {
    grandTotal += e.dataValues.amount;
    totalTax += e.dataValues.tax;
    totalPrice += e.dataValues.price;
  });
  return { totalPrice, totalTax, grandTotal };
}

module.exports = getTotals;