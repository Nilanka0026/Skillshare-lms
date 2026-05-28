import { useEffect, useMemo, useState } from 'react';
import { BarChart3, BookOpen, CreditCard, GraduationCap, Settings, Trash2, Users } from 'lucide-react';
import { DashboardCard } from '../../../components/common/DashboardCard.jsx';
import { FormInput } from '../../../components/common/FormInput.jsx';
import { categories } from '../../../data/platformData.js';
import { courseApi, orderApi, userApi } from '../../../services/api.js';
import { formatCurrency } from '../../../utils/formatters.js';

export function AdminPage({ title, view }) {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setError('');
    setLoading(true);

    try {
      const [usersData, coursesData, ordersData] = await Promise.all([
        userApi.list(),
        courseApi.list(),
        orderApi.listAll()
      ]);
      setUsers(usersData);
      setCourses(coursesData);
      setOrders(ordersData);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm('Delete this user permanently?');

    if (!confirmed) {
      return;
    }

    try {
      await userApi.remove(userId);
      setUsers((current) => current.filter((user) => user._id !== userId));
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const stats = useMemo(() => ({
    instructors: users.filter((user) => user.role === 'instructor').length,
    payments: orders.reduce((sum, order) => sum + (order.amount || 0), 0)
  }), [orders, users]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-950">{title}</h1>
        <p className="mt-2 text-gray-600">Admin controls for users, courses, instructors, payments, and reports.</p>
        {loading && <p className="mt-4 text-sm font-semibold text-gray-500">Loading admin data...</p>}
        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
      </div>

      {view === 'overview' && <Overview users={users} courses={courses} instructors={stats.instructors} payments={stats.payments} />}
      {view === 'users' && <UsersTable users={users} onDeleteUser={handleDeleteUser} />}
      {view === 'courses' && <CoursesTable courses={courses} />}
      {view === 'instructors' && <UsersTable users={users.filter((user) => user.role === 'instructor')} onDeleteUser={handleDeleteUser} />}
      {view === 'payments' && <OrdersTable orders={orders} />}
      {view === 'categories' && <Categories />}
      {view === 'reports' && <Reports users={users} courses={courses} orders={orders} />}
      {view === 'settings' && <SettingsPanel />}
    </div>
  );
}

function Overview({ courses, instructors, payments, users }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard icon={Users} label="Users" value={users.length} />
      <DashboardCard icon={BookOpen} label="Courses" value={courses.length} />
      <DashboardCard icon={GraduationCap} label="Instructors" value={instructors} />
      <DashboardCard icon={CreditCard} label="Payments" value={formatCurrency(payments)} />
    </div>
  );
}

function UsersTable({ onDeleteUser, users }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-5 py-4 font-black">Name</th>
            <th className="px-5 py-4 font-black">Email</th>
            <th className="px-5 py-4 font-black">Role</th>
            <th className="px-5 py-4 font-black">Created</th>
            <th className="px-5 py-4 font-black">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="px-5 py-4 font-semibold text-gray-900">{user.name}</td>
              <td className="px-5 py-4 text-gray-600">{user.email}</td>
              <td className="px-5 py-4 capitalize text-gray-600">{user.role}</td>
              <td className="px-5 py-4 text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="px-5 py-4">
                <button onClick={() => onDeleteUser(user._id)} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                  <Trash2 size={16} />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CoursesTable({ courses }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-5 py-4 font-black">Title</th>
            <th className="px-5 py-4 font-black">Category</th>
            <th className="px-5 py-4 font-black">Instructor</th>
            <th className="px-5 py-4 font-black">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {courses.map((course) => (
            <tr key={course._id} className="hover:bg-gray-50">
              <td className="px-5 py-4 font-semibold text-gray-900">{course.title}</td>
              <td className="px-5 py-4 text-gray-600">{course.category}</td>
              <td className="px-5 py-4 text-gray-600">{course.instructor?.name || 'Unknown'}</td>
              <td className="px-5 py-4 text-gray-600">{formatCurrency(course.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrdersTable({ orders }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-5 py-4 font-black">User</th>
            <th className="px-5 py-4 font-black">Course</th>
            <th className="px-5 py-4 font-black">Amount</th>
            <th className="px-5 py-4 font-black">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-5 py-4 font-semibold text-gray-900">{order.userId?.name || 'Unknown'}</td>
              <td className="px-5 py-4 text-gray-600">{order.courseId?.title || 'Unknown'}</td>
              <td className="px-5 py-4 text-gray-600">{formatCurrency(order.amount)}</td>
              <td className="px-5 py-4 capitalize text-gray-600">{order.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Categories() {
  return <div className="grid gap-4 md:grid-cols-3">{categories.map((category) => <div key={category} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><h3 className="font-black">{category}</h3><p className="mt-2 text-sm text-gray-600">Manage category visibility and ordering.</p></div>)}</div>;
}

function Reports({ courses, orders, users }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <BarChart3 className="text-blue-600" />
      <h2 className="mt-3 text-xl font-black">Reports & Analytics</h2>
      <p className="mt-2 text-sm text-gray-600">{users.length} users, {courses.length} courses, {orders.length} orders.</p>
      <div className="mt-6 flex h-56 items-end gap-3">{[38, 62, 74, 58, 86, 92].map((height) => <span key={height} className="flex-1 rounded-t-xl bg-blue-600" style={{ height: `${height}%` }} />)}</div>
    </div>
  );
}

function SettingsPanel() {
  return <form className="grid max-w-2xl gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><Settings className="text-blue-600" /><FormInput label="Platform Name" name="name" placeholder="SkillShare" /><FormInput label="Support Email" name="email" placeholder="support@skillshare.test" /></form>;
}
