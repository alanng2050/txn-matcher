import { InferType, number, object, string } from 'yup'

const orderId = string().required()
const customerName = string().required()
const date = string().required()
const product = string().required()
const price = number().required()
const id = string().required()

const orderSchema = object({
  id,
  type: string().oneOf(['order'] as const),
  customerName,
  orderId,
  date,
  product,
  price,
})

const txnSchema = object({
  id,
  type: string().oneOf(['txn'] as const),
  customerName,
  orderId,
  date,
  product,
  price,
  transactionType: string().required(),
  transactionDate: string().required(),
  transactionAmount: number().required(),
})

export type OrderType = InferType<typeof orderSchema>
export type TransactionType = InferType<typeof txnSchema> & {
  suggestedOrderIds?: string[]
  verifiedId?: string
}

export class Validator {
  validateOrder(order: OrderType) {
    return orderSchema.validate(order, { stripUnknown: true })
  }

  validateTxn(txn: TransactionType) {
    return txnSchema.validate(txn, { stripUnknown: true })
  }
}
