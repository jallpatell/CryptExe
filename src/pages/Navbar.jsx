import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef } from 'react';

export default function Navbar() {
    const navigate = useNavigate();
    const { isAuthenticated, login, logout, user } = useAuth();
    const navRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const nav = navRef.current;
            
            if (scrollY <= 0) {
                // When scrolling past top (rubber band effect)
                const stretchAmount = Math.abs(scrollY) * 0.3; // Adjust multiplier for stretch intensity
                nav.style.transform = `translateY(${stretchAmount}px)`;
                nav.style.backdropFilter = `blur(${8 - stretchAmount * 0.2}px)`; // Slightly reduce blur when stretched
            } else {
                // Normal scrolling
                nav.style.transform = 'translateY(0)';
                nav.style.backdropFilter = 'blur(8px)';
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    
    return ( 
        <nav 
            ref={navRef}
            className="fixed top-0 z-50 w-full transition-all duration-300 ease-out bg-gray-900/20 backdrop-blur-md border-b border-gray-800/50 hover:border-gray-800/50"
            style={{ 
                transform: 'translateY(0)',
                backdropFilter: 'blur(8px)',
                willChange: 'transform, backdrop-filter' // Optimize for performance
            }}
        >
            <div className="flex items-center justify-between p-4 mx-auto max-w-7xl">
                <div className="flex items-center space-x-3">
                    <img className='h-10 rounded-lg' src='/CRYPTeX (1).png' alt="CRYPTeX Logo" />

                </div> 

                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/" className="hover:text-white text-gray-300/90 text-lg font-medium transition-colors duration-200 hover:bg-white/5 px-3 py-2 rounded-lg">Home</Link>
                    <Link to="/wallet" className="hover:text-white text-gray-300/90 text-lg font-medium transition-colors duration-200 hover:bg-white/5 px-3 py-2 rounded-lg">Wallet</Link>
                    <Link to="/portfolio" className="hover:text-white text-gray-300/90 text-lg font-medium transition-colors duration-200 hover:bg-white/5 px-3 py-2 rounded-lg">Portfolio</Link>
                    <a href="#" className="hover:text-white text-gray-300/90 text-lg font-medium transition-colors duration-200 hover:bg-white/5 px-3 py-2 rounded-lg">Settings</a>
                    <a href='https://github.com/jallpatell' target='_blank' rel='noopener noreferrer' className="p-2 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                        <img className='h-8' src='/432516.webp'></img>
                    </a>
                    {isAuthenticated ? (
                        <button 
                            onClick={logout} 
                            className="px-4 py-2 text-lg font-medium text-purple-100 bg-white/5 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20"
                        >
                            Logout
                        </button>
                    ) : (
                        <button 
                            onClick={login} 
                            className="px-4 py-2 text-lg font-medium text-white bg-gradient-to-r from-purple-600/80 to-purple-800/80 rounded-lg hover:from-purple-600 hover:to-purple-800 transition-all duration-200 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}