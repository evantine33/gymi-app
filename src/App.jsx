import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import MemberDashboard from './pages/MemberDashboard'
import CoachDashboard from './pages/CoachDashboard'
import Community from './pages/Community'
import DirectMessages from './pages/DirectMessages'
import Profile from './pages/Profile'
import Programs from './pages/Programs'

function ProtectedRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<MemberDashboard />} />
        <Route path="/coach" element={<CoachDashboard />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/community" element={<Community />} />
        <Route path="/messages" element={<DirectMessages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </AppProvider>
  )
}
