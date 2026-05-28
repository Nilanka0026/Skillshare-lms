import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/common/Loader.jsx';
import { orderApi } from '../../services/api.js';

export function PaymentProcessing() {
  const navigate = useNavigate();

  useEffect(() => {
    const processPayment = async () => {
      const orderId = localStorage.getItem('skillshareLastOrderId');

      if (!orderId) {
        navigate('/payment/failed');
        return;
      }

      try {
        await orderApi.markPaid(orderId, {
          transactionId: `demo-${Date.now()}`
        });
        navigate('/payment/success');
      } catch (error) {
        console.error(error);
        navigate('/payment/failed');
      }
    };

    const timer = window.setTimeout(processPayment, 1200);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <section className="grid min-h-[calc(100vh-64px)] place-items-center bg-gray-50 px-4">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <Loader label="Processing payment..." />
        <p className="mt-4 text-sm text-gray-600">Simulating payment gateway processing.</p>
      </div>
    </section>
  );
}
