import { Button, InputField, Textarea } from '../../components/ui/index.jsx';

export function ContactPage({ page }) {
  return (
    <section className="page-section page-pad contact-layout">
      <div><h1>{page.title}</h1><p>{page.description}</p></div>
      <form className="form-card"><InputField label="Name" /><InputField label="Email" /><Textarea label="Message" rows="5" /><Button>Send message</Button></form>
    </section>
  );
}
