import { ChevronDown, LoaderCircle, Star } from 'lucide-react';

export function Button({ children, variant = 'primary', ...props }) {
  return <button className={`button button-${variant}`} {...props}>{children}</button>;
}

export function InputField({ label, ...props }) {
  return <label className="field"><span>{label}</span><input {...props} /></label>;
}

export function Textarea({ label, ...props }) {
  return <label className="field"><span>{label}</span><textarea {...props} /></label>;
}

export function SelectDropdown({ label, options = [] }) {
  return (
    <label className="field select-field">
      <span>{label}</span>
      <select>{options.map((option) => <option key={option}>{option}</option>)}</select>
      <ChevronDown size={17} />
    </label>
  );
}

export function Checkbox({ label }) {
  return <label className="check-row"><input type="checkbox" /> {label}</label>;
}

export function RadioButton({ label, name }) {
  return <label className="check-row"><input type="radio" name={name} /> {label}</label>;
}

export function Modal() {
  return <div className="modal-sample"><strong>Modal</strong><p>Reusable dialog surface for confirmations and forms.</p></div>;
}

export function Loader() {
  return <LoaderCircle className="spin" size={22} />;
}

export function ToastNotification() {
  return <div className="toast">Course saved successfully</div>;
}

export function Pagination() {
  return <div className="pagination"><button>Prev</button><button className="active">1</button><button>2</button><button>Next</button></div>;
}

export function Tabs({ items = ['Overview', 'Curriculum', 'Reviews'] }) {
  return <div className="tabs">{items.map((item, index) => <button key={item} className={index === 0 ? 'active' : ''}>{item}</button>)}</div>;
}

export function Accordion({ items }) {
  return <div className="accordion">{items.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>;
}

export function Breadcrumb({ items = ['Home', 'Courses', 'Details'] }) {
  return <div className="breadcrumb">{items.join(' / ')}</div>;
}

export function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

export function Tooltip({ text, children }) {
  return <span className="tooltip" data-tooltip={text}>{children}</span>;
}

export function RatingStars({ value = 4.8 }) {
  return <span className="stars"><Star size={16} fill="currentColor" /> {value}</span>;
}

export function ProgressBar({ value = 60 }) {
  return <div className="progress"><span style={{ width: `${value}%` }} /></div>;
}
