import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Star, Shield, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('attendee'); // attendee, organizer, admin
    const { login, signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
                toast.success('Welcome back to the Galaxy!', { icon: '🚀' });
            } else {
                await signup(email, password, role, name);
                toast.success('Registration successful! Prepare for launch.', { icon: '✨' });
            }
            navigate('/');
        } catch (error) {
            toast.error(error.message);
        }
        setLoading(false);
    }

    async function handleGoogleLogin() {
        setLoading(true);
        try {
            await loginWithGoogle();
            toast.success('Welcome to the Cosmos!', { icon: '🚀' });
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full glass-panel rounded-2xl p-8 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-galaxy-500 via-nebula-500 to-star-500"></div>

                <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-star-300 to-galaxy-300 text-glow">
                    {isLogin ? 'Enter the Cosmos' : 'Join the Galaxy'}
                </h2>

                <div className="flex justify-center mb-8 bg-space-800/50 p-1 rounded-xl">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 px-4 rounded-lg transition-all ${isLogin ? 'bg-galaxy-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 px-4 rounded-lg transition-all ${!isLogin ? 'bg-nebula-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-5 h-5 text-galaxy-400" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-space-800/80 border border-galaxy-700/50 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-galaxy-500 focus:ring-1 focus:ring-galaxy-500 transition-all text-white placeholder-gray-600"
                                    placeholder="Commander Shepherd"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Email Coordinates</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-galaxy-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-space-800/80 border border-galaxy-700/50 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-galaxy-500 focus:ring-1 focus:ring-galaxy-500 transition-all text-white placeholder-gray-600"
                                placeholder="user@galaxy.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Access Code</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-galaxy-400" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-space-800/80 border border-galaxy-700/50 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-galaxy-500 focus:ring-1 focus:ring-galaxy-500 transition-all text-white placeholder-gray-600"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">Role Selection</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setRole('attendee')}
                                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${role === 'attendee' ? 'bg-star-900/40 border-star-500 text-star-300' : 'bg-space-800/50 border-transparent text-gray-500 hover:bg-space-800'}`}
                                >
                                    <Star className="w-5 h-5" />
                                    <span className="text-xs">Attendee</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('organizer')}
                                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${role === 'organizer' ? 'bg-galaxy-900/40 border-galaxy-500 text-galaxy-300' : 'bg-space-800/50 border-transparent text-gray-500 hover:bg-space-800'}`}
                                >
                                    <Calendar className="w-5 h-5" />
                                    <span className="text-xs">Organizer</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('admin')}
                                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${role === 'admin' ? 'bg-nebula-900/40 border-nebula-500 text-nebula-300' : 'bg-space-800/50 border-transparent text-gray-500 hover:bg-space-800'}`}
                                >
                                    <Shield className="w-5 h-5" />
                                    <span className="text-xs">Admin</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-galaxy-600 to-nebula-600 hover:from-galaxy-500 hover:to-nebula-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-500/20 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Initiate sequence' : 'Register')}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-space-900 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl shadow-lg hover:bg-gray-100 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                        </svg>
                        Google
                    </button>
                </form>
            </div>
        </div>
    );
}
