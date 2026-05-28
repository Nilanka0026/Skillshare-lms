import { RatingStars } from '../ui/index.jsx';

export function InstructorCard({ instructor }) {
  return <article className="instructor-card"><div className="avatar">{instructor.name[0]}</div><h3>{instructor.name}</h3><p>{instructor.specialty}</p><RatingStars value={instructor.rating} /></article>;
}

export function InstructorStats() {
  return <div className="stats-strip"><span><strong>18.4k</strong> students</span><span><strong>12</strong> courses</span><span><strong>4.9</strong> rating</span></div>;
}

export function EarningsChart() {
  return <div className="mini-bars">{[40, 60, 45, 75, 58, 88].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div>;
}

export function StudentList() {
  return <div className="table-like">{['Maya Khan', 'Liam Fox', 'Sara Lee', 'Daniel Perera'].map((name) => <div key={name}><span>{name}</span><span>Active</span></div>)}</div>;
}
