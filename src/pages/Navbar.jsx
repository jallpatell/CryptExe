import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function() {
    const navigate = useNavigate()
    const { isAuthenticated, login, logout, user } = useAuth();

    console.log("Navbar - isAuthenticated:", isAuthenticated);
    console.log("Navbar - User:", user);

    return( 
        <nav className="flex items-center fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg justify-between p-6 max-w-8xl mx-auto">
            <div className="flex items-center space-x-2">
                <img className='h-15 rounded-xl' src='/CRYPTeX (1).png'></img>
            </div> 

            <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="hover:text-[#ffffff] text-gray-400 text-xl font-extrabold transition-colors">Home</Link>
                <Link to="/wallet" className="hover:text-[#ffffff] text-gray-400 text-xl font-extrabold transition-colors">Wallet</Link>
                <Link to="/portfolio" className="hover:text-[#ffffff] text-gray-400 text-xl font-extrabold transition-colors">Portfolio</Link>
                <a href="https://github.com/jallpatell/CRYPTeX" target='_blank' className="hover:text-[#ffffff] text-gray-400 text-xl font-extrabold transition-colors">Contribute</a>
                <a href="#" className="hover:text-[#ffffff] text-gray-400 text-xl font-extrabold transition-colors">Settings</a>
                {isAuthenticated ? (
                    <button onClick={logout} className="hover:text-[#ffffff] text-gray-400 text-xl font-extrabold transition-colors">Logout</button>
                ) : (
                    <button onClick={login} className="hover:text-[#ffffff] text-gray-400 text-xl font-extrabold transition-colors">Login</button>
                )}
            </div>
        </nav>
    )
}