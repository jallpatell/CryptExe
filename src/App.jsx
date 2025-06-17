import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import CryptexLanding from './pages/Home'
import Portfolio from './pages/Portfolio'
import Wallet from './pages/Wallet'
// Consider adding lazy loading:
// import { lazy, Suspense } from 'react'
// const CryptexLanding = lazy(() => import('./pages/Home'))
// const Portfolio = lazy(() => import('./pages/Portfolio'))
// const Wallet = lazy(() => import('./pages/Wallet'))

export default function App() {
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 overflow-y-auto overscroll-none bg-gray-900'>
<BrowserRouter>
        <Routes>
          <Route path="/" element={<CryptexLanding />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </div>
      

  )
}

