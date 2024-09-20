const { match } = require('./dist/index')
const txns = require('./test-data/transactions.json')
const orders = require('./test-data/orders.json')
const { nanoid } = require('nanoid')

orders.forEach((item) => {
  item.id = nanoid(5)
})

txns.forEach((item) => {
  item.id = nanoid(5)
})

match({ orders, transactions: txns }).then((res) => {
  console.log(res)
})
