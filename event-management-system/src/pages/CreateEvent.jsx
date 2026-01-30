import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Calendar, MapPin, Video, DollarSign, Users, Sparkles, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateEvent() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        type: 'physical', // physical, virtual, hybrid
        location: '',
        meetingLink: '',
        price: '',
        capacity: '',
    });

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const eventData = {
                ...formData,
                organizerId: currentUser.uid,
                organizerEmail: currentUser.email,
                price: Number(formData.price),
                capacity: Number(formData.capacity),
                ticketsSold: 0,
                createdAt: new Date().toISOString(),
                status: 'pending' // Admin needs to approve
            };

            await addDoc(collection(db, "events"), eventData);

            toast.success('Event module initialized! Waiting for Galaxy Command approval.', { icon: '🪐' });
            navigate('/organizer');
        } catch (error) {
            console.error("Error creating event:", error);
            toast.error('Failed to launch event. System malfunction.');
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen pt-20 px-4 max-w-4xl mx-auto">
            <button onClick={() => navigate('/organizer')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back to Bridge
            </button>

            <div className="glass-panel rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-white text-glow mb-8 flex items-center gap-3">
                    <Sparkles className="text-galaxy-400" /> Launch New Event
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 col-span-2">
                            <label className="text-sm text-gray-400">Event Title</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-space-800/80 border border-galaxy-700/50 rounded-xl py-3 px-4 focus:outline-none focus:border-galaxy-500 focus:ring-1 focus:ring-galaxy-500 transition-all"
                                placeholder="Ex. Intergalactic Tech Summit"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-sm text-gray-400">Description</label>
                            <textarea
                                required
                                rows={4}
                                className="w-full bg-space-800/80 border border-galaxy-700/50 rounded-xl py-3 px-4 focus:outline-none focus:border-galaxy-500 focus:ring-1 focus:ring-galaxy-500 transition-all"
                                placeholder="Describe the mission..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-space-800/80 border border-galaxy-700/50 rounded-xl py-3 px-4 focus:outline-none focus:border-galaxy-500 transition-all text-white [color-scheme:dark]"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Time</label>
                            <input
                                type="time"
                                required
                                className="w-full bg-space-800/80 border border-galaxy-700/50 rounded-xl py-3 px-4 focus:outline-none focus:border-galaxy-500 transition-all text-white [color-scheme:dark]"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-sm text-gray-400">Event Type</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['physical', 'virtual', 'hybrid'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={`p-3 rounded-xl border capitalize transition-all ${formData.type === type ? 'bg-galaxy-600 border-galaxy-400 text-white' : 'bg-space-800/50 border-transparent text-gray-400 hover:bg-space-800'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {(formData.type === 'physical' || formData.type === 'hybrid') && (
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm text-gray-400 flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-space-800/80 border border-galaxy-700/50 rounded-xl py-3 px-4 focus:outline-none focus:border-galaxy-500 transition-all"
                                    placeholder="Space Station Alpha, Sector 7"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        )}

                        {(formData.type === 'virtual' || formData.type === 'hybrid') && (
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm text-gray-400 flex items-center gap-2"><Video className="w-4 h-4" /> Meeting Link</label>
                                <input
                                    type="url"
                                    required
                                    className="w-full bg-space-800/80 border border-galaxy-700/50 rounded-xl py-3 px-4 focus:outline-none focus:border-galaxy-500 transition-all"
                                    placeholder="https://zoom.us/j/..."
                                    value={formData.meetingLink}
                                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Ticket Price ($)</label>
                            <input
                                type="number"
                                min="0"
                                required
                                className="w-full bg-space-800/80 border border-galaxy-700/50 rounded-xl py-3 px-4 focus:outline-none focus:border-galaxy-500 transition-all"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 flex items-center gap-2"><Users className="w-4 h-4" /> Max Capacity</label>
                            <input
                                type="number"
                                min="1"
                                required
                                className="w-full bg-space-800/80 border border-galaxy-700/50 rounded-xl py-3 px-4 focus:outline-none focus:border-galaxy-500 transition-all"
                                placeholder="100"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-galaxy-600 to-nebula-600 hover:from-galaxy-500 hover:to-nebula-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 transform transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                        >
                            {loading ? 'Initiating Launch Sequence...' : 'Launch Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
