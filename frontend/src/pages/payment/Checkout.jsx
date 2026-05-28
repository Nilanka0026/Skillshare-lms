import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { Button } from '../../components/common/Button.jsx';
import { FormInput } from '../../components/common/FormInput.jsx';
import { PaymentSummary } from '../../components/common/PaymentSummary.jsx';
import { courses } from '../../data/platformData.js';
import { courseApi, orderApi } from '../../services/api.js';
import { paymentGateways } from '../../services/paymentGateways.js';

export function Checkout() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const fallbackCourse = courses.find((item) => item.id === courseId) || courses[0];
  const [course, setCourse] = useState(fallbackCourse);
  const [gateway, setGateway] = useState('stripe');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    courseApi.details(courseId)
      .then((data) => setCourse(data.course))
      .catch(() => setCourse(fallbackCourse));
  }, [courseId, fallbackCourse]);

  const handlePayment = async () => {
    setError('');
    setLoading(true);

    try {
      const createdOrder = await orderApi.create({
        courseId: course._id || course.id,
        paymentProvider: gateway
      });
      localStorage.setItem('skillshareLastOrderId', createdOrder.order._id);
      navigate('/payment/processing');
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-black text-gray-950">Checkout</h1>
          <p className="mt-2 text-gray-600">Frontend payment flow prepared for Stripe and PayHere.</p>
          {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
          <div className="mt-8 grid gap-4">
            <FormInput label="Cardholder Name" name="name" placeholder="Your name" />
            <FormInput label="Card Number" name="card" placeholder="4242 4242 4242 4242" />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Expiry" name="expiry" placeholder="MM/YY" />
              <FormInput label="CVC" name="cvc" placeholder="123" />
            </div>
          </div>
          <div className="mt-8">
            <h2 className="font-black text-gray-950">Payment Gateway Section</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {paymentGateways.map((provider) => (
                <label key={provider.id} className="rounded-2xl border border-gray-200 p-4">
                  <input type="radio" name="gateway" checked={gateway === provider.id} onChange={() => setGateway(provider.id)} />{' '}
                  <span className="font-bold text-gray-950">{provider.name}</span>
                  <p className="mt-2 text-sm text-gray-600">{provider.description}</p>
                </label>
              ))}
            </div>
          </div>
          <Button className="mt-8" disabled={loading} onClick={handlePayment}><CreditCard size={18} /> {loading ? 'Creating order...' : 'Pay Now'}</Button>
        </div>
        <PaymentSummary course={course} />
      </div>
    </section>
  );
}
