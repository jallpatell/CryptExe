import { Link, HashRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import CryptexLanding from './pages/Home'
import Portfolio from './pages/Portfolio'
import Wallet from './pages/Wallet'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <div >
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<CryptexLanding />} />
          <Route
            path="/wallet"
            element={
              <PrivateRoute>
                <Wallet />
              </PrivateRoute>
            }
          />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </AuthProvider>
    </HashRouter>
    </div>
  )
}

