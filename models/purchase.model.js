'use strict';
module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define('Purchase', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tax_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: {
          args: [[1, 2, 3]],
          msg: 'tax code 1, 2, 3 only allowed'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1, 
          msg: 'minimum price is 1'
        }
      }
    }
  }, {});
  Purchase.associate = function(models) {
    // associations can be defined here
  };
  return Purchase;
};