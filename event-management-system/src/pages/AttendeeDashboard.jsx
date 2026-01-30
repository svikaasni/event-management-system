import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Search, Calendar, MapPin, Ticket, Video } from 'lucide-react';

export default function AttendeeDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchEvents() {
            try {
                // In real app, filter by 'approved' status. For demo, we might show all or just approved.
                // Let's show all for now so the user can see their created events immediately
                const q = query(collection(db, 'events'));
                const querySnapshot = await getDocs(q);
                const eventsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-20 px-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-star-300 to-galaxy-300 text-glow">
                    Explore the Galaxy
                </h1>
                <button onClick={logout} className="border border-white/20 hover:bg-white/10 text-white px-4 py-2 rounded-xl transition-all">
                    Logout
                </button>
            </div>

            <div className="relative mb-12 max-w-2xl mx-auto">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-galaxy-400" />
                <input
                    type="text"
                    placeholder="Search for interstellar events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-space-800/80 border border-galaxy-700/50 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-galaxy-500 focus:ring-1 focus:ring-galaxy-500 transition-all text-white placeholder-gray-500"
                />
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Scanning sector...</div>
            ) : filteredEvents.length === 0 ? (
                <div className="text-center py-20 text-gray-400">No signals detected in this sector.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {filteredEvents.map((event) => (
                        <div key={event.id} className="glass-panel rounded-2xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300 flex flex-col h-full">
                            <div className="h-48 bg-gradient-to-br from-galaxy-900 to-space-900 relative">
                                {/* Using a generic galaxy image for all events for now, or could use random ones */}
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop')] bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs border border-white/10 capitalize">
                                    {event.type}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold mb-2 line-clamp-1">{event.title}</h3>
                                <div className="space-y-2 text-gray-400 text-sm mb-4 flex-grow">
                                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-galaxy-400" /> {event.date}</div>
                                    {event.type === 'virtual' ? (
                                        <div className="flex items-center gap-2"><Video className="w-4 h-4 text-galaxy-400" /> Virtual</div>
                                    ) : (
                                        <div className="flex items-center gap-2 max-w-full truncate"><MapPin className="w-4 h-4 text-galaxy-400" /> {event.location}</div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                                    <span className="text-2xl font-bold text-star-400">${event.price}</span>
                                    <button
                                        onClick={() => navigate(`/event/${event.id}`)}
                                        className="bg-white/10 hover:bg-white/20 hover:text-white text-gray-200 px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                                    >
                                        <Ticket className="w-4 h-4" /> Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
