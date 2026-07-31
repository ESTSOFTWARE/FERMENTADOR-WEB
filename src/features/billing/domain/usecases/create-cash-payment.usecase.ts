import type { CashPayment } from '../models/Subscription'
import type { BillingRepository } from '../repositories/BillingRepository'

/** Inicia un pago OXXO (efectivo) o SPEI (transferencia). Devuelve el voucher/
 *  referencia; el pago se confirma después de forma asíncrona. */
export class CreateCashPaymentUseCase {
  private readonly repository: BillingRepository
  constructor(repository: BillingRepository) { this.repository = repository }

  oxxo(plan: string, billingCycle: string): Promise<CashPayment> {
    return this.repository.createOxxo(plan, billingCycle)
  }

  spei(plan: string, billingCycle: string): Promise<CashPayment> {
    return this.repository.createSpei(plan, billingCycle)
  }

  status(paymentId: number): Promise<CashPayment> {
    return this.repository.getCashPayment(paymentId)
  }
}
