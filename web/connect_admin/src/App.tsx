import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import VerificationQueue from './pages/VerificationQueue'
import { useAuthStore } from './stores/authStore'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/verification"
        element={isAuthenticated ? <VerificationQueue /> : <Navigate to="/login" />}
      />
      <Route path="/" element={<Navigate to="/verification" />} />
    </Routes>
  )
}

export default App
