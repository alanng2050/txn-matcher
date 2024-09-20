import { createHash } from 'crypto'
import { OrderType, TransactionType, Validator } from './validator'
import { DictData, InputData } from './type'

export class SimpleMatch {
  validator = new Validator()
  hashKeys: Array<keyof OrderType> = [
    'customerName',
    'orderId',
    'date',
    'price',
  ]

  async match({ orders, transactions }: InputData) {
    // validate data
    const dictData = await this.buildDictData(orders)

    // add transaction to dictData
    for (let i = 0; i < transactions.length; i++) {
      const tx = await this.validator.validateTxn(transactions[i])
      const hashKey = this.getHashKey(tx)
      if (dictData[hashKey]) {
        transactions[i].verifiedId = dictData[hashKey].id
      }
    }
  }

  async buildDictData(orders: OrderType[]) {
    const dictData: DictData = {}
    for (let i = 0; i < orders.length; i++) {
      const order = await this.validator.validateOrder(orders[i])
      const hashKey = this.getHashKey(order)
      dictData[hashKey] = order
    }
    return dictData
  }

  getHashKey(order: OrderType | TransactionType) {
    const dataToHash: Array<string | number> = []
    for (const key of this.hashKeys) {
      if (order[key]) dataToHash.push(order[key])
    }
    const hashKey = createHash('md5')
      .update(JSON.stringify(dataToHash))
      .digest('hex')

    return hashKey
  }
}
