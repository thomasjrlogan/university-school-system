
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import Button from '../components/Button';
import Input from '../components/Input';
import { AppSettings } from '../types'; 
import { AcademicCapIcon, LockClosedIcon, UserIcon, ArrowRightIcon, DocumentMagnifyingGlassIcon, UserPlusIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface LoginPageProps {
  onLoginSuccess: () => void;
  appSettings: AppSettings; 
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, appSettings }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const { appName, collegeAddress, collegePhone, collegeLogo, adminUsername, adminPassword } = appSettings;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 

    const effectiveUsername = adminUsername || 'admin';
    const effectivePassword = adminPassword || 'admin';

    if (usernameInput === effectiveUsername && passwordInput === effectivePassword) { 
      onLoginSuccess();
    } else if (usernameInput !== effectiveUsername) {
      setError('Invalid username. Please try again.');
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 to-slate-800 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md">
         <div className="text-center mb-8">
            {collegeLogo ? (
                <img src={collegeLogo} alt={`${appName} Logo`} className="h-24 w-auto object-contain mx-auto mb-3 rounded-md" />
            ) : (
                <AcademicCapIcon className="h-20 w-20 text-white mx-auto mb-3" />
            )}
            <h1 className="text-4xl font-bold text-white tracking-tight">{appName}</h1>
            <p className="text-sky-200 mt-1">{collegeAddress} | Tel: {collegePhone}</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white shadow-2xl rounded-xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-center text-slate-700 mb-6">Admin Login</h2>
          
          <div>
            <label htmlFor="username" className="sr-only">Username</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                id="username"
                type="text"
                placeholder={`Username (${adminUsername || 'admin'})`}
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
                className="!pl-10" 
                aria-label="Username"
                />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    className="!pl-10" 
                    aria-label="Password"
                />
            </div>
          </div>

          {error && <p role="alert" className="text-sm text-red-600 text-center bg-red-100 p-3 rounded-md">{error}</p>}
          
          <Button type="submit" variant="primary" className="w-full !py-3 !text-base" isLoading={false}>
            Log In
          </Button>

          <div className="text-sm text-center pt-2 space-y-2">
            <Link to="/forgot-password" className="font-medium text-sky-600 hover:text-sky-500 flex items-center justify-center">
                <QuestionMarkCircleIcon className="h-5 w-5 mr-1"/>
                Forgot your password?
            </Link>
            <Link to="/signup" className="font-medium text-sky-600 hover:text-sky-500 flex items-center justify-center">
                <UserPlusIcon className="h-5 w-5 mr-1"/>
                Don't have an account? Sign Up
            </Link>
          </div>
        </form>
        
        <div className="mt-8 text-center space-y-3">
          <Link to="/apply" className="group inline-flex items-center text-sm font-medium text-sky-200 hover:text-white transition-colors duration-150">
            New Applicant? Apply Here
            <ArrowRightIcon className="h-4 w-4 ml-1 transform transition-transform duration-150 group-hover:translate-x-1" />
          </Link>
          <br />
           <Link to="/results" className="group inline-flex items-center text-sm font-medium text-sky-200 hover:text-white transition-colors duration-150">
            <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-1.5" />
            Check Your Results
          </Link>
        </div>

        <p className="text-center text-xs text-slate-300 mt-6">&copy; {new Date().getFullYear()} {appName}. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginPage;
