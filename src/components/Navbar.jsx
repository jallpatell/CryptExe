import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef } from 'react';
import { UserCircle } from 'lucide-react';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, login, logout, user } = useAuth();
    const navRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const nav = navRef.current;
            
            if (nav) {
                if (scrollY <= 0) {
                    const stretchAmount = Math.abs(scrollY) * 0.3;
                    nav.style.transform = `translateY(${stretchAmount}px)`;
                    const blurAmount = Math.max(0, 8 - stretchAmount * 0.2); 
                    nav.style.backdropFilter = `blur(${blurAmount}px)`;
                } else {
                    nav.style.transform = 'translateY(0)';
                    nav.style.backdropFilter = 'blur(8px)';
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const baseLink = "text-lg font-medium transition-colors duration-200 px-3 py-2 rounded-lg";
    const inactive = "text-gray-300/90 hover:text-white hover:bg-white/5";
    const active = "text-white bg-white/10 border border-white/10";
    const isActive = (path) => (location.pathname === path);
    
    return ( 
        <nav 
            ref={navRef}
            className="fixed mt-3 ml-10 w-350 rounded-3xl top-0 z-50 transition-all duration-300 ease-out bg-black/20 backdrop-blur-md hover:scale-102 border-gray-800/50"
            style={{ 
                transform: 'translateY(0)',
                backdropFilter: 'blur(8px)',
                willChange: 'transform, backdrop-filter'
            }}
        >
            <div className="flex items-center justify-between p-3 mx-auto max-w-7xl">
                <div className="flex items-center space-x-3">
                    <img className='h-15 rounded-lg' src='/CRYPTeX (1).png' alt="CRYPTeX Logo" />

                </div> 

                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/" className={`${baseLink} ${isActive('/') ? active : inactive}`}>Home</Link>
                    <Link to="/wallet" className={`${baseLink} ${isActive('/wallet') ? active : inactive}`}>Wallet</Link>
                    <Link to="/portfolio" className={`${baseLink} ${isActive('/portfolio') ? active : inactive}`}>Portfolio</Link>
                    <Link to="/transactions" className={`${baseLink} ${isActive('/transactions') ? active : inactive}`}>Transactions</Link>

                    <a href='https://github.com/jallpatell/CRYPTeX-secondary-' target='_blank' rel='noopener noreferrer' className="p-2 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                        <img className='h-8' src='/432516.webp'></img>
                    </a>
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-3">
                            {user && user.photoURL ? (
                                <>
                                    {console.log("Rendering user photo. PhotoURL:", user.photoURL)}
                                    <img 
                                        src={user.photoURL} 
                                        alt="User Profile" 
                                        className="h-8 w-8 rounded-full border border-gray-700"
                                    />
                                </>
                            ) : (
                                <UserCircle size={32} className="text-gray-400" />
                            )}
                            <button 
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to log out?')) {
                                        logout();
                                    }
                                }} 
                                className="px-3 py-2 text-lg font-medium text-purple-100 bg-white/5 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={login} 
                            className="px-3 py-2 text-lg font-medium text-white font-mono bg-blue-500 rounded-lg hover:bg-blue-400 transition-all duration-200 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}