import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Plus, Calendar, BarChart, Clock, MapPin, Scan } from 'lucide-react';

export default function OrganizerDashboard() {
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            if (!currentUser) return;

            try {
                const q = query(
                    collection(db, "events"),
                    where("organizerId", "==", currentUser.uid)
                );
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
    }, [currentUser]);

    // Calculate stats
    const totalSales = events.reduce((acc, event) => acc + (event.ticketsSold || 0) * (event.price || 0), 0);
    const ticketsSold = events.reduce((acc, event) => acc + (event.ticketsSold || 0), 0);

    return (
        <div className="min-h-screen pt-20 px-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white text-glow mb-2">My Events</h1>
                    <p className="text-galaxy-300">Welcome back, {currentUser?.email}</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/create-event')} className="flex items-center gap-2 bg-galaxy-600 hover:bg-galaxy-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-galaxy-500/20">
                        <Plus className="w-5 h-5" /> Create Event
                    </button>
                    <button onClick={() => navigate('/scan')} className="flex items-center gap-2 bg-space-700/50 hover:bg-space-700 text-galaxy-300 px-4 py-2 rounded-xl transition-all border border-galaxy-500/30">
                        <Scan className="w-5 h-5" /> Scan
                    </button>
                    <button onClick={logout} className="border border-white/20 hover:bg-white/10 text-white px-4 py-2 rounded-xl transition-all">
                        Logout
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { title: 'Total Sales', value: `$${totalSales}`, icon: BarChart, color: 'text-green-400' },
                    { title: 'Active Events', value: events.length, icon: Calendar, color: 'text-blue-400' },
                    { title: 'Tickets Sold', value: ticketsSold, icon: BarChart, color: 'text-purple-400' },
                ].map((stat, i) => (
                    <div key={i} className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <stat.icon className="w-24 h-24" />
                        </div>
                        <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold mb-4 border-b border-white/10 pb-2">Event List</h2>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Loading your universe...</div>
            ) : events.length === 0 ? (
                <div className="glass-panel rounded-2xl p-6 min-h-[300px] flex flex-col items-center justify-center text-gray-400 gap-4">
                    <p>No active events found in this sector.</p>
                    <button onClick={() => navigate('/create-event')} className="text-galaxy-300 hover:text-white underline">Initiate your first event</button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {events.map(event => (
                        <div key={event.id} className="glass-panel p-6 rounded-xl flex justify-between items-center group hover:bg-white/5 transition-colors">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-galaxy-300 transition-colors">{event.title}</h3>
                                <div className="flex gap-4 text-sm text-gray-400">
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {event.date}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {event.time}</span>
                                    <span className="flex items-center gap-1 capitalize"><MapPin className="w-4 h-4" /> {event.type}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-xs border ${event.status === 'approved' ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-yellow-500/20 border-yellow-500 text-yellow-300'}`}>
                                    {event.status.toUpperCase()}
                                </span>
                                <p className="mt-2 text-sm text-gray-400">{event.ticketsSold}/{event.capacity} sold</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
