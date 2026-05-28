import { AuthProvider } from './context/AuthContext.jsx';
import { CourseProvider } from './context/CourseContext.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <AppRoutes />
      </CourseProvider>
    </AuthProvider>
  );
}
