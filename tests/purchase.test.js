const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiSubset = require('chai-subset')
const expect = chai.expect

const app = require('../app')
const Purchase = require('../models').Purchase
const dummyData = require('./dummy.json')

chai.use(chaiHttp)
chai.use(chaiSubset)

//clean database
before((done) => {
  Purchase.destroy({ where: {} })
    .then(function (response) {
      done()
    })
    .catch(function (err) {
      console.log(err)
      throw new Error('fail to clear table')
      
    })
})

//seed dummy data
before((done) => {
  Purchase.bulkCreate(dummyData)
    .then(function (response) {
      done()
    })
    .catch(function (err) {
      throw new Error('fail to seed dummy data')
    })
})

describe('-POST /purchases', function () {
  it ('should create new purchase succesfully', function (done) {
    chai
      .request(app)
      .post('/purchases')
      .send({
        tax_code: 1,
        name: 'drink',
        price: 10000
      })
      .end((err, res) => {
        expect(res).to.have.status(201)
        expect(res.body).to.ownProperty('name').equals('drink')
        expect(res.body).to.ownProperty('tax_code').equals('1')
        expect(res.body).to.ownProperty('price').equals(10000)
        done()
      })
  })
  it ('should fail to create new purchase with blank/null name field, tax code > 3 or tax code < 1, price equals 0', function (done) {
    chai
      .request(app)
      .post('/purchases')
      .send({
        tax_code: 5,
        price: 0
      })
      .end((err, res) => {
        expect(res).to.have.status(400)
        expect(res.body).to.ownProperty('name').equals('SequelizeValidationError')
        expect(res.body.errors[0].message).equals('Purchase.name cannot be null')
        expect(res.body.errors[1].message).equals('tax code 1, 2, 3 only allowed')
        expect(res.body.errors[2].message).equals('minimum price is 1')
        done()
      })
  })
})

describe('-GET /purchases', function () {
  it ('should get all purchases succesfully', function (done) {
    chai
    .request(app)
    .get('/purchases')
    .end((err, res) => {
      expect(res).to.have.status(200)
      expect(res.body).to.ownProperty('totals').to.be.an('object')
      expect(res.body).to.ownProperty('data').to.be.an('array')
      expect(res.body.data).to.have.length(5)
      expect(res.body.data[0]).to.have.keys('id', 'name', 'tax_code', 'price', 'createdAt', 'updatedAt', 'tax', 'amount', 'type', 'refundable')
      //totals
      expect(res.body.totals.grandTotal).equals(13159)
      expect(res.body.totals.totalTax).equals(1049)
      expect(res.body.totals.totalPrice).equals(12110)
      // Food & Beverages Type
      expect(res.body.data[0].tax).equals(10)
      expect(res.body.data[0].amount).equals(110)
      expect(res.body.data[0].refundable).to.be.true
      expect(res.body.data[0].type).equals('Food & Beverages')
      // Tobacco Type
      expect(res.body.data[1].tax).equals(30)
      expect(res.body.data[1].amount).equals(1030)
      expect(res.body.data[1].refundable).to.be.false
      expect(res.body.data[1].type).equals('Tobacco')
      // Entertainment Type < 100
      expect(res.body.data[2].tax).equals(0)
      expect(res.body.data[2].amount).equals(10)
      expect(res.body.data[2].refundable).to.be.false
      expect(res.body.data[2].type).equals('Entertainment')
      // Entertainment Type > 100
      expect(res.body.data[3].tax).equals(9)
      expect(res.body.data[3].amount).equals(1009)
      expect(res.body.data[3].refundable).to.be.false
      expect(res.body.data[3].type).equals('Entertainment')
      done()
    })
  })
})

