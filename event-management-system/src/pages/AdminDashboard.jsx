import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Check, X, Shield, Calendar, Clock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const { logout } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        try {
            const q = query(collection(db, "events"), where("status", "==", "pending"));
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

    async function handleApprove(id) {
        try {
            await updateDoc(doc(db, "events", id), { status: 'approved' });
            toast.success("Event engaged into active sector.", { icon: '✅' });
            fetchEvents();
        } catch (error) {
            toast.error("Process failed.");
        }
    }

    async function handleReject(id) {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteDoc(doc(db, "events", id));
            toast.error("Event termination confirmed.", { icon: '🗑️' });
            fetchEvents();
        } catch (error) {
            toast.error("Deletion failed.");
        }
    }

    return (
        <div className="min-h-screen pt-20 px-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-white text-glow flex items-center gap-3">
                    <Shield className="w-10 h-10 text-nebula-500" /> Admin Command
                </h1>
                <button onClick={logout} className="border border-white/20 hover:bg-white/10 text-white px-4 py-2 rounded-xl transition-all">
                    Logout
                </button>
            </div>

            <div className="glass-panel rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-4">Pending Approvals ({events.length})</h2>

                {loading ? (
                    <div className="text-center py-10 text-gray-400">Scanning frequency...</div>
                ) : events.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">All systems nominal. No pending requests.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-400 text-sm border-b border-white/10">
                                    <th className="pb-4 pl-4">Event Name</th>
                                    <th className="pb-4">Organizer</th>
                                    <th className="pb-4">Details</th>
                                    <th className="pb-4 text-right pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {events.map((event) => (
                                    <tr key={event.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-4 pl-4 font-medium">
                                            <div className="text-white">{event.title}</div>
                                            <div className="text-xs text-gray-500">{event.id}</div>
                                        </td>
                                        <td className="py-4 text-gray-300">
                                            <div>{event.organizerEmail}</div>
                                        </td>
                                        <td className="py-4 text-gray-400 text-sm">
                                            <div className="flex gap-4">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                                                <span className="flex items-center gap-1 capitalize"><MapPin className="w-3 h-3" /> {event.type}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-right pr-4">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleApprove(event.id)} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/40 transition-colors" title="Approve">
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleReject(event.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 transition-colors" title="Reject">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
