
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { AppSettings, Student, Course, Enrollment } from '../types';
import { BookOpenIcon, ClipboardDocumentCheckIcon, BanknotesIcon, CalendarDaysIcon, EnvelopeIcon, ArrowLeftIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { StudentDashboardIcon } from '../constants';

interface StudentDashboardPageProps {
  appSettings: AppSettings;
  students: Student[]; // Added for potential future use (e.g. finding logged in student)
  courses: Course[];   // Added for potential future use
  enrollments: Enrollment[]; // Added for potential future use
}

const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({ appSettings }) => {
  const { appName, collegeLogo } = appSettings;
  // In a real app, you'd fetch the logged-in student's data.
  // const currentStudent = students.find(s => s.id === 'some-logged-in-student-id');

  const placeholderSections = [
    { title: "My Courses", icon: <BookOpenIcon className="h-8 w-8 text-sky-600" />, description: "Access your enrolled courses, materials, and assignments.", link: "#" },
    { title: "Results Preview", icon: <ClipboardDocumentCheckIcon className="h-8 w-8 text-green-600" />, description: "View your latest grades and academic performance.", link: "/results" }, // Link to existing results page
    { title: "Payment Status", icon: <BanknotesIcon className="h-8 w-8 text-purple-600" />, description: "Check your fee payment history and outstanding balances.", link: "#" },
    { title: "Class Schedule", icon: <CalendarDaysIcon className="h-8 w-8 text-indigo-600" />, description: "View your timetable and upcoming classes.", link: "#" },
    { title: "Admin Messages", icon: <EnvelopeIcon className="h-8 w-8 text-red-600" />, description: "Read important messages and announcements from the administration.", link: "#" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-10">
         {collegeLogo ? (
            <img src={collegeLogo} alt={`${appName} Logo`} className="h-20 w-auto object-contain mx-auto mb-2 rounded-md" />
        ) : (
            <AcademicCapIcon className="h-16 w-16 text-sky-600 mx-auto mb-2" />
        )}
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">{appName}</h1>
        <p className="text-2xl text-slate-600 mt-2 flex items-center justify-center">
          <StudentDashboardIcon className="h-8 w-8 mr-2 text-slate-500" /> Student Dashboard
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Could add a welcome message here if student data was available */}
        {/* {currentStudent && <p className="text-xl text-slate-700 mb-6 text-center">Welcome, {currentStudent.firstName}!</p>} */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {placeholderSections.map(section => (
            <Card key={section.title} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <div className="p-5 flex flex-col items-center text-center flex-grow">
                 <div className="p-3 bg-slate-100 rounded-full mb-3">
                    {section.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">{section.title}</h3>
                <p className="text-sm text-slate-500 mb-4 h-12 flex-grow">{section.description}</p>
              </div>
              <div className="p-4 border-t bg-slate-50/50">
                 {section.link === "#" ? (
                     <Button variant="primary" size="sm" className="w-full" onClick={() => alert(`${section.title} - Feature coming soon!`)}>
                        Access {section.title}
                    </Button>
                 ) : (
                    <Link to={section.link} className="block">
                        <Button variant="primary" size="sm" className="w-full">
                            Access {section.title}
                        </Button>
                    </Link>
                 )}
              </div>
            </Card>
          ))}
        </div>
        
         <div className="mt-12 text-center">
            <img src="https://picsum.photos/seed/student-dash/500/300" alt="Student placeholder" className="mx-auto rounded-lg shadow-md mb-4"/>
            <p className="text-slate-500 text-sm">Welcome to your personal dashboard. Manage your studies and stay updated.</p>
        </div>

        <div className="mt-10 text-center">
          <Link to="/login" className="group inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors duration-150">
            <ArrowLeftIcon className="h-4 w-4 mr-1 transition-transform duration-150 group-hover:-translate-x-1" />
            Back to Login / Main Portal
          </Link>
        </div>
      </div>
       <p className="text-center text-xs text-slate-500 mt-12">&copy; {new Date().getFullYear()} {appName}. All rights reserved.</p>
    </div>
  );
};

export default StudentDashboardPage;
