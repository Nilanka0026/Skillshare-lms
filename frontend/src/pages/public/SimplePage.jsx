import { Badge, Modal, ToastNotification, Tooltip } from '../../components/ui/index.jsx';

export function SimplePage({ page }) {
  return (
    <section className="page-section page-pad">
      <div className="page-header">
        <Badge>{page.title}</Badge>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>
      <div className="component-showcase">
        <Modal />
        <ToastNotification />
        <Tooltip text="Reusable tooltip component"><button className="button button-ghost">Tooltip</button></Tooltip>
      </div>
    </section>
  );
}
