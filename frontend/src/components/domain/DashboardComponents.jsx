import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Bell, CreditCard, DollarSign, Users } from 'lucide-react';
import { createElement } from 'react';
import { activities, analytics } from '../../data/mockData.js';

export function DashboardCards() {
  const cards = [
    ['Learners', '42,800', Users],
    ['Revenue', '$128k', DollarSign],
    ['Transactions', '9,430', CreditCard],
    ['Notifications', '18', Bell]
  ];

  return <div className="dashboard-cards">{cards.map(([label, value, Icon]) => <article key={label}>{createElement(Icon, { size: 22 })}<span>{label}</span><strong>{value}</strong></article>)}</div>;
}

export function AnalyticsGraph() {
  return (
    <div className="chart-panel">
      <h3>Analytics Graph</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={analytics}>
          <defs>
            <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="revenue" stroke="#0f766e" fill="url(#revenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RecentActivity() {
  return <div className="activity-panel"><h3>Recent Activity</h3>{activities.map((item) => <p key={item}>{item}</p>)}</div>;
}

export function NotificationsPanel() {
  return <div className="activity-panel"><h3>Notifications Panel</h3><p>3 assignments pending review</p><p>2 payments require attention</p><p>5 learner messages unread</p></div>;
}
