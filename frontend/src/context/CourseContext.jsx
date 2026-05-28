import { createContext, useContext, useState, useCallback } from 'react';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';

const CourseContext = createContext(null);

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCourses = useCallback(async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const data = await courseService.list(params);
      setCourses(data);
      return data;
    } catch (apiError) {
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await courseService.myCourses();
      setMyCourses(data);
      return data;
    } catch (apiError) {
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const enrollInCourse = useCallback(async (courseId) => {
    setLoading(true);
    setError('');
    try {
      const result = await enrollmentService.enroll(courseId);
      // Fetch enrolled courses again to sync
      await fetchMyCourses();
      return result;
    } catch (apiError) {
      setError(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [fetchMyCourses]);

  const value = {
    courses,
    myCourses,
    loading,
    error,
    fetchCourses,
    fetchMyCourses,
    enrollInCourse
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
}
