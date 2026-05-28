export function LegalPage({ page }) {
  return (
    <section className="page-section page-pad prose-page">
      <h1>{page.title}</h1>
      <p>{page.description}</p>
      <h2>Accounts</h2>
      <p>Users are responsible for keeping their account information accurate and secure.</p>
      <h2>Courses</h2>
      <p>Course access, reviews, and certificates are managed through the platform dashboard.</p>
      <h2>Payments</h2>
      <p>Payment processing, refunds, and instructor withdrawals should be connected to your backend services.</p>
    </section>
  );
}
