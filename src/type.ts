import { OrderType, TransactionType } from './validator'

export type DictData = Record<string, OrderType>

export type VerifiedData = DictData[number][]

export type InputData = {
  orders: OrderType[]
  transactions: TransactionType[]
}

export type FuzzyMatchInput = {
  data: VerifiedData
  unMatchedTxns: TransactionType[]
}
