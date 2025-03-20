import Board from './pages/Boards/_id.jsx'
import { Route, Routes, Navigate } from 'react-router-dom'
import NotFound from './pages/404/NotFound'
import Auth from '~/pages/Auth/Auth.jsx'
import AccountVerification from '~/pages/Auth/AccountVerification.jsx'

function App() {
  return (
    <Routes>
      {/* route to homepage */}
      <Route path="/" element={<Navigate to="/boards/67b9dd65ef4a5f8e62700935" replace = {true}/>} />

      {/* route to board details */}
      <Route path="/boards/:boardId" element={<Board />} />

      {/* route to login page */}
      <Route path="/login" element={<Auth />} />

      {/* route to register page */}
      <Route path="/register" element={<Auth />} />

      {/* route to verification page */}
      <Route path="/account/verification" element={<AccountVerification />} />

      {/* route to 404 page */}
      <Route path='*' element={<NotFound />} />

    </Routes>
  )
}

export default App
