import { useEffect, useMemo, useState } from 'react';
import { BarChart3, BookOpen, CreditCard, GraduationCap, Settings, Trash2, Users, Plus, Edit, Edit3, X, Save } from 'lucide-react';
import { DashboardCard } from '../../../components/common/DashboardCard.jsx';
import { FormInput } from '../../../components/common/FormInput.jsx';
import { courseApi, orderApi, userApi, authApi } from '../../../services/api.js';
import { formatCurrency } from '../../../utils/formatters.js';

export function AdminPage({ title, view }) {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  
  // Creation States
  const [showAddUser, setShowAddUser] = useState(false);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'student' });
  
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: '', category: '', price: '', instructor: '', description: '' });

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setError('');
    setLoading(true);

    try {
      const [usersData, coursesData, ordersData, categoriesData] = await Promise.all([
        userApi.list(),
        courseApi.list(),
        orderApi.listAll(),
        userApi.categoriesRaw()
      ]);
      setUsers(usersData);
      setCourses(coursesData);
      setOrders(ordersData);
      setCategoriesList(categoriesData);
    } catch (apiError) {
      setError(apiError.message || 'Failed to fetch admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm('Are you sure you want to delete this user permanently? All their associations will be lost.');
    if (!confirmed) return;

    try {
      await userApi.remove(userId);
      setUsers((current) => current.filter((user) => user._id !== userId));
      setSuccess('User deleted successfully.');
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const confirmed = window.confirm('Are you sure you want to delete this course permanently? All enrollments and lessons will be removed.');
    if (!confirmed) return;

    try {
      await courseApi.remove(courseId);
      setCourses((current) => current.filter((course) => course._id !== courseId));
      setSuccess('Course deleted successfully.');
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await authApi.register({
        fullName: userForm.name,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role
      });
      setSuccess(`Successfully added new ${userForm.role}: ${userForm.name}.`);
      setUserForm({ name: '', email: '', password: '', role: 'student' });
      setShowAddUser(false);
      loadAdminData();
    } catch (apiError) {
      setError(apiError.message || 'Failed to add user');
    }
  };

  const handleAddCourseSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await courseApi.create({
        title: courseForm.title,
        category: courseForm.category,
        price: Number(courseForm.price),
        instructor: courseForm.instructor,
        description: courseForm.description,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80'
      });
      setSuccess(`Successfully created course: ${courseForm.title}.`);
      setCourseForm({ title: '', category: '', price: '', instructor: '', description: '' });
      setShowAddCourse(false);
      loadAdminData();
    } catch (apiError) {
      setError(apiError.message || 'Failed to create course');
    }
  };

  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await userApi.categoryCreate({ name: categoryForm.name });
      setSuccess(`Successfully added category: ${categoryForm.name}.`);
      setCategoryForm({ name: '' });
      setShowAddCategory(false);
      loadAdminData();
    } catch (apiError) {
      setError(apiError.message || 'Failed to add category');
    }
  };

  const handleEditCategoryClick = (cat) => {
    setEditingCategory(cat);
    setEditingCategoryName(cat.name);
  };

  const handleUpdateCategorySubmit = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    setError('');
    setSuccess('');

    try {
      await userApi.categoryUpdate(editingCategory._id, { name: editingCategoryName });
      setSuccess('Category renamed successfully.');
      setEditingCategory(null);
      setEditingCategoryName('');
      loadAdminData();
    } catch (apiError) {
      setError(apiError.message || 'Failed to rename category');
    }
  };

  const handleDeleteCategory = async (catId) => {
    const confirmed = window.confirm('Are you sure you want to delete this category? Courses belonging to this category will not be deleted but they will lose category reference.');
    if (!confirmed) return;
    setError('');
    setSuccess('');

    try {
      await userApi.categoryRemove(catId);
      setSuccess('Category deleted successfully.');
      loadAdminData();
    } catch (apiError) {
      setError(apiError.message || 'Failed to delete category');
    }
  };

  const stats = useMemo(() => ({
    instructors: users.filter((user) => user.role === 'instructor').length,
    payments: orders.reduce((sum, order) => sum + (order.amount || 0), 0)
  }), [orders, users]);

  const activeInstructors = useMemo(() => {
    return users.filter((user) => user.role === 'instructor');
  }, [users]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-950">{title}</h1>
          <p className="mt-2 text-gray-600">Admin controls for users, teachers, courses, categories, payments, and reports.</p>
        </div>
        
        {view === 'users' && (
          <button 
            onClick={() => setShowAddUser(!showAddUser)}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition"
          >
            <Plus size={16} /> Add User / Teacher
          </button>
        )}

        {view === 'courses' && (
          <button 
            onClick={() => setShowAddCourse(!showAddCourse)}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition"
          >
            <Plus size={16} /> Add Course
          </button>
        )}

        {view === 'categories' && (
          <button 
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition"
          >
            <Plus size={16} /> Add Category
          </button>
        )}
      </div>

      {loading && <p className="text-sm font-semibold text-gray-500">Loading admin operations...</p>}
      
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="underline text-red-800">Dismiss</button>
        </div>
      )}
      
      {success && (
        <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="underline text-blue-800">Dismiss</button>
        </div>
      )}

      {/* Add User Form Section */}
      {showAddUser && view === 'users' && (
        <form onSubmit={handleAddUserSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm max-w-2xl grid gap-4">
          <h3 className="text-lg font-black text-gray-950">Register User (Student / Teacher)</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput 
              label="Full Name" 
              value={userForm.name} 
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} 
              placeholder="e.g. Jane Doe" 
              required 
            />
            <FormInput 
              label="Email Address" 
              value={userForm.email} 
              type="email"
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} 
              placeholder="jane@skillshare.test" 
              required 
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput 
              label="Password" 
              value={userForm.password} 
              type="password"
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} 
              placeholder="••••••••" 
              required 
            />
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-gray-700">Account Role</span>
              <select 
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm font-semibold bg-white"
              >
                <option value="student">Student</option>
                <option value="instructor">Teacher (Instructor)</option>
                <option value="admin">Platform Administrator</option>
              </select>
            </label>
          </div>
          <div className="flex gap-2 mt-2">
            <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700">
              Save User Profile
            </button>
            <button type="button" onClick={() => setShowAddUser(false)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Add Course Form Section */}
      {showAddCourse && view === 'courses' && (
        <form onSubmit={handleAddCourseSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm max-w-3xl grid gap-4">
          <h3 className="text-lg font-black text-gray-950">Add Course to Platform</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput 
              label="Course Title" 
              value={courseForm.title} 
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} 
              placeholder="React Architecture Principles" 
              required 
            />
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-gray-700">Course Category</span>
              <select 
                value={courseForm.category}
                onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm font-semibold bg-white"
                required
              >
                <option value="">-- Select Category --</option>
                {categoriesList.map(cat => <option key={cat._id || cat} value={cat.name || cat}>{cat.name || cat}</option>)}
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput 
              label="Price (USD) - Set 0 for Free Course" 
              value={courseForm.price} 
              type="number"
              onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })} 
              placeholder="49" 
              required 
            />
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-gray-700">Assign Teacher (Instructor)</span>
              <select 
                value={courseForm.instructor}
                onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm font-semibold bg-white"
                required
              >
                <option value="">-- Choose Instructor --</option>
                {activeInstructors.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>{teacher.name} ({teacher.email})</option>
                ))}
              </select>
            </label>
          </div>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-gray-700">Description</span>
            <textarea 
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              className="min-h-24 w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm"
              placeholder="Course description..."
              required
            />
          </label>
          <div className="flex gap-2 mt-2">
            <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700">
              Publish Course
            </button>
            <button type="button" onClick={() => setShowAddCourse(false)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Add Category Form Section */}
      {showAddCategory && view === 'categories' && (
        <form onSubmit={handleAddCategorySubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm max-w-xl grid gap-4">
          <h3 className="text-lg font-black text-gray-950">Add Course Category</h3>
          <FormInput 
            label="Category Name" 
            value={categoryForm.name} 
            onChange={(e) => setCategoryForm({ name: e.target.value })} 
            placeholder="e.g. Game Development" 
            required 
          />
          <div className="flex gap-2 mt-2">
            <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700">
              Save Category
            </button>
            <button type="button" onClick={() => setShowAddCategory(false)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Editing Category Section */}
      {editingCategory && view === 'categories' && (
        <form onSubmit={handleUpdateCategorySubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm max-w-xl grid gap-4">
          <h3 className="text-lg font-black text-gray-950">Rename Course Category</h3>
          <FormInput 
            label="Category Name" 
            value={editingCategoryName} 
            onChange={(e) => setEditingCategoryName(e.target.value)} 
            placeholder="e.g. Game Development" 
            required 
          />
          <div className="flex gap-2 mt-2">
            <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 flex items-center gap-1">
              <Save size={14} /> Save Changes
            </button>
            <button type="button" onClick={() => { setEditingCategory(null); setEditingCategoryName(''); }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1">
              <X size={14} /> Cancel
            </button>
          </div>
        </form>
      )}

      {view === 'overview' && <Overview users={users} courses={courses} instructors={stats.instructors} payments={stats.payments} />}
      {view === 'users' && <UsersTable users={users} onDeleteUser={handleDeleteUser} />}
      {view === 'courses' && <CoursesTable courses={courses} onDeleteCourse={handleDeleteCourse} />}
      {view === 'instructors' && <UsersTable users={users.filter((user) => user.role === 'instructor')} onDeleteUser={handleDeleteUser} />}
      {view === 'payments' && <OrdersTable orders={orders} />}
      {view === 'categories' && (
        <CategoriesTable 
          categories={categoriesList} 
          onEditCategory={handleEditCategoryClick}
          onDeleteCategory={handleDeleteCategory}
        />
      )}
      {view === 'reports' && <Reports users={users} courses={courses} orders={orders} />}
      {view === 'settings' && <SettingsPanel />}
    </div>
  );
}

function Overview({ courses, instructors, payments, users }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard icon={Users} label="Total Users" value={users.length} />
      <DashboardCard icon={BookOpen} label="Total Courses" value={courses.length} />
      <DashboardCard icon={GraduationCap} label="Total Teachers" value={instructors} />
      <DashboardCard icon={CreditCard} label="Payment Sales" value={formatCurrency(payments)} />
    </div>
  );
}

function UsersTable({ onDeleteUser, users }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-5 py-4 font-black">Name</th>
              <th className="px-5 py-4 font-black">Email</th>
              <th className="px-5 py-4 font-black">Role</th>
              <th className="px-5 py-4 font-black">Created</th>
              <th className="px-5 py-4 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-semibold text-gray-900">{user.name}</td>
                <td className="px-5 py-4 text-gray-600">{user.email}</td>
                <td className="px-5 py-4 capitalize text-gray-600">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                    user.role === 'admin' 
                      ? 'bg-red-50 text-red-600' 
                      : user.role === 'instructor' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'bg-gray-50 text-gray-600'
                  }`}>
                    {user.role === 'instructor' ? 'teacher' : user.role}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-4 text-right">
                  <button 
                    onClick={() => onDeleteUser(user._id)} 
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CoursesTable({ courses, onDeleteCourse }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-5 py-4 font-black">Title</th>
              <th className="px-5 py-4 font-black">Category</th>
              <th className="px-5 py-4 font-black">Instructor / Teacher</th>
              <th className="px-5 py-4 font-black">Price</th>
              <th className="px-5 py-4 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course._id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-semibold text-gray-900">{course.title}</td>
                <td className="px-5 py-4 text-gray-600">{course.category}</td>
                <td className="px-5 py-4 text-gray-600">{course.instructor?.name || 'Unknown'}</td>
                <td className="px-5 py-4 text-gray-600 font-bold text-gray-900">
                  {course.price === 0 ? 'Free' : formatCurrency(course.price)}
                </td>
                <td className="px-5 py-4 text-right">
                  <button 
                    onClick={() => onDeleteCourse(course._id)} 
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoriesTable({ categories, onEditCategory, onDeleteCategory }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-5 py-4 font-black">Category Name</th>
              <th className="px-5 py-4 font-black">Created At</th>
              <th className="px-5 py-4 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat._id || cat} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-semibold text-gray-900">{cat.name || cat}</td>
                <td className="px-5 py-4 text-gray-600">
                  {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : 'System Default'}
                </td>
                <td className="px-5 py-4 text-right flex gap-2 justify-end">
                  {cat._id && (
                    <>
                      <button 
                        onClick={() => onEditCategory(cat)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
                      >
                        <Edit3 size={13} /> Rename
                      </button>
                      <button 
                        onClick={() => onDeleteCategory(cat._id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </>
                  )}
                  {!cat._id && <span className="text-xs text-gray-400 font-bold px-3 py-2">System Static</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTable({ orders }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
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
                <td className="px-5 py-4 text-gray-600 font-bold text-gray-900">{formatCurrency(order.amount)}</td>
                <td className="px-5 py-4 capitalize text-gray-600">
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded ${
                    order.paymentStatus === 'paid' 
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Reports({ courses, orders, users }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <BarChart3 className="text-blue-600" />
      <h2 className="mt-3 text-xl font-black text-gray-950">Platform Reports</h2>
      <p className="mt-2 text-sm text-gray-600">{users.length} users, {courses.length} courses, {orders.length} orders.</p>
      <div className="mt-6 flex h-56 items-end gap-3">{[38, 62, 74, 58, 86, 92].map((height, idx) => <span key={idx} className="flex-1 rounded-t-xl bg-blue-600" style={{ height: `${height}%` }} />)}</div>
    </div>
  );
}

function SettingsPanel() {
  return <form className="grid max-w-2xl gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><Settings className="text-blue-600" /><FormInput label="Platform Name" name="name" placeholder="SkillShare" readOnly /><FormInput label="Support Email" name="email" placeholder="support@skillshare.test" readOnly /></form>;
}
