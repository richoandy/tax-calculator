const getTaxAmount = (data) => {
  let tax, amount, type, refundable;

  if (data.tax_code === '1') {
    tax = getFoodTax(data.price);
    type = 'Food & Beverages';
    refundable = true;
  } else if (data.tax_code === '2') {
    tax = getTobaccoTax(data.price);
    type = 'Tobacco';
    refundable = false;
  } else if (data.tax_code === '3') {
    tax = getEntertainmentTax(data.price);
    type = 'Entertainment';
    refundable = false;
  }

  amount = data.price + tax;

  //asssign data with extra attributes
  data.tax = tax;
  data.amount = amount;
  data.type = type;
  data.refundable = refundable;

  return data;
}

function getFoodTax (price) {
  return price * 10 / 100;
}

function getTobaccoTax (price) {
  return 10 + (2 / 100 * price);
}

function getEntertainmentTax (price) {
  let tax;
  if (price < 100) {
    tax = 0;
  } else if (price >= 100){
    return (price - 100) * 1 / 100;
  }
  return tax;
}

module.exports = getTaxAmount;