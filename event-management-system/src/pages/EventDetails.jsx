import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, addDoc, collection, increment } from 'firebase/firestore';
import { Calendar, MapPin, Video, Ticket, Clock, ArrowLeft, CreditCard, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from "react-qr-code";

export default function EventDetails() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPayment, setShowPayment] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        async function fetchEvent() {
            try {
                const docRef = doc(db, "events", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setEvent({ id: docSnap.id, ...docSnap.data() });
                } else {
                    toast.error("Event not found");
                    navigate('/');
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchEvent();
    }, [id, navigate]);

    const handleBuyTicket = async () => {
        setProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const ticketData = {
                eventId: event.id,
                eventTitle: event.title,
                userId: currentUser.uid,
                userEmail: currentUser.email,
                purchaseDate: new Date().toISOString(),
                status: 'valid',
                price: event.price
            };

            const ticketRef = await addDoc(collection(db, "tickets"), ticketData);
            const eventRef = doc(db, "events", event.id);
            await updateDoc(eventRef, {
                ticketsSold: increment(1)
            });

            setTicket({ id: ticketRef.id, ...ticketData });
            setShowPayment(false);
            toast.success("Ticket acquired!", { icon: '🎟️' });
        } catch (error) {
            console.error("Purchase failed:", error);
            toast.error("Transaction failed.");
        }
        setProcessing(false);
    };

    if (loading) return <div className="text-white text-center pt-20">Loading...</div>;
    if (!event) return null;

    return (
        <div className="min-h-screen pt-20 px-4 max-w-5xl mx-auto">
            <button onClick={() => navigate('/')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="glass-panel p-8 rounded-2xl">
                <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
                <div className="flex gap-4 text-gray-400 mb-6 text-sm">
                    <span className="flex gap-1 items-center"><Calendar className="w-4 h-4" /> {event.date}</span>
                    <span className="flex gap-1 items-center"><Clock className="w-4 h-4" /> {event.time}</span>
                    <span className="flex gap-1 items-center capitalize"><MapPin className="w-4 h-4" /> {event.type}</span>
                </div>

                <p className="text-gray-300 mb-8 leading-relaxed max-w-3xl">{event.description}</p>

                <div className="glass-panel p-6 inline-block min-w-[300px] text-center bg-space-800/50">
                    <div className="text-sm text-gray-400 mb-1">Price</div>
                    <div className="text-4xl font-bold text-white mb-6">${event.price}</div>

                    {ticket ? (
                        <div className="bg-white p-4 rounded-xl inline-block">
                            {/* Simplified QRCode to avoid tool parsing issues */}
                            <QRCode value={`TICKET:${ticket.id}`} size={120} />
                            <p className="text-black text-xs mt-2 font-bold">TICKET CONFIRMED</p>
                        </div>
                    ) : (
                        <button onClick={() => setShowPayment(true)} className="w-full bg-galaxy-600 hover:bg-galaxy-500 text-white font-bold py-3 rounded-xl transition-all">
                            Get Ticket
                        </button>
                    )}
                </div>
            </div>

            {showPayment && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-panel p-6 rounded-2xl max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CreditCard className="text-galaxy-400" /> Confirm Purchase</h2>
                        <p className="mb-6 text-gray-300">Total: <span className="text-white font-bold">${event.price}</span></p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowPayment(false)} className="flex-1 py-2 rounded-lg border border-white/10 hover:bg-white/5">Cancel</button>
                            <button onClick={handleBuyTicket} disabled={processing} className="flex-1 bg-galaxy-600 hover:bg-galaxy-500 text-white font-bold py-2 rounded-lg">
                                {processing ? '...' : 'Pay Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
