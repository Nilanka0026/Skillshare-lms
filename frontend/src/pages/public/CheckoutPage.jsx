import { CheckoutForm, OrderReceipt, PaymentSummary, TransactionHistoryTable } from '../../components/domain/PaymentComponents.jsx';

export function CheckoutPage({ page }) {
  return (
    <section className="page-section page-pad">
      <div className="page-header">
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>
      <div className="checkout-layout">
        <CheckoutForm />
        <PaymentSummary />
      </div>
      <div className="two-col page-section-small">
        <OrderReceipt />
        <TransactionHistoryTable />
      </div>
    </section>
  );
}
