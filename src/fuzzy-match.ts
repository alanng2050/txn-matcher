import Fuse from 'fuse.js'
import { OrderType, TransactionType } from './validator'
import { InputData } from './type'

export class FuzzyMatch {
  matchingKeys = ['customerName', 'product'] as const
  buildKeys: Array<keyof OrderType> = ['date', 'price']

  async match({ orders, transactions }: InputData) {
    // organize data
    // create dictionary based on date and price
    const dictData = this.buildDict(orders)

    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].verifiedId) return

      const txn = transactions[i]
      const dictKey = this.getDictKey(txn)

      if (!dictData[dictKey]) continue

      const mergedResult: Record<number, Array<number | undefined>> = {}

      // check match
      for (const matchingKey of this.matchingKeys) {
        const dataToSearch = dictData[dictKey].map(
          (order) => order[matchingKey]
        )
        const fuse = new Fuse(dataToSearch, {
          includeScore: true,
        })

        const res = fuse.search(txn[matchingKey])

        res.forEach((item) => {
          if (!mergedResult[item.refIndex]) mergedResult[item.refIndex] = []
          mergedResult[item.refIndex].push(item.score)
        })
      }

      // if a transaction has all matching keywords with positive score
      // then add it to verified list
      for (const index of Object.keys(mergedResult)) {
        const result: (typeof mergedResult)[number] = mergedResult[index]
        const allPositive =
          result.length === this.matchingKeys.length &&
          result.every((val) => !!val)
        if (allPositive) {
          const orderId = dictData[dictKey][parseInt(index)].id
          if (!txn.suggestedOrderIds) txn.suggestedOrderIds = []
          txn.suggestedOrderIds.push(orderId)
        }
      }
    }
  }

  getDictKey(order: OrderType | TransactionType) {
    let key = ''
    for (const k of this.buildKeys) {
      key += String(order[k])
    }
    return key
  }

  buildDict(orders: OrderType[]) {
    const dict: Record<string, OrderType[]> = {}

    for (let i = 0; i < orders.length; i++) {
      // the first item is the order
      const order = orders[i]
      const key = this.getDictKey(order)

      if (!dict[key]) {
        dict[key] = [order]
      } else {
        dict[key].push(order)
      }
    }

    return dict
  }
}
