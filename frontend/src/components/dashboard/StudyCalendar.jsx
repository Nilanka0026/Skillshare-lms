import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  parseISO,
  isWeekend,
  addMonths,
  subMonths
} from 'date-fns';
import Confetti from 'react-confetti';
import { ChevronLeft, ChevronRight, CheckCircle, Calendar as CalendarIcon } from 'lucide-react';

export function StudyCalendar({ myCourses }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showConfetti, setShowConfetti] = useState(false);
  const [schedule, setSchedule] = useState({});
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [hasTodayTasks, setHasTodayTasks] = useState(false);
  
  useEffect(() => {
    const newSchedule = {};
    let tempAllTodayCompleted = true;
    let tempHasTodayTasks = false;
    
    myCourses.forEach(course => {
      // Mark enrollment date
      const enrolledDateStr = format(parseISO(course.enrolledAt || new Date().toISOString()), 'yyyy-MM-dd');
      if (!newSchedule[enrolledDateStr]) newSchedule[enrolledDateStr] = [];
      newSchedule[enrolledDateStr].push({
        type: 'enrollment',
        courseTitle: course.title
      });

      const startDate = parseISO(course.enrolledAt || new Date().toISOString());
      
      const allItems = [
        ...(course.lessons || []).map(l => ({ type: 'lesson', id: l._id, title: l.title })),
        ...(course.quizzes || []).map(q => ({ type: 'quiz', id: q._id, title: q.title }))
      ];
      
      let itemsPerDay = 2; // Suitable workload
      let currentItemIndex = 0;
      let planDate = addDays(new Date(startDate), 1); // Start scheduling day after enrollment
      
      while (currentItemIndex < allItems.length) {
        if (!isWeekend(planDate)) {
          const dateStr = format(planDate, 'yyyy-MM-dd');
          if (!newSchedule[dateStr]) newSchedule[dateStr] = [];
          
          let dayItems = 0;
          while (dayItems < itemsPerDay && currentItemIndex < allItems.length) {
            const item = allItems[currentItemIndex];
            
            let completed = false;
            if (item.type === 'lesson') {
              completed = course.completedLessons?.includes(item.id);
            } else {
              completed = course.quizResults?.some(q => q.quizId === item.id);
            }
            
            newSchedule[dateStr].push({
              type: 'task',
              courseTitle: course.title,
              itemTitle: item.title,
              completed
            });
            
            if (dateStr === format(new Date(), 'yyyy-MM-dd')) {
              tempHasTodayTasks = true;
              if (!completed) tempAllTodayCompleted = false;
            }
            
            currentItemIndex++;
            dayItems++;
          }
        }
        planDate = addDays(planDate, 1);
      }
    });
    
    setSchedule(newSchedule);
    setHasTodayTasks(tempHasTodayTasks);
    
    if (tempHasTodayTasks && tempAllTodayCompleted) {
      setTodayCompleted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000);
    }
  }, [myCourses]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-black text-gray-950 flex items-center gap-2">
          <CalendarIcon className="text-blue-600" /> My Study Plan
        </h2>
        <div className="flex gap-4 items-center">
          <button onClick={prevMonth} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-gray-800 text-lg">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayEvents = schedule[dateStr] || [];
        
        days.push(
          <div 
            key={day} 
            className={`min-h-24 p-2 border border-gray-100 transition flex flex-col ${
              !isSameMonth(day, monthStart)
                ? 'bg-gray-50 text-gray-300'
                : isSameDay(day, new Date())
                ? 'bg-blue-50/50 border-blue-200'
                : 'bg-white text-gray-800 hover:bg-gray-50'
            }`}
          >
            <span className={`font-bold text-sm mb-1 ${isSameDay(day, new Date()) ? 'text-blue-600' : ''}`}>
              {formattedDate} {isSameDay(day, new Date()) && '(Today)'}
            </span>
            <div className="flex flex-col gap-1 flex-1">
              {dayEvents.map((evt, idx) => (
                <div 
                  key={idx} 
                  className={`text-xs p-1 rounded font-medium truncate ${
                    evt.type === 'enrollment' 
                      ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                      : evt.completed 
                        ? 'bg-green-100 text-green-700 border border-green-200 line-through opacity-70' 
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}
                  title={evt.type === 'enrollment' ? `Started: ${evt.courseTitle}` : `${evt.itemTitle} (${evt.courseTitle})`}
                >
                  {evt.type === 'enrollment' ? (
                    <span>🚀 Started {evt.courseTitle}</span>
                  ) : (
                    <span className="flex items-center gap-1">
                      {evt.completed && <CheckCircle size={10} />}
                      {evt.itemTitle}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    
    return <div>{rows}</div>;
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div className="text-center font-bold text-gray-500 text-xs uppercase" key={day}>
            {day}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm overflow-hidden mb-6">
      {showConfetti && <Confetti width={1000} height={500} recycle={false} numberOfPieces={500} />}
      
      {todayCompleted && hasTodayTasks && (
        <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 font-bold z-10 animate-pulse">
          🎉 Congratulations! You have completed all your assigned study targets for today! Time to relax! 🎉
        </div>
      )}
      
      <div className={todayCompleted && hasTodayTasks ? 'mt-8' : ''}>
        {renderHeader()}
        {renderDays()}
        <div className="border-t border-l border-gray-100 rounded-xl overflow-hidden">
          {renderCells()}
        </div>
      </div>
    </div>
  );
}
