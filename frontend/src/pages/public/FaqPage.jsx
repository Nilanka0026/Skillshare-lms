import { Accordion } from '../../components/ui/index.jsx';
import { faqs } from '../../data/mockData.js';

export function FaqPage({ page }) {
  return <section className="page-section page-pad"><div className="page-header"><h1>{page.title}</h1><p>{page.description}</p></div><Accordion items={faqs} /></section>;
}
