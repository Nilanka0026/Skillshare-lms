import { CreditCard } from 'lucide-react';
import { InputField } from '../ui/index.jsx';

export function CouponInput() {
  return <div className="coupon"><input placeholder="Coupon code" /><button>Apply</button></div>;
}

export function PaymentSummary() {
  return <aside className="summary"><h3>Payment Summary</h3><p>Course subtotal <strong>$49.00</strong></p><p>Discount <strong>-$10.00</strong></p><p>Total <strong>$39.00</strong></p></aside>;
}

export function CheckoutForm() {
  return (
    <form className="form-card">
      <h3><CreditCard size={20} /> Checkout Form</h3>
      <InputField label="Cardholder name" placeholder="Your name" />
      <InputField label="Card number" placeholder="4242 4242 4242 4242" />
      <div className="two-col">
        <InputField label="Expiry" placeholder="MM/YY" />
        <InputField label="CVC" placeholder="123" />
      </div>
      <CouponInput />
    </form>
  );
}

export function OrderReceipt() {
  return <div className="receipt"><h3>Order Receipt</h3><p>#SKL-10342</p><p>Product Design Foundations</p><strong>Paid $39.00</strong></div>;
}

export function TransactionHistoryTable() {
  return <div className="table-like">{['#10342', '#10341', '#10340'].map((id) => <div key={id}><span>{id}</span><span>Paid</span><strong>$39.00</strong></div>)}</div>;
}
