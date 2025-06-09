import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Calendar, Coffee, Briefcase, User, Settings, Check, ChevronRight, 
  Mail, Upload, Clock, Trophy, Zap, Target, Brain, Dumbbell, AlertCircle, 
  Loader2, Edit, Send, Filter, Search, Sparkles, Shield, Key, LogIn,
  CheckCircle, X, Eye, EyeOff, Star, Award, Flame, Crown, Heart, Building,
  ChevronLeft, Users, FileText, Activity
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Azure AD Configuration (hardcoded as requested)
const AZURE_CONFIG = {
  clientId: '93def5aa-e3b3-414c-a9b5-d33e6a6c5eb7',
  clientSecret: 'solo-managing-app-secret',
  tenantId: 'dd8cbebb-2139-4df8-b411-4e3e87abeb5c',
  redirectUri: window.location.origin + '/auth/callback',
  scopes: ['User.Read', 'Mail.Send', 'Calendars.ReadWrite', 'Contacts.Read']
};

// Ancient Greek themed styles
const goldGradient = 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)';
const silverGradient = 'linear-gradient(135deg, #C0C0C0 0%, #E5E5E5 50%, #C0C0C0 100%)';
const marblePattern = 'linear-gradient(45deg, #f5f5f5 25%, #ffffff 25%, #ffffff 50%, #f5f5f5 50%, #f5f5f5 75%, #ffffff 75%, #ffffff)';

// Floating gold dust particle component
const GoldDustParticle = ({ delay, duration, startX }) => {
  const style = {
    position: 'absolute',
    left: `${startX}%`,
    top: '-10px',
    width: '3px',
    height: '3px',
    backgroundColor: '#FFD700',
    borderRadius: '50%',
    boxShadow: '0 0 6px #FFD700',
    animation: `float-dust ${duration}s ${delay}s linear infinite`,
    pointerEvents: 'none'
  };
  
  return <div style={style} />;
};

