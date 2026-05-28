import { Link } from 'react-router-dom';

export function ErrorPage({ page }) {
  return (
    <section className="error-page">
      <h1>{page.title}</h1>
      <p>{page.description}</p>
      <Link className="button button-primary" to="/home">Back home</Link>
    </section>
  );
}