// Gold dust container
const GoldDustEffect = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 10,
    duration: 10 + Math.random() * 10,
    startX: Math.random() * 100
  }));
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
      <style>{`
        @keyframes float-dust {
          0% {
            transform: translateY(-10px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(30px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      {particles.map(p => (
        <GoldDustParticle key={p.id} {...p} />
      ))}
    </div>
  );
};

// API helper with authentication
const api = {
  async request(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include'
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  },
  
  // Auth endpoints
  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  
  async logout() {
    return this.request('/api/auth/logout', { method: 'POST' });
  },
  
  // User endpoints
  async getProfile() {
    return this.request('/api/user/profile');
  },
  
  async getCredentials() {
    return this.request('/api/user/credentials');
  },
  
  async getTaskProgress() {
    return this.request('/api/tasks/progress');
  },
  
  async updatePreferences(preferences) {
    return this.request('/api/user/preferences', {
      method: 'POST',
      body: JSON.stringify(preferences)
    });
  },
  
  async updateCredentials(credentials) {
    return this.request('/api/user/credentials', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  
  // Document endpoints
  async uploadDocument(docData) {
    return this.request('/api/documents/upload', {
      method: 'POST',
      body: JSON.stringify(docData)
    });
  },
  
  async getDocuments(docType) {
    return this.request(`/api/documents/${docType}`);
  },
  
  // Job endpoints
  async searchJobs(searchData) {
    return this.request('/api/jobs/search', {
      method: 'POST',
      body: JSON.stringify(searchData)
    });
  },
  
  async applyToJobs(jobIds) {
    return this.request('/api/jobs/apply', {
      method: 'POST',
      body: JSON.stringify({ jobIds })
    });
  },
  
  async getAppliedJobs(sortBy = 'date') {
    return this.request(`/api/jobs/applied?sortBy=${sortBy}`);
  },
  
  // People endpoints
  async searchPeople(searchData) {
    return this.request('/api/people/search', {
      method: 'POST',
      body: JSON.stringify(searchData)
    });
  },
  
  async draftEmails(contactIds) {
    return this.request('/api/emails/draft', {
      method: 'POST',
      body: JSON.stringify({ contactIds })
    });
  },
  
  async sendEmails(emails) {
    return this.request('/api/emails/send', {
      method: 'POST',
      body: JSON.stringify(emails)
    });
  },
  
  async sendFollowUp(contactedIds) {
    return this.request('/api/emails/follow-up', {
      method: 'POST',
      body: JSON.stringify({ contactedIds })
    });
  },
  
  async getContactedPeople() {
    return this.request('/api/people/contacted');
  },
  
  // Coffee chat endpoints
  async createCoffeeChat(data) {
    return this.request('/api/coffee-chats', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  async addMeetingNotes(chatId, notes) {
    return this.request(`/api/coffee-chats/${chatId}/notes`, {
      method: 'POST',
      body: JSON.stringify(notes)
    });
  },
  
  async sendThankYou(chatId, email) {
    return this.request(`/api/coffee-chats/${chatId}/thank-you`, {
      method: 'POST',
      body: JSON.stringify(email)
    });
  },
  
  // XP endpoint
  async addXp(skill, amount) {
    return this.request('/api/xp/add', {
      method: 'POST',
      body: JSON.stringify({ skill, amount })
    });
  },
  
  // Azure AD endpoints
  async updateAzureCredentials() {
    return this.request('/api/auth/azure/configure', {
      method: 'POST',
      body: JSON.stringify(AZURE_CONFIG)
    });
  },
  
  async getOutlookCalendar() {
    return this.request('/api/outlook/calendar');
  },
  
  async syncOutlookCalendar() {
    return this.request('/api/outlook/calendar/sync', { method: 'POST' });
  },
  
  // Strava endpoints
  async initiateStravaAuth() {
    return this.request('/api/strava/auth');
  },
  
  async handleStravaCallback(code) {
    return this.request('/api/strava/callback', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  }
};

// XP calculation helper
const getXpForLevel = (level) => Math.floor(100 * Math.pow(1.5, level - 1));

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [taskProgress, setTaskProgress] = useState(null);
  
  // Persistent state across tabs
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState({
    resume: null,
    cover_letter_template: null
  });
  const [people, setPeople] = useState([]);
  const [contactedPeople, setContactedPeople] = useState([]);
  const [jobFilters, setJobFilters] = useState({
    industry: '',
    city: '',
    company: '',
    role: ''
  });
  const [peopleFilters, setPeopleFilters] = useState({
    company: '',
    location: '',
    school: '',
    title: ''
  });
  const [emailDrafts, setEmailDrafts] = useState([]);
  const [headlessBrowsing, setHeadlessBrowsing] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  // Load user profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Handle Azure AD callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname;
    
    // Handle direct Azure callback route
    if (currentPath === '/auth/callback') {
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      
      if (code && isLoggedIn) {
        // Send the authorization code to backend
        fetch(`${API_URL}/api/auth/azure/callback?code=${code}`, {
          method: 'GET',
          credentials: 'include'
        })
        .then(response => {
          if (response.ok) {
            showNotificationMessage('✅ Microsoft Outlook connected successfully!');
            // Redirect to calendar page
            window.location.href = '/?connected=azure&page=calendar';
          } else {
            return response.json().then(data => {
              showNotificationMessage(`⚠️ Error connecting Outlook: ${data.error || 'Unknown error'}`);
              window.location.href = '/';
            });
          }
        })
        .catch(error => {
          console.error('Azure callback error:', error);
          showNotificationMessage('⚠️ Error connecting Outlook');
          window.location.href = '/';
        });
      } else if (error) {
        showNotificationMessage(`⚠️ OAuth error: ${error}`);
        window.location.href = '/';
      } else if (!isLoggedIn) {
        // Store the code in sessionStorage and redirect to login
        sessionStorage.setItem('pendingAzureCode', code);
        showNotificationMessage('Please log in to complete Outlook connection');
        window.location.href = '/';
      }
      return; // Exit early for direct callback handling
    }
    
    // Handle existing URL parameter-based callbacks
    const azureConnected = urlParams.get('connected');
    const azureError = urlParams.get('error');
    const authRequired = urlParams.get('auth_required');
    const stravaCode = urlParams.get('code');
    const pageParam = urlParams.get('page');
    
    // Check for pending Azure code after login
    if (isLoggedIn && !azureConnected) {
      const pendingCode = sessionStorage.getItem('pendingAzureCode');
      if (pendingCode) {
        sessionStorage.removeItem('pendingAzureCode');
        // Process the pending code
        fetch(`${API_URL}/api/auth/azure/callback?code=${pendingCode}`, {
          method: 'GET',
          credentials: 'include'
        })
        .then(response => {
          if (response.ok) {
            showNotificationMessage('✅ Microsoft Outlook connected successfully!');
            // Clear URL params but keep calendar page active
            window.history.replaceState({}, document.title, '/');
            setActivePage('calendar');
            loadProfile();
          }
        })
        .catch(error => {
          console.error('Pending Azure callback error:', error);
        });
      }
    }
    
    // Handle Azure AD connection success
    if (azureConnected === 'azure' && isLoggedIn) {
      // Check if we need to apply session tokens
      if (authRequired === 'true') {
        api.request('/api/auth/azure/check-session', { method: 'POST' })
          .then(async () => {
            showNotificationMessage('✅ Microsoft Outlook connected successfully!');
            // Clear URL params but preserve page state
            window.history.replaceState({}, document.title, '/');
            // Reload user profile to get updated tokens
            await loadProfile();
            // Force navigation to calendar page after profile is loaded
            setTimeout(() => {
              setActivePage('calendar');
            }, 100);
          })
          .catch((error) => {
            console.error('Session token check error:', error);
            showNotificationMessage('⚠️ Error applying session tokens');
          });
      } else {
        showNotificationMessage('✅ Microsoft Outlook connected successfully!');
        // Clear URL params but preserve page state
        window.history.replaceState({}, document.title, '/');
        // Reload user profile to get updated tokens first
        loadProfile().then(() => {
          // Force navigation to calendar page after profile is loaded
          setTimeout(() => {
            setActivePage('calendar');
          }, 100);
        });
      }
    }
    
    // Handle page parameter to navigate to specific page
    if (pageParam === 'calendar' && !azureConnected) {
      setActivePage('calendar');
    }
    
    // Handle Azure AD error
    if (azureError) {
      showNotificationMessage(`⚠️ Error connecting Outlook: ${azureError}`);
      // Clear URL params
      window.history.replaceState({}, document.title, '/');
    }
    
    // Handle Strava callback  
    if (stravaCode && isLoggedIn && window.location.pathname !== '/auth/callback' && !azureConnected) {
      handleStravaCallback(stravaCode);
    }
  }, [isLoggedIn]);

  const loadProfile = async () => {
    try {
      const userProfile = await api.getProfile();
      setUser(userProfile);
      setIsLoggedIn(true);
      
      // Set job display preferences from user profile
      if (userProfile.jobPreferences) {
        setJobFilters({
          industry: userProfile.jobPreferences.industries?.[0] || '',
          city: userProfile.jobPreferences.cities?.[0] || '',
          company: userProfile.jobPreferences.firms?.[0] || '',
          role: userProfile.jobPreferences.roles?.[0] || ''
        });
      }
      
      // Set people search preferences from user profile
      if (userProfile.coffeeChatPreferences) {
        setPeopleFilters({
          company: userProfile.coffeeChatPreferences.firms?.[0] || '',
          location: userProfile.coffeeChatPreferences.cities?.[0] || '',
          school: userProfile.coffeeChatPreferences.schools?.[0] || '',
          title: userProfile.coffeeChatPreferences.titles?.[0] || ''
        });
      }
      
      // Set headless browsing preference from user profile
      setHeadlessBrowsing(userProfile.headlessBrowsing ?? true);
      
      // Load task progress
      const progress = await api.getTaskProgress();
      setTaskProgress(progress);
      
      // Configure Azure AD on login
      await api.updateAzureCredentials();
      
    } catch (error) {
      console.error('Error loading profile:', error);
      
      // AUTO-LOGIN: If profile load fails, automatically log in with hardcoded credentials
      console.log('Auto-logging in with default credentials...');
      try {
        // First try to login
        const loginResult = await api.login({
          email: 'maxwell.prizant@yale.edu',
          password: 'solo-max-2025'
        });
        
        if (loginResult.user) {
          setUser(loginResult.user);
          setIsLoggedIn(true);
          
          // Load all the user preferences after successful login
          if (loginResult.user.jobPreferences) {
            setJobFilters({
              industry: loginResult.user.jobPreferences.industries?.[0] || '',
              city: loginResult.user.jobPreferences.cities?.[0] || '',
              company: loginResult.user.jobPreferences.firms?.[0] || '',
              role: loginResult.user.jobPreferences.roles?.[0] || ''
            });
          }
          
          if (loginResult.user.coffeeChatPreferences) {
            setPeopleFilters({
              company: loginResult.user.coffeeChatPreferences.firms?.[0] || '',
              location: loginResult.user.coffeeChatPreferences.cities?.[0] || '',
              school: loginResult.user.coffeeChatPreferences.schools?.[0] || '',
              title: loginResult.user.coffeeChatPreferences.titles?.[0] || ''
            });
          }
          
          setHeadlessBrowsing(loginResult.user.headlessBrowsing ?? true);
          
          // Load task progress
          const progress = await api.getTaskProgress();
          setTaskProgress(progress);
          
          // Configure Azure AD
          await api.updateAzureCredentials();
          
          showNotificationMessage('✅ Auto-login successful!');
        }
      } catch (loginError) {
        // If login fails, try to register the user
        console.log('Login failed, attempting to create account...');
        try {
          const registerResult = await api.register({
            username: 'Maxwell Prizant',
            email: 'maxwell.prizant@yale.edu',
            password: 'solo-max-2025'
          });
          
          if (registerResult.user) {
            setUser(registerResult.user);
            setIsLoggedIn(true);
            
            // Set default preferences for new user
            setJobFilters({
              industry: '',
              city: 'New York',
              company: '',
              role: 'Consultant'
            });
            
            setPeopleFilters({
              company: '',
              location: 'New York',
              school: 'Yale',
              title: ''
            });
            
            setHeadlessBrowsing(true);
            
            // Load task progress
            const progress = await api.getTaskProgress();
            setTaskProgress(progress);
            
            // Configure Azure AD
            await api.updateAzureCredentials();
            
            showNotificationMessage('✅ Account created and logged in automatically!');
          }
        } catch (registerError) {
          console.error('Auto-registration failed:', registerError);
          // If both login and registration fail, show the login screen
          setIsLoggedIn(false);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStravaCallback = async (code) => {
    try {
      await api.handleStravaCallback(code);
      showNotificationMessage('✅ Strava connected successfully!');
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
      // Reload profile to get updated status
      await loadProfile();
    } catch (error) {
      showNotificationMessage('⚠️ Error connecting Strava');
    }
  };

  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleAzureCallback = async (code) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/azure/callback?code=${code}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        showNotificationMessage('✅ Outlook connected successfully!');
        // Clear URL params and redirect to calendar page
        window.history.replaceState({}, document.title, '/');
        setActivePage('calendar');
        // Reload profile to get updated status
        await loadProfile();
      } else {
        const errorData = await response.json();
        showNotificationMessage('⚠️ Error connecting Outlook: ' + (errorData.details || errorData.error));
        console.error('Azure callback error:', errorData);
      }
    } catch (error) {
      showNotificationMessage('⚠️ Error connecting Outlook');
      console.error('Azure callback error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: marblePattern }}>
        <div className="text-center">
          <Crown className="w-16 h-16 mx-auto mb-4" style={{ color: '#FFD700' }} />
          <Loader2 className="w-8 h-8 mx-auto animate-spin" style={{ color: '#FFD700' }} />
          <p className="mt-4 text-gray-600">Loading your odyssey...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={(userData) => {
      setUser(userData);
      setIsLoggedIn(true);
    }} />;
  }

  return (
    <div className="min-h-screen" style={{ background: marblePattern }}>
      <GoldDustEffect />
      
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4" style={{ borderColor: '#FFD700' }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Crown className="w-10 h-10" style={{ color: '#FFD700' }} />
              <div>
                <h1 className="text-2xl font-bold" style={{ 
                  background: goldGradient, 
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Solo Max
                </h1>
                <p className="text-sm text-gray-600">Odyssey of Excellence</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Level</p>
                <p className="text-2xl font-bold" style={{ color: '#FFD700' }}>
                  {user?.totalLevel || 1}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md px-6 py-2" style={{ borderBottom: '2px solid #FFD700' }}>
        <div className="flex space-x-8">
          {[
            { id: 'home', label: 'Pantheon', icon: Home },
            { id: 'careers', label: 'Jobs', icon: Briefcase },
            { id: 'coffee', label: 'Symposium', icon: Coffee },
            { id: 'marathon', label: 'Marathon', icon: Activity },
            { id: 'calendar', label: 'Chronicle', icon: Calendar },
            { id: 'profile', label: 'Hero', icon: User },
            { id: 'settings', label: 'Temple', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activePage === id 
                  ? 'text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={activePage === id ? { background: goldGradient } : {}}
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activePage === 'home' && <HomePage user={user} taskProgress={taskProgress} />}
        {activePage === 'careers' && <CareersPage 
          user={user} 
          onNotification={showNotificationMessage} 
          jobs={jobs} 
          setJobs={setJobs} 
          appliedJobs={appliedJobs} 
          setAppliedJobs={setAppliedJobs} 
          uploadedDocuments={uploadedDocuments} 
          setUploadedDocuments={setUploadedDocuments} 
          jobFilters={jobFilters} 
          setJobFilters={setJobFilters} 
          loadProfile={loadProfile}
        />}
        {activePage === 'coffee' && <CoffeeChatPage 
          user={user} 
          onNotification={showNotificationMessage} 
          people={people} 
          setPeople={setPeople} 
          contactedPeople={contactedPeople} 
          setContactedPeople={setContactedPeople} 
          peopleFilters={peopleFilters} 
          setPeopleFilters={setPeopleFilters} 
          emailDrafts={emailDrafts}
          setEmailDrafts={setEmailDrafts}
        />}
        {activePage === 'marathon' && <MarathonPage user={user} onNotification={showNotificationMessage} />}
        {activePage === 'calendar' && <CalendarPage user={user} onNotification={showNotificationMessage} />}
        {activePage === 'profile' && <ProfilePage user={user} />}
        {activePage === 'settings' && <SettingsPage 
          user={user} 
          onUpdate={loadProfile} 
          headlessBrowsing={headlessBrowsing}
          setHeadlessBrowsing={setHeadlessBrowsing}
        />}
      </main>

      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 text-white"
             style={{ background: goldGradient }}>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>{notificationMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Login Page Component
const LoginPage = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = isRegistering 
        ? await api.register(formData)
        : await api.login({ email: formData.email, password: formData.password });
      
      onLogin(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: marblePattern }}>
      <GoldDustEffect />
      
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md" 
           style={{ border: '3px solid #FFD700' }}>
        <div className="text-center mb-8">
          <Crown className="w-16 h-16 mx-auto mb-4" style={{ color: '#FFD700' }} />
          <h1 className="text-3xl font-bold mb-2" style={{ 
            background: goldGradient, 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Solo Max
          </h1>
          <p className="text-gray-600">Begin your legendary journey</p>
        </div>

        <div className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Name
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: '#FFD700', focusRingColor: '#FFD700' }}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Scroll
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: '#FFD700' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secret Key
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: '#FFD700' }}
              required
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 rounded-lg text-white font-bold transition-all transform hover:scale-105 disabled:opacity-50"
            style={{ background: goldGradient }}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 mx-auto animate-spin" />
            ) : (
              isRegistering ? 'Create Legend' : 'Enter Pantheon'
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm hover:underline"
            style={{ color: '#FFD700' }}
          >
            {isRegistering 
              ? 'Already a hero? Sign in' 
              : 'New to the odyssey? Create account'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Home Page Component with Radar Chart
const HomePage = ({ user, taskProgress }) => {
  const [dailyTasks, setDailyTasks] = useState([]);
  
  useEffect(() => {
    if (taskProgress && user) {
      const fitnessLevel = user.skills?.fitness?.level || 1;
      const requiredMiles = Math.min(fitnessLevel, 10);
      const milesRun = taskProgress.dailyProgress?.miles_run || 0;
      const emailsSent = taskProgress.dailyProgress?.emails_sent || 0;
      const jobsApplied = taskProgress.dailyProgress?.jobs_applied || 0;
      
      setDailyTasks([
        {
          id: 'workout',
          skill: 'fitness',
          description: `Run ${requiredMiles} miles`,
          progress: `${milesRun}/${requiredMiles}`,
          completed: milesRun >= requiredMiles,
          xp: 50,
          icon: Dumbbell
        },
        {
          id: 'emails',
          skill: 'networking',
          description: 'Send 3 Alliance Messages',
          progress: `${emailsSent}/3`,
          completed: emailsSent >= 3,
          xp: 30,
          icon: Mail
        },
        {
          id: 'jobs',
          skill: 'careers',
          description: 'Apply to 10 Jobs',
          progress: `${jobsApplied}/10`,
          completed: jobsApplied >= 10,
          xp: 40,
          icon: Briefcase
        },
        {
          id: 'relationships',
          skill: 'relationships',
          description: 'Strengthen Bonds',
          completed: false,
          xp: 40,
          icon: Heart
        }
      ]);
    }
  }, [taskProgress, user]);

  // Prepare data for radar chart
  const radarData = user?.skills ? Object.entries(user.skills).map(([skill, data]) => ({
    skill: skill.charAt(0).toUpperCase() + skill.slice(1),
    value: data.level / 10, // Normalize to 0-1
    fullMark: 1
  })) : [];

  const renderSkillBar = (skill, data) => {
    const requiredXp = getXpForLevel(data.level);
    const progress = (data.xp / requiredXp) * 100;
    const icons = {
      networking: Mail,
      relationships: Heart,
      careers: Briefcase,
      fitness: Dumbbell,
      mental: Target
    };
    const Icon = icons[skill];

    return (
      <div key={skill} className="bg-white rounded-lg p-4 shadow-md" 
           style={{ border: '2px solid #E5E5E5' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full" style={{ background: silverGradient }}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold capitalize">{skill}</span>
            <span className="text-sm px-2 py-1 rounded-full text-white"
                  style={{ background: goldGradient }}>
              Level {data.level}
            </span>
          </div>
          <Award className="w-5 h-5" style={{ color: '#FFD700' }} />
        </div>
        
        <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full transition-all duration-500"
            style={{ 
              width: `${progress}%`,
              background: goldGradient
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
            {data.xp} / {requiredXp} XP
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Stats with Radar Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6" 
           style={{ border: '3px solid #FFD700' }}>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">
            Welcome, Maxwell Prizant
          </h2>
          <p className="text-gray-600">
            Your destiny awaits. Every quest completed brings you closer to legendary status.
          </p>
        </div>

        {/* Radar Chart */}
        <div className="flex justify-center mb-6">
          <div style={{ width: '400px', height: '400px', border: '2px solid #C0C0C0', borderRadius: '50%', padding: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid 
                  gridType="polygon" 
                  radialLines={true}
                  stroke="#C0C0C0"
                />
                <PolarAngleAxis 
                  dataKey="skill" 
                  tick={{ fill: '#666', fontSize: 14 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 1]} 
                  tickCount={6}
                  tick={{ fill: '#666', fontSize: 12 }}
                />
                <Radar 
                  name="Skills" 
                  dataKey="value" 
                  stroke="#FFD700" 
                  fill="#FFD700" 
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
              </div>
            </div>

        {/* Content Box */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <h3 className="text-white font-bold mb-2">Content</h3>
          <p className="text-white text-lg">
            You are on a legendary quest to master all domains of excellence. 
            Each skill represents a pillar of your journey to becoming an apex professional.
          </p>
        </div>
      </div>

      {/* Daily Quests */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-4 flex items-center">
          <Flame className="w-6 h-6 mr-2" style={{ color: '#FFD700' }} />
          Daily Quests
        </h3>
        
        <div className="space-y-3">
          {dailyTasks.map(task => {
            const Icon = task.icon;
            return (
              <div key={task.id} 
                   className="flex items-center justify-between bg-gray-50 rounded-lg p-4 transition-all hover:shadow-md"
                   style={{ 
                     border: task.completed ? '2px solid #10B981' : '2px solid #E5E5E5',
                     opacity: task.completed ? 0.7 : 1
                   }}>
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`}>
                    {task.completed && <Check className="w-5 h-5 text-white" />}
                  </div>
                  <Icon className="w-5 h-5" style={{ color: task.completed ? '#10B981' : '#6B7280' }} />
                  <span className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                    {task.description}
                  </span>
                  {task.progress && (
                    <span className="text-sm text-gray-600">({task.progress})</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" style={{ color: '#FFD700' }} />
                  <span className="font-bold" style={{ color: '#FFD700' }}>
                    {task.xp} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {user?.hasStravaToken === false && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ Connect Strava in Settings to automatically track your running progress!
            </p>
          </div>
        )}
      </div>

      {/* Skill Progress */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-4 flex items-center">
          <Trophy className="w-6 h-6 mr-2" style={{ color: '#FFD700' }} />
          Skill Mastery
        </h3>
        
        <div className="space-y-4">
          {Object.entries(user?.skills || {}).map(([skill, data]) => 
            renderSkillBar(skill, data)
          )}
        </div>
      </div>

      {/* Wisdom Quote */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl shadow-lg p-6 text-center"
           style={{ border: '2px solid #FFD700' }}>
        <Star className="w-8 h-8 mx-auto mb-3" style={{ color: '#FFD700' }} />
        <p className="text-lg font-semibold italic">
          "Excellence is not a gift, but a skill that takes practice. 
          We do not act rightly because we have virtue or excellence, 
          but we rather have those because we have acted rightly."
        </p>
        <p className="text-sm text-gray-600 mt-2">- Aristotle</p>
      </div>
    </div>
  );
};

// Careers Page Component
const CareersPage = ({ user, onNotification, jobs, setJobs, appliedJobs, setAppliedJobs, uploadedDocuments, setUploadedDocuments, jobFilters, setJobFilters, loadProfile }) => {
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [jobDisplayCount, setJobDisplayCount] = useState(user?.job_display_count || user?.jobDisplayCount || 5);
  const [activeTab, setActiveTab] = useState('available');
  const [sortBy, setSortBy] = useState('date');
  const [dragActive, setDragActive] = useState(false);
  const [dragTarget, setDragTarget] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  // Update job display count when user changes
  useEffect(() => {
    if (user?.job_display_count !== undefined) {
      setJobDisplayCount(user.job_display_count);
    }
  }, [user?.job_display_count]);

  useEffect(() => {
    if (activeTab === 'applied') {
      loadAppliedJobs();
    }
  }, [activeTab, sortBy]);

  const loadAppliedJobs = async () => {
    try {
      const data = await api.getAppliedJobs(sortBy);
      setAppliedJobs(data);
    } catch (error) {
      console.error('Error loading applied jobs:', error);
    }
  };

  const handleApplyToSelected = async () => {
    if (selectedJobs.length === 0) {
      onNotification('⚔️ Select jobs to conquer!');
      return;
    }

    setIsApplying(true);
    try {
      const result = await api.applyToJobs(selectedJobs);
      
      // Show main notification
      onNotification(`✅ Applied to ${result.newApplications} jobs!`);
      
      // Show task notifications
      if (result.notifications && result.notifications.length > 0) {
        result.notifications.forEach(notif => onNotification(notif));
      }
      
      // Show XP awards
      if (result.xpAwarded && Object.keys(result.xpAwarded).length > 0) {
        Object.entries(result.xpAwarded).forEach(([skill, xp]) => {
          onNotification(`⚡ +${xp} XP in ${skill}!`);
        });
      }
      
      // Clear selected jobs
      setSelectedJobs([]);
      
      // Reload applied jobs
      await loadAppliedJobs();
      
      // Update user profile to get new XP and task progress
      await loadProfile();
      
      // Search for new jobs to replace the ones we applied to
      await searchJobs();
    } catch (error) {
      onNotification('⚠️ Error applying to jobs');
    } finally {
      setIsApplying(false);
    }
  };

  const handleApplyToAll = async () => {
    if (jobs.length === 0) {
      onNotification('📜 No jobs to apply to!');
      return;
    }

    setIsApplying(true);
    try {
      const allJobIds = jobs.map(job => job.id);
      const result = await api.applyToJobs(allJobIds);
      
      // Show main notification
      onNotification(`✅ Applied to ${result.newApplications} jobs!`);
      
      // Show task notifications
      if (result.notifications && result.notifications.length > 0) {
        result.notifications.forEach(notif => onNotification(notif));
      }
      
      // Show XP awards
      if (result.xpAwarded && Object.keys(result.xpAwarded).length > 0) {
        Object.entries(result.xpAwarded).forEach(([skill, xp]) => {
          onNotification(`⚡ +${xp} XP in ${skill}!`);
        });
      }
      
      // Clear jobs and selections
      setSelectedJobs([]);
      
      // Reload applied jobs
      await loadAppliedJobs();
      
      // Update user profile to get new XP and task progress
      await loadProfile();
      
      // Search for new jobs to replace all
      await searchJobs();
    } catch (error) {
      onNotification('⚠️ Error applying to jobs');
    } finally {
      setIsApplying(false);
    }
  };

  const handleApplySingle = async (jobId) => {
    setIsApplying(true);
    // Add this job to applied list immediately for UI feedback
    setAppliedJobIds([...appliedJobIds, jobId]);
    
    try {
      const result = await api.applyToJobs([jobId]);
      
      // Show main notification
      const successfulApplications = result.totalApplied || 0;
      if (successfulApplications > 0) {
        onNotification(`✅ Applied to job successfully!`);
        
        // Show XP awards
        if (result.xpAwarded && Object.keys(result.xpAwarded).length > 0) {
          Object.entries(result.xpAwarded).forEach(([skill, xp]) => {
            onNotification(`⚡ +${xp} XP in ${skill}!`);
          });
        }
        
        // Update task progress notification
        if (result.taskProgress?.jobsApplied >= 10) {
          onNotification("🎉 Well done! You've completed your daily job application task!");
        }
      } else {
        // Remove from applied list if failed
        setAppliedJobIds(appliedJobIds.filter(id => id !== jobId));
        onNotification('⚠️ Error applying to job');
      }
      
      // Remove this job from selected if it was selected
      setSelectedJobs(selectedJobs.filter(id => id !== jobId));
      
      // Update user profile to get new XP and task progress
      await loadProfile();
      
    } catch (error) {
      // Remove from applied list if failed
      setAppliedJobIds(appliedJobIds.filter(id => id !== jobId));
      onNotification('⚠️ Error applying to job');
    } finally {
      setIsApplying(false);
    }
  };

  const searchJobs = async () => {
    setIsLoading(true);
    try {
      const searchData = {
        sources: ['linkedin', '12twenty', 'google'],
        filters: Object.fromEntries(
          Object.entries(jobFilters).filter(([_, v]) => v !== '')
        )
      };
      
      const result = await api.searchJobs(searchData);
      // Sort jobs by relevance score (highest first) before slicing
      const sortedJobs = result.jobs.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      // Use the thermometer value for job display count
      setJobs(sortedJobs.slice(0, jobDisplayCount));
      onNotification(`🔍 Found ${result.total} jobs matching your destiny!`);
    } catch (error) {
      onNotification('⚠️ Error searching for jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e, target) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
      setDragTarget(target);
    } else if (e.type === "dragleave") {
      // Only reset if we're leaving the actual drop zone
      if (e.target === e.currentTarget) {
        setDragActive(false);
        setDragTarget(null);
      }
    }
  };

  const handleDrop = async (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setDragTarget(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await handleFileUpload(file, type);
    }
  };

  const handleFileUpload = async (file, type) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      const content = event.target.result;
      
      try {
        await api.uploadDocument({
          docType: type,
          filename: file.name,
          content: content.split(',')[1] // Remove data:... prefix
        });
        
        if (type === 'resume') {
          setUploadedDocuments({ ...uploadedDocuments, resume: file });
        } else {
          setUploadedDocuments({ ...uploadedDocuments, cover_letter_template: file });
        }
        
        onNotification(`📜 ${type === 'resume' ? 'Resume' : 'Cover Letter'} scroll uploaded!`);
      } catch (error) {
        onNotification('⚠️ Error uploading scroll');
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handleFileClick = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileUpload(e.target.files[0], type);
      }
    };
    input.click();
  };

  const handleJobDisplayCountChange = async (newCount) => {
    setJobDisplayCount(newCount);
    // Save user preference
    try {
      await api.updatePreferences({ jobDisplayCount: newCount });
    } catch (error) {
      console.error('Error saving job display count:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Job Board Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6" 
           style={{ border: '3px solid #FFD700' }}>
        <h2 className="text-3xl font-bold mb-4 flex items-center">
          <Briefcase className="w-8 h-8 mr-3" style={{ color: '#FFD700' }} />
          Job Board
          <span className="ml-auto text-sm font-normal text-gray-600 flex items-center">
            <Sparkles className="w-4 h-4 mr-1" style={{ color: '#FFD700' }} />
            AI-Sorted by Relevance
          </span>
        </h2>

        {/* Tab Switcher */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'available' ? 'text-white' : 'text-gray-600'
            }`}
            style={{ 
              background: activeTab === 'available' ? goldGradient : '#E5E5E5' 
            }}
          >
            Available Jobs
          </button>
          <button
            onClick={() => setActiveTab('applied')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'applied' ? 'text-white' : 'text-gray-600'
            }`}
            style={{ 
              background: activeTab === 'applied' ? goldGradient : '#E5E5E5' 
            }}
          >
            Applied Jobs ({appliedJobs.length})
          </button>
        </div>

        {/* Filters - Only show for available jobs */}
        {activeTab === 'available' && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <input
                type="text"
                placeholder="Industry"
                value={jobFilters.industry}
                onChange={(e) => setJobFilters({...jobFilters, industry: e.target.value})}
                className="px-4 py-2 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: '#E5E5E5' }}
              />
              <input
                type="text"
                placeholder="City"
                value={jobFilters.city}
                onChange={(e) => setJobFilters({...jobFilters, city: e.target.value})}
                className="px-4 py-2 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: '#E5E5E5' }}
              />
              <input
                type="text"
                placeholder="Guild (Company)"
                value={jobFilters.company}
                onChange={(e) => setJobFilters({...jobFilters, company: e.target.value})}
                className="px-4 py-2 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: '#E5E5E5' }}
              />
              <input
                type="text"
                placeholder="Role"
                value={jobFilters.role}
                onChange={(e) => setJobFilters({...jobFilters, role: e.target.value})}
                className="px-4 py-2 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: '#E5E5E5' }}
              />
            </div>

            {/* Job Count Slider */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="font-medium">Job Display:</span>
              <input
                type="range"
                min="1"
                max={user?.totalLevel >= 10 ? "20" : "10"}
                value={jobDisplayCount}
                onChange={(e) => handleJobDisplayCountChange(parseInt(e.target.value))}
                className="flex-1"
                style={{ accentColor: '#FFD700' }}
              />
              <span className="font-bold text-white px-3 py-1 rounded-full"
                    style={{ background: goldGradient }}>
                {jobDisplayCount}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mb-6">
              <button
                onClick={searchJobs}
                disabled={isLoading}
                className="px-6 py-3 rounded-xl font-semibold transition-all"
                style={{
                  background: goldGradient,
                  color: 'white',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? '🔍 Discovering...' : '🔍 Discover Jobs'}
              </button>

              {jobs.length > 0 && (
                <>
                  <button
                    onClick={() => handleApplyToSelected()}
                    disabled={selectedJobs.length === 0 || isApplying}
                    className="px-6 py-3 rounded-xl font-semibold transition-all bg-blue-600 text-white disabled:opacity-50"
                  >
                    {isApplying ? '⏳ Applying...' : `📋 Apply to Selected (${selectedJobs.length})`}
                  </button>
                  
                  <button
                    onClick={() => handleApplyToAll()}
                    disabled={jobs.length === 0 || isApplying}
                    className="px-6 py-3 rounded-xl font-semibold transition-all bg-green-600 text-white disabled:opacity-50"
                  >
                    {isApplying ? '⏳ Applying...' : `🚀 Apply to All (${jobs.length})`}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Jobs Display */}
      {activeTab === 'available' ? (
        <div className="bg-white rounded-2xl shadow-lg p-6" 
             style={{ border: '2px solid #E5E5E5' }}>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-xl font-bold">Available Jobs</h3>
            {selectedJobs.length > 0 && (
              <div className="flex space-x-4">
                <button
                  onClick={handleApplyToSelected}
                  disabled={isApplying}
                  className="px-6 py-2 rounded-lg text-white font-bold transition-all transform hover:scale-105"
                  style={{ background: goldGradient }}
                >
                  {isApplying ? 'Applying...' : `Apply to ${selectedJobs.length} Selected`}
                </button>
                <button
                  onClick={() => setSelectedJobs(jobs.map(j => j.id))}
                  className="px-6 py-2 rounded-lg font-bold"
                  style={{ background: silverGradient }}
                >
                  Select All
                </button>
              </div>
            )}
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No jobs discovered yet.</p>
              <p className="text-sm text-gray-500 mt-2">Use the search above to find your destiny!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-white p-6 rounded-xl shadow-lg border-l-4" 
                     style={{ borderColor: '#FFD700' }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedJobs([...selectedJobs, job.id]);
                          } else {
                            setSelectedJobs(selectedJobs.filter(id => id !== job.id));
                          }
                        }}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-lg font-bold text-gray-800">{job.role}</h3>
                          {/* AI Relevance Score Display */}
                          {job.relevanceScore !== undefined && (
                            <div className="flex items-center space-x-2 ml-4">
                              {/* Star visual that fills based on percentage */}
                              <div className="relative">
                                <Star className="w-6 h-6 text-gray-300" fill="#E5E5E5" />
                                <div className="absolute top-0 left-0 overflow-hidden" 
                                     style={{ width: `${job.relevanceScore * 100}%` }}>
                                  <Star className="w-6 h-6" fill="#FFD700" stroke="#FFD700" />
                                </div>
                              </div>
                              
                              <div className="flex items-center px-3 py-1 rounded-full text-sm font-semibold"
                                   style={{
                                     background: job.relevanceScore >= 0.8 ? goldGradient : 
                                               job.relevanceScore >= 0.6 ? silverGradient : 
                                               '#E5E5E5',
                                     color: job.relevanceScore >= 0.6 ? 'white' : '#666'
                                   }}>
                                {Math.round(job.relevanceScore * 100)}% Match
                              </div>
                              {job.relevanceScore >= 0.8 && (
                                <span className="text-xs text-yellow-600 font-semibold">🔥 AI Recommended</span>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 font-medium">{job.company}</p>
                        <p className="text-gray-500">{job.location}</p>
                        <p className="text-sm text-gray-500 mt-2">{job.source}</p>
                        {job.description && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                        )}
                        {job.requires_cover_letter && (
                          <div className="flex items-center text-sm text-yellow-600 mt-2">
                            <FileText className="w-4 h-4 mr-1" />
                            Cover Letter Required
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4 flex flex-col space-y-2">
                      <a 
                        href={job.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg text-white font-bold text-center transition-all transform hover:scale-105"
                        style={{ background: goldGradient }}
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleApplySingle(job.id)}
                        disabled={isApplying || appliedJobIds.includes(job.id)}
                        className={`px-4 py-2 rounded-lg font-bold text-center transition-all transform hover:scale-105 ${
                          appliedJobIds.includes(job.id) 
                            ? 'bg-green-500 text-white cursor-not-allowed' 
                            : 'text-white'
                        }`}
                        style={{ 
                          background: appliedJobIds.includes(job.id) ? undefined : silverGradient 
                        }}
                      >
                        {appliedJobIds.includes(job.id) ? '✓ Applied' : 'Apply'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6" 
             style={{ border: '2px solid #E5E5E5' }}>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-xl font-bold">Completed Jobs</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border-2"
              style={{ borderColor: '#E5E5E5' }}
            >
              <option value="date">Sort by Date</option>
              <option value="company">Sort by Company</option>
              <option value="industry">Sort by Industry</option>
            </select>
          </div>

          {appliedJobs.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No completed jobs yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appliedJobs.map(app => (
                <div key={app.id} 
                     className="p-4 rounded-lg border-2"
                     style={{ borderColor: '#E5E5E5' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg">{app.job.role}</h4>
                      <p className="text-gray-600">{app.job.company}</p>
                      <p className="text-sm text-gray-500">{app.job.location}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 mx-auto" style={{ color: '#10B981' }} />
                      <span className="text-sm text-green-600">Applied</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Document Upload */}
      <div className="bg-white rounded-2xl shadow-lg p-6" 
           style={{ border: '2px solid #E5E5E5' }}>
        <h3 className="text-xl font-bold mb-4">Sacred Scrolls</h3>
        <div className="grid grid-cols-2 gap-6">
          <div
            onClick={() => handleFileClick('resume')}
            onDragEnter={(e) => handleDrag(e, 'resume')}
            onDragLeave={(e) => handleDrag(e, 'resume')}
            onDragOver={(e) => handleDrag(e, 'resume')}
            onDrop={(e) => handleDrop(e, 'resume')}
            className={`border-3 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer hover:bg-teal-50`}
            style={{ 
              borderColor: uploadedDocuments.resume ? '#10B981' : '#E5E5E5',
              backgroundColor: uploadedDocuments.resume ? '#DCFCE7' : (dragActive && dragTarget === 'resume' ? '#CCFBF1' : '#F9FAFB')
            }}
          >
            <Upload className="w-12 h-12 mx-auto mb-3" 
                    style={{ color: uploadedDocuments.resume ? '#10B981' : '#9CA3AF' }} />
            <p className="font-semibold mb-1">Resume Scroll</p>
            <p className="text-sm text-gray-600">
              {uploadedDocuments.resume ? `✓ ${uploadedDocuments.resume.name}` : 'Drag & Drop or Click'}
            </p>
          </div>

          <div
            onClick={() => handleFileClick('cover_letter_template')}
            onDragEnter={(e) => handleDrag(e, 'cover_letter')}
            onDragLeave={(e) => handleDrag(e, 'cover_letter')}
            onDragOver={(e) => handleDrag(e, 'cover_letter')}
            onDrop={(e) => handleDrop(e, 'cover_letter_template')}
            className={`border-3 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer hover:bg-teal-50`}
            style={{ 
              borderColor: uploadedDocuments.cover_letter_template ? '#10B981' : '#E5E5E5',
              backgroundColor: uploadedDocuments.cover_letter_template ? '#DCFCE7' : (dragActive && dragTarget === 'cover_letter' ? '#CCFBF1' : '#F9FAFB')
            }}
          >
            <Upload className="w-12 h-12 mx-auto mb-3" 
                    style={{ color: uploadedDocuments.cover_letter_template ? '#10B981' : '#9CA3AF' }} />
            <p className="font-semibold mb-1">Cover Letter Template</p>
            <p className="text-sm text-gray-600">
              {uploadedDocuments.cover_letter_template ? `✓ ${uploadedDocuments.cover_letter_template.name}` : 'Drag & Drop or Click'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calendar Page Component
const CalendarPage = ({ user, onNotification }) => {
  const [isConnected, setIsConnected] = useState(true); // Default to connected
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const getCalendarEvents = async () => {
    setIsLoadingEvents(true);
    setError(null);
    try {
      console.log('Fetching calendar events...');
      const events = await api.getOutlookCalendar();
      console.log('Calendar events received:', events);
      setCalendarEvents(events);
      
      if (events.length === 0) {
        onNotification('📅 Calendar connected! No upcoming events found.');
      } else {
        onNotification(`📅 Loaded ${events.length} calendar events`);
      }
    } catch (error) {
      console.error('Error fetching calendar:', error);
      setError(error.message);
      onNotification('❌ Failed to load calendar events');
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Load events on mount
  useEffect(() => {
    getCalendarEvents();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await api.syncOutlookCalendar();
      await getCalendarEvents();
      onNotification('✅ Calendar synced successfully!');
    } catch (error) {
      onNotification('❌ Failed to sync calendar');
    } finally {
      setIsSyncing(false);
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[date.getMonth()];
  };

  const changeMonth = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date().getDate());
  };

  // Get events for a specific day
  const getEventsForDay = (day) => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const isToday = day === new Date().getDate() && 
                      currentDate.getMonth() === new Date().getMonth() &&
                      currentDate.getFullYear() === new Date().getFullYear();
      const isSelected = day === selectedDate;
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
          onClick={() => setSelectedDate(day)}
          style={{
            border: isToday ? '2px solid #FFD700' : '1px solid #e0e0e0',
            backgroundColor: isSelected ? '#FFF9E6' : isToday ? '#FFFACD' : 'white',
            cursor: 'pointer',
            minHeight: '100px',
            padding: '8px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div className="day-number" style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {day}
          </div>
          <div className="day-events" style={{ fontSize: '12px' }}>
            {dayEvents.slice(0, 3).map((event, idx) => (
              <div 
                key={idx} 
                className="event-item"
                style={{
                  backgroundColor: '#FFD700',
                  color: '#333',
                  padding: '2px 4px',
                  marginBottom: '2px',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: '11px'
                }}
                title={`${new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${event.subject}`}
              >
                {new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} {event.subject}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div style={{ fontSize: '10px', color: '#666', fontStyle: 'italic' }}>
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#FFD700', marginBottom: '20px' }}>Chronicle - Calendar</h2>
      
      {error && (
        <div style={{ backgroundColor: '#fee', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ color: '#c00', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Calendar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button
          onClick={() => changeMonth(-1)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#FFD700',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Previous
        </button>
        
        <h3 style={{ margin: 0, color: '#FFD700' }}>
          {getMonthName(currentDate)} {currentDate.getFullYear()}
        </h3>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={goToToday}
            style={{
              padding: '8px 16px',
              backgroundColor: '#FFD700',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Today
          </button>
          <button 
            onClick={() => changeMonth(1)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#FFD700',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Next
            </button>
          </div>
      </div>

      {/* Sync Button */}
      <div style={{ marginBottom: '20px' }}>
              <button
          onClick={handleSync}
                disabled={isSyncing}
          style={{
            padding: '10px 20px',
            backgroundColor: '#FFD700',
            border: 'none',
            borderRadius: '8px',
            cursor: isSyncing ? 'not-allowed' : 'pointer',
            opacity: isSyncing ? 0.6 : 1,
            fontWeight: 'bold'
          }}
        >
          {isSyncing ? 'Syncing...' : '🔄 Sync Calendar'}
        </button>
      </div>

      {/* Calendar Grid */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {/* Day Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginBottom: '10px' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', color: '#666' }}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
          {isLoadingEvents ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <p>Loading calendar events...</p>
            </div>
          ) : (
            renderCalendarGrid()
          )}
        </div>
            </div>

      {/* Selected Date Events Detail */}
      {selectedDate && (
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#FFF9E6', marginTop: '20px' }}>
          <h4 className="font-bold mb-3">
            Events for {getMonthName(currentDate)} {selectedDate}, {currentDate.getFullYear()}
          </h4>
          {getEventsForDay(selectedDate).length === 0 ? (
            <p className="text-gray-600">No events scheduled for this day.</p>
          ) : (
            <div className="space-y-3">
              {getEventsForDay(selectedDate).map((event, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg shadow" style={{ marginBottom: '10px' }}>
                  <h5 className="font-semibold">{event.subject}</h5>
                    <p className="text-sm text-gray-600">
                    {new Date(event.start).toLocaleTimeString()} - {new Date(event.end).toLocaleTimeString()}
                  </p>
                  {event.location && (
                    <p className="text-sm text-gray-500">📍 {event.location}</p>
                  )}
                  {event.preview && (
                    <p className="text-sm mt-2">{event.preview}</p>
              )}
            </div>
              ))}
          </div>
        )}
      </div>
      )}
    </div>
  );
};

// Profile Page Component with Large Radar Chart
const ProfilePage = ({ user }) => {
  // Prepare data for radar chart
  const radarData = user?.skills ? Object.entries(user.skills).map(([skill, data]) => ({
    skill: skill.charAt(0).toUpperCase() + skill.slice(1),
    value: data.level / 10, // Normalize to 0-1
    fullMark: 1
  })) : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6" 
           style={{ border: '3px solid #FFD700' }}>
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <User className="w-8 h-8 mr-3" style={{ color: '#FFD700' }} />
          Hero's Journey
        </h2>

        {/* Large Radar Chart */}
        <div className="flex justify-center mb-8">
          <div style={{ 
            width: '600px', 
            height: '600px', 
            border: '3px solid #C0C0C0', 
            borderRadius: '50%', 
            padding: '30px',
            background: 'rgba(255, 255, 255, 0.5)'
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid 
                  gridType="polygon" 
                  radialLines={true}
                  stroke="#C0C0C0"
                  strokeWidth={2}
                />
                <PolarAngleAxis 
                  dataKey="skill" 
                  tick={{ fill: '#333', fontSize: 16, fontWeight: 'bold' }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 1]} 
                  tickCount={6}
                  tick={{ fill: '#666', fontSize: 14 }}
                />
                <Radar 
                  name="Skills" 
                  dataKey="value" 
                  stroke="#FFD700" 
                  fill="#FFD700" 
                  fillOpacity={0.6}
                  strokeWidth={3}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Hero Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-bold">Maxwell Prizant</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-bold">maxwell.prizant@yale.edu</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Level</p>
                <p className="text-2xl font-bold" style={{ color: '#FFD700' }}>
                  {user?.totalLevel || 1}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Achievements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Trophy className="w-8 h-8 mx-auto mb-2" style={{ color: '#FFD700' }} />
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-600">Quests Completed</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Coffee className="w-8 h-8 mx-auto mb-2" style={{ color: '#FFD700' }} />
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-600">Symposiums Held</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Mail className="w-8 h-8 mx-auto mb-2" style={{ color: '#FFD700' }} />
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-600">Alliances Formed</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Flame className="w-8 h-8 mx-auto mb-2" style={{ color: '#FFD700' }} />
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Skill Mastery Overview</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(user?.skills || {}).map(([skill, data]) => (
            <div key={skill} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold mb-2" style={{ color: '#FFD700' }}>
                {data.level}
              </div>
              <p className="text-sm text-gray-600 capitalize">{skill}</p>
              <p className="text-xs text-gray-500 mt-1">
                Total XP: {data.totalXp}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Settings Page Component with Pre-filled Credentials
const SettingsPage = ({ user, onUpdate, headlessBrowsing, setHeadlessBrowsing }) => {
  const [credentials, setCredentials] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    linkedin: false,
    twelveTwenty: false,
    openai: false,
    serper: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCredentials();
  }, [user]);

  const loadCredentials = async () => {
    try {
      const creds = await api.getCredentials();
      setCredentials(creds);
    } catch (error) {
      console.error('Error loading credentials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectStrava = async () => {
    try {
      const { auth_url } = await api.initiateStravaAuth();
      window.location.href = auth_url;
    } catch (error) {
      alert('Error connecting to Strava');
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Save credentials
      await api.updateCredentials({
        linkedin: {
          username: credentials.linkedin.username,
          password: credentials.linkedin.password
        },
        twelveTwenty: {
          username: credentials.twelve_twenty.username,
          password: credentials.twelve_twenty.password
        },
        openai: credentials.openai.configured ? credentials.openai.key : '',
        serper: credentials.serper.configured ? credentials.serper.key : ''
      });

      // Save headless browsing preference
      await api.updatePreferences({
        headlessBrowsing: headlessBrowsing
      });

      // Reload user profile to get updated settings
      await onUpdate();
      
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin" style={{ color: '#FFD700' }} />
          <p className="mt-4">Loading credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6" 
           style={{ border: '3px solid #FFD700' }}>
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <Settings className="w-8 h-8 mr-3" style={{ color: '#FFD700' }} />
          Temple of Configuration
        </h2>

        {/* API Credentials - Read Only Display */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Key className="w-6 h-6 mr-2" style={{ color: '#FFD700' }} />
            Sacred Keys (Auto-configured)
          </h3>
          
          <div className="space-y-4">
            {/* LinkedIn */}
            <div className="border-2 rounded-lg p-4" style={{ borderColor: '#E5E5E5' }}>
              <h4 className="font-bold mb-3 flex items-center justify-between">
                LinkedIn Credentials
                {credentials?.linkedin?.configured && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Username</label>
                <input
                  type="text"
                    value={credentials?.linkedin?.username || ''}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg border-2 bg-gray-100"
                  style={{ borderColor: '#E5E5E5' }}
                />
                </div>
                <div className="relative">
                  <label className="text-sm text-gray-600">Password</label>
                  <input
                    type={showPasswords.linkedin ? 'text' : 'password'}
                    value="••••••••"
                    readOnly
                    className="w-full px-3 py-2 rounded-lg border-2 bg-gray-100 pr-10"
                    style={{ borderColor: '#E5E5E5' }}
                  />
                  <span className="absolute right-2 top-8 text-green-500">
                    <CheckCircle className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </div>

            {/* 12twenty */}
            <div className="border-2 rounded-lg p-4" style={{ borderColor: '#E5E5E5' }}>
              <h4 className="font-bold mb-3 flex items-center justify-between">
                12twenty Credentials
                {credentials?.twelve_twenty?.configured && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Username</label>
                <input
                  type="text"
                    value={credentials?.twelve_twenty?.username || ''}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg border-2 bg-gray-100"
                  style={{ borderColor: '#E5E5E5' }}
                />
                </div>
                <div className="relative">
                  <label className="text-sm text-gray-600">Password</label>
                  <input
                    type="password"
                    value="••••••••"
                    readOnly
                    className="w-full px-3 py-2 rounded-lg border-2 bg-gray-100 pr-10"
                    style={{ borderColor: '#E5E5E5' }}
                  />
                  <span className="absolute right-2 top-8 text-green-500">
                    <CheckCircle className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </div>

            {/* OpenAI */}
            <div className="border-2 rounded-lg p-4" style={{ borderColor: '#E5E5E5' }}>
              <h4 className="font-bold mb-3 flex items-center justify-between">
                OpenAI API Key
                {credentials?.openai?.configured && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </h4>
                <input
                type="password"
                value="sk-...configured"
                readOnly
                className="w-full px-3 py-2 rounded-lg border-2 bg-gray-100"
                  style={{ borderColor: '#E5E5E5' }}
                />
            </div>

            {/* Serper */}
            <div className="border-2 rounded-lg p-4" style={{ borderColor: '#E5E5E5' }}>
              <h4 className="font-bold mb-3 flex items-center justify-between">
                Serper API Key
                {credentials?.serper?.configured && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </h4>
                <input
                type="password"
                value="...configured"
                readOnly
                className="w-full px-3 py-2 rounded-lg border-2 bg-gray-100"
                  style={{ borderColor: '#E5E5E5' }}
                />
            </div>

            {/* Strava */}
            <div className="border-2 rounded-lg p-4" style={{ borderColor: '#E5E5E5' }}>
              <h4 className="font-bold mb-3">Strava Integration</h4>
              {credentials?.strava?.configured ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Connected (Athlete ID: {credentials.strava.athlete_id})
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={connectStrava}
                  className="px-6 py-2 rounded-lg text-white font-bold transition-all"
                  style={{ background: goldGradient }}
                >
                  Connect Strava
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scraping Settings */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Eye className="w-6 h-6 mr-2" style={{ color: '#FFD700' }} />
            Scraping Preferences
          </h3>
          
          <div className="border-2 rounded-lg p-4" style={{ borderColor: '#E5E5E5' }}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold">Headless Browsing</h4>
                <p className="text-sm text-gray-600">
                  When enabled, web scraping runs in the background without opening browser windows. 
                  Disable to see the scraping process in action.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {headlessBrowsing ? 'Hidden' : 'Visible'}
                </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                    checked={headlessBrowsing}
                    onChange={(e) => setHeadlessBrowsing(e.target.checked)}
                  className="sr-only peer"
                />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
                {headlessBrowsing ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-blue-500" />
                )}
          </div>
        </div>

            <div className="mt-4">
        <button
                onClick={handleSaveSettings}
          disabled={isSaving}
                className="px-6 py-2 rounded-lg text-white font-bold transition-all transform hover:scale-105 disabled:opacity-50"
          style={{ background: goldGradient }}
        >
          {isSaving ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
            </span>
          ) : (
                  'Save Settings'
          )}
        </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <Shield className="w-4 h-4 inline mr-1" />
            Your credentials are automatically configured and encrypted. They are used only for automated job searching and email sending on your behalf.
          </p>
        </div>
      </div>
    </div>
  );
};

// Coffee Chat Page Component
const CoffeeChatPage = ({ user, onNotification, people, setPeople, contactedPeople, setContactedPeople, peopleFilters, setPeopleFilters, emailDrafts, setEmailDrafts }) => {
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [displayCount, setDisplayCount] = useState(user?.coffeeChatDisplayCount || 3);
  const [activeTab, setActiveTab] = useState('search');
  const [dragActive, setDragActive] = useState(false);
  const [dragTarget, setDragTarget] = useState(null);

  useEffect(() => {
    if (activeTab === 'contacted') {
      loadContactedPeople();
    }
  }, [activeTab]);

  const loadContactedPeople = async () => {
    try {
      const data = await api.getContactedPeople();
      setContactedPeople(data);
    } catch (error) {
      console.error('Error loading contacted people:', error);
    }
  };

  const searchPeople = async () => {
    setIsLoading(true);
    try {
      const searchData = {
        company: peopleFilters.company || '',
        filters: {
          school: peopleFilters.school,
          title: peopleFilters.title,
          location: peopleFilters.location
        }
      };
      
      const result = await api.searchPeople(searchData);
      setPeople(result.people);
      onNotification(`🔍 Found ${result.people.length} potential allies!`);
    } catch (error) {
      onNotification('⚠️ Error searching for people');
    } finally {
      setIsLoading(false);
    }
  };

  const draftEmails = async () => {
    if (selectedPeople.length === 0) {
      onNotification('⚔️ Select people to contact!');
      return;
    }

    setIsLoading(true);
    try {
      const result = await api.draftEmails(selectedPeople);
      setEmailDrafts(result.drafts);
      onNotification(`📝 Generated ${result.drafts.length} personalized messages!`);
    } catch (error) {
      onNotification('⚠️ Error generating email drafts');
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmails = async () => {
    if (!emailDrafts || emailDrafts.length === 0) {
      onNotification('📜 No email drafts to send!');
      return;
    }

    setIsSending(true);
    try {
      const result = await api.sendEmails(emailDrafts);
      
      // Count successful sends
      const successCount = result.results.filter(r => r.status === 'success').length;
      
      onNotification(`✅ Sent ${successCount} alliance invitations!`);
      
      // Show XP awards
      if (result.xpAwarded && Object.keys(result.xpAwarded).length > 0) {
        Object.entries(result.xpAwarded).forEach(([skill, xp]) => {
          onNotification(`⚡ +${xp} XP in ${skill}!`);
        });
      }
      
      // Clear selections and drafts
      setSelectedPeople([]);
      setEmailDrafts([]);
      
      // Reload contacted people
      await loadContactedPeople();
      
    } catch (error) {
      onNotification('⚠️ Error sending emails');
    } finally {
      setIsSending(false);
    }
  };

  const handleFollowUp = async (contactedIds) => {
    try {
      const result = await api.sendFollowUp(contactedIds);
      onNotification(`📮 Sent ${result.results.length} follow-up messages!`);
      await loadContactedPeople();
    } catch (error) {
      onNotification('⚠️ Error sending follow-ups');
    }
  };

  const togglePersonSelection = (personId) => {
    if (selectedPeople.includes(personId)) {
      setSelectedPeople(selectedPeople.filter(id => id !== personId));
    } else {
      setSelectedPeople([...selectedPeople, personId]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Symposium Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6" 
           style={{ border: '3px solid #FFD700' }}>
        <h2 className="text-3xl font-bold mb-4 flex items-center">
          <Coffee className="w-8 h-8 mr-3" style={{ color: '#FFD700' }} />
          Symposium - Coffee Chats
          <span className="ml-auto text-sm font-normal text-gray-600 flex items-center">
            <Sparkles className="w-4 h-4 mr-1" style={{ color: '#FFD700' }} />
            AI-Powered Outreach
          </span>
        </h2>

        {/* Tab Switcher */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'search' ? 'text-white' : 'text-gray-600'
            }`}
            style={{ 
              background: activeTab === 'search' ? goldGradient : '#E5E5E5' 
            }}
          >
            Find People
          </button>
          <button
            onClick={() => setActiveTab('contacted')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'contacted' ? 'text-white' : 'text-gray-600'
            }`}
            style={{ 
              background: activeTab === 'contacted' ? goldGradient : '#E5E5E5' 
            }}
          >
            Contacted ({contactedPeople.length})
          </button>
        </div>

        {/* Search Filters - Only show for search tab */}
        {activeTab === 'search' && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <input
                type="text"
                placeholder="Company"
                value={peopleFilters.company || ''}
                onChange={(e) => setPeopleFilters({...peopleFilters, company: e.target.value})}
                className="px-4 py-2 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: '#E5E5E5' }}
              />
              <input
                type="text"
                placeholder="School"
                value={peopleFilters.school || ''}
                onChange={(e) => setPeopleFilters({...peopleFilters, school: e.target.value})}
                className="px-4 py-2 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: '#E5E5E5' }}
              />
              <input
                type="text"
                placeholder="Title"
                value={peopleFilters.title || ''}
                onChange={(e) => setPeopleFilters({...peopleFilters, title: e.target.value})}
                className="px-4 py-2 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: '#E5E5E5' }}
              />
              <input
                type="text"
                placeholder="Location"
                value={peopleFilters.location || ''}
                onChange={(e) => setPeopleFilters({...peopleFilters, location: e.target.value})}
                className="px-4 py-2 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: '#E5E5E5' }}
              />
            </div>

            {/* Display Count Slider */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="font-medium">Display Count:</span>
              <input
                type="range"
                min="1"
                max="10"
                value={displayCount}
                onChange={(e) => setDisplayCount(parseInt(e.target.value))}
                className="flex-1"
                style={{ accentColor: '#FFD700' }}
              />
              <span className="font-bold text-white px-3 py-1 rounded-full"
                    style={{ background: goldGradient }}>
                {displayCount}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={searchPeople}
                disabled={isLoading}
                className="px-6 py-3 rounded-xl font-semibold transition-all"
                style={{
                  background: goldGradient,
                  color: 'white',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? '🔍 Searching...' : '🔍 Find Allies'}
              </button>

              {selectedPeople.length > 0 && (
                <button
                  onClick={draftEmails}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl font-semibold transition-all bg-blue-600 text-white disabled:opacity-50"
                >
                  {isLoading ? '✍️ Drafting...' : `✍️ Draft Messages (${selectedPeople.length})`}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* People Display */}
      {activeTab === 'search' ? (
        <>
          <div className="bg-white rounded-2xl shadow-lg p-6" 
               style={{ border: '2px solid #E5E5E5' }}>
            <h3 className="text-xl font-bold mb-4">Potential Allies</h3>
            
            {people.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No allies discovered yet.</p>
                <p className="text-sm text-gray-500 mt-2">Use the search above to find your tribe!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {people.slice(0, displayCount).map(person => (
                  <div key={person.id} className="bg-white p-4 rounded-lg shadow border-l-4" 
                       style={{ borderColor: selectedPeople.includes(person.id) ? '#FFD700' : '#E5E5E5' }}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedPeople.includes(person.id)}
                          onChange={() => togglePersonSelection(person.id)}
                          className="mt-1"
                        />
                        
                        <div>
                          <h4 className="font-bold text-lg">{person.name}</h4>
                          <p className="text-gray-600">{person.role} at {person.company}</p>
                          <p className="text-gray-500 text-sm">{person.location}</p>
                          {person.school && (
                            <p className="text-gray-500 text-sm">🎓 {person.school}</p>
                          )}
                          {person.email && (
                            <p className="text-gray-500 text-sm">
                              ✉️ {person.email} {person.predictedEmail && '(predicted)'}
                            </p>
                          )}
                          
                          {/* AI Relevance Score */}
                          {person.relevanceScore && (
                            <div className="mt-2">
                              <span className="px-2 py-1 rounded-full text-xs font-semibold"
                                    style={{
                                      background: person.relevanceScore >= 0.8 ? goldGradient : 
                                                person.relevanceScore >= 0.6 ? silverGradient : 
                                                '#E5E5E5',
                                      color: person.relevanceScore >= 0.6 ? 'white' : '#666'
                                    }}>
                                {Math.round(person.relevanceScore * 100)}% Match
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {person.linkedinUrl && (
                        <a
                          href={person.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          LinkedIn →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Email Drafts */}
          {emailDrafts && emailDrafts.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6" 
                 style={{ border: '2px solid #E5E5E5' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">AI-Generated Messages</h3>
                <div className="text-sm text-gray-600 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" style={{ color: '#FFD700' }} />
                  Personalized for each recipient
                </div>
              </div>
              
              <div className="space-y-4">
                {emailDrafts.map((draft, idx) => {
                  const person = people.find(p => p.id === draft.contactId);
                  return (
                    <div key={idx} className="border rounded-lg p-4" style={{ borderColor: '#E5E5E5' }}>
                      <div className="mb-2">
                        <span className="font-semibold">To:</span> {person?.name} ({person?.email})
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Subject:</span> {draft.subject}
                      </div>
                      <div className="whitespace-pre-wrap text-sm">{draft.body}</div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={sendEmails}
                  disabled={isSending}
                  className="px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
                  style={{
                    background: goldGradient,
                    color: 'white',
                    opacity: isSending ? 0.7 : 1
                  }}
                >
                  {isSending ? '📮 Sending...' : `📮 Send All ${selectedPeople.length} Messages`}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6" 
             style={{ border: '2px solid #E5E5E5' }}>
          <h3 className="text-xl font-bold mb-4">Contacted People</h3>
          
          {contactedPeople.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No one contacted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contactedPeople.map(contacted => (
                <div key={contacted.id} 
                     className="p-4 rounded-lg border-2"
                     style={{ borderColor: contacted.responseReceived ? '#10B981' : '#E5E5E5' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg">{contacted.contact.name}</h4>
                      <p className="text-gray-600">{contacted.contact.role} at {contacted.contact.company}</p>
                      <p className="text-sm text-gray-500">
                        Contacted: {new Date(contacted.contactedAt).toLocaleDateString()}
                      </p>
                      {contacted.responseReceived && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ Responded on {new Date(contacted.responseDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    {!contacted.responseReceived && !contacted.lastFollowup && (
                      <button
                        onClick={() => handleFollowUp([contacted.id])}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Send Follow-up
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Marathon Page Component with Strava Integration
const MarathonPage = ({ user, onNotification }) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [weeklyStats, setWeeklyStats] = useState({
    totalMiles: 0,
    totalRuns: 0,
    totalTime: 0,
    averagePace: 0
  });
  const [monthlyGoal, setMonthlyGoal] = useState(50); // Default 50 miles/month

  useEffect(() => {
    if (user?.strava_configured) {
      loadStravaActivities();
    }
  }, [user]);

  const loadStravaActivities = async () => {
    setIsLoading(true);
    try {
      // This would call the backend endpoint to get Strava activities
      // For now, using sample data
      const sampleActivities = [
        {
          id: 1,
          name: 'Morning Run',
          distance: 5.2, // miles
          movingTime: 1920, // seconds
          averagePace: '6:10',
          startDate: new Date().toISOString(),
          type: 'Run'
        },
        {
          id: 2,
          name: 'Evening Jog',
          distance: 3.1,
          movingTime: 1200,
          averagePace: '6:27',
          startDate: new Date(Date.now() - 86400000).toISOString(),
          type: 'Run'
        }
      ];
      
      setActivities(sampleActivities);
      calculateStats(sampleActivities);
      onNotification('🏃 Strava activities synced!');
    } catch (error) {
      onNotification('⚠️ Error loading Strava activities');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (activities) => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyActivities = activities.filter(a => new Date(a.startDate) > weekAgo);
    
    const stats = {
      totalMiles: weeklyActivities.reduce((sum, a) => sum + a.distance, 0),
      totalRuns: weeklyActivities.length,
      totalTime: weeklyActivities.reduce((sum, a) => sum + a.movingTime, 0),
      averagePace: weeklyActivities.length > 0 
        ? weeklyActivities.reduce((sum, a) => sum + (a.movingTime / a.distance), 0) / weeklyActivities.length 
        : 0
    };
    
    setWeeklyStats(stats);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatPace = (secondsPerMile) => {
    const minutes = Math.floor(secondsPerMile / 60);
    const seconds = Math.floor(secondsPerMile % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Marathon Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6" 
           style={{ border: '3px solid #FFD700' }}>
        <h2 className="text-3xl font-bold mb-4 flex items-center">
          <Activity className="w-8 h-8 mr-3" style={{ color: '#FFD700' }} />
          Marathon Training
          {user?.strava_configured && (
            <span className="ml-auto text-sm font-normal text-green-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Strava Connected
            </span>
          )}
        </h2>

        {!user?.strava_configured ? (
          <div className="bg-yellow-50 rounded-lg p-6 text-center">
            <Activity className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
            <h3 className="text-xl font-bold mb-2">Connect Your Strava</h3>
            <p className="text-gray-600 mb-4">
              Track your running progress automatically by connecting your Strava account.
            </p>
            <button
              onClick={() => window.location.href = '/settings'}
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105"
              style={{ background: goldGradient }}
            >
              Go to Settings
            </button>
          </div>
        ) : (
          <>
            {/* Weekly Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold" style={{ color: '#FFD700' }}>
                  {weeklyStats.totalMiles.toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">Miles This Week</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold" style={{ color: '#FFD700' }}>
                  {weeklyStats.totalRuns}
                </p>
                <p className="text-sm text-gray-600">Runs</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold" style={{ color: '#FFD700' }}>
                  {formatTime(weeklyStats.totalTime)}
                </p>
                <p className="text-sm text-gray-600">Total Time</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold" style={{ color: '#FFD700' }}>
                  {weeklyStats.averagePace > 0 ? formatPace(weeklyStats.averagePace) : '--'}
                </p>
                <p className="text-sm text-gray-600">Avg Pace/mi</p>
              </div>
            </div>

            {/* Monthly Goal Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Monthly Goal Progress</h3>
                <span className="text-sm text-gray-600">
                  {weeklyStats.totalMiles.toFixed(1)} / {monthlyGoal} miles
                </span>
              </div>
              <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min((weeklyStats.totalMiles / monthlyGoal) * 100, 100)}%`,
                    background: goldGradient
                  }}
                />
              </div>
            </div>

            {/* Sync Button */}
            <button
              onClick={loadStravaActivities}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105"
              style={{ background: goldGradient }}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Syncing...
                </span>
              ) : (
                '🔄 Sync Activities'
              )}
            </button>
          </>
        )}
      </div>

      {/* Recent Activities */}
      {user?.strava_configured && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Recent Activities</h3>
          
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No activities found.</p>
              <p className="text-sm text-gray-500 mt-2">Complete a run and sync to see it here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map(activity => (
                <div key={activity.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold">{activity.name}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(activity.startDate).toLocaleDateString()} • {activity.type}
                    </p>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="font-bold text-lg">{activity.distance.toFixed(1)}</p>
                      <p className="text-gray-600">miles</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">{formatTime(activity.movingTime)}</p>
                      <p className="text-gray-600">time</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">{activity.averagePace}</p>
                      <p className="text-gray-600">/mi</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Training Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl shadow-lg p-6"
           style={{ border: '2px solid #FFD700' }}>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Trophy className="w-6 h-6 mr-2" style={{ color: '#FFD700' }} />
          Champion's Wisdom
        </h3>
        <div className="space-y-3">
          <p className="flex items-start">
            <span className="text-2xl mr-2">🏃</span>
            <span>Consistency beats intensity - run regularly at a comfortable pace.</span>
          </p>
          <p className="flex items-start">
            <span className="text-2xl mr-2">💧</span>
            <span>Hydrate before, during, and after your runs.</span>
          </p>
          <p className="flex items-start">
            <span className="text-2xl mr-2">🦵</span>
            <span>Rest days are training days - recovery builds strength.</span>
          </p>
          <p className="flex items-start">
            <span className="text-2xl mr-2">📈</span>
            <span>Increase weekly mileage by no more than 10% to avoid injury.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
