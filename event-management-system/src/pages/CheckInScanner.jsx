import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from "html5-qrcode";
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, Camera, Check, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckInScanner() {
    const navigate = useNavigate();
    const [scanResult, setScanResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scannerActive, setScannerActive] = useState(false);

    useEffect(() => {
        // Dynamically start scanner
        let scanner = null;

        if (scannerActive) {
            scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
            );

            scanner.render(onScanSuccess, onScanFailure);
        }

        function onScanSuccess(decodedText, decodedResult) {
            // Handle the scanned code as you like, for example:
            if (!loading) {
                handleTicketValidation(decodedText);
                // Optionally pause scanner
                scanner.clear();
                setScannerActive(false);
            }
        }

        function onScanFailure(error) {
            // handle scan failure, usually better to ignore and keep scanning.
            // console.warn(`Code scan error = ${error}`);
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(error => {
                    // Failed to clear scanner. 
                    console.error("Failed to clear html5-qrcode scanner. ", error);
                });
            }
        };
    }, [scannerActive]);

    async function handleTicketValidation(dataString) {
        setLoading(true);
        try {
            // Parse data: usually we store JSON or just ID? 
            // In EventDetails we used: value={`TICKET:${ticket.id}`} due to previous issues, or simply ID.
            // Let's assume we expect "TICKET:ID" or JSON
            let ticketId = dataString;

            if (dataString.startsWith('TICKET:')) {
                ticketId = dataString.split(':')[1];
            } else {
                // Try strict JSON
                try {
                    const data = JSON.parse(dataString);
                    if (data.ticketId) ticketId = data.ticketId;
                } catch (e) {
                    // Not JSON, assume raw ID
                }
            }

            if (!ticketId) throw new Error("Invalid Format");

            const ticketRef = doc(db, "tickets", ticketId);
            const ticketSnap = await getDoc(ticketRef);

            if (!ticketSnap.exists()) {
                setScanResult({ status: 'error', message: 'Ticket does not exist in this dimension.' });
                toast.error("Invalid Ticket");
            } else {
                const ticketData = ticketSnap.data();
                if (ticketData.status === 'used') {
                    setScanResult({ status: 'warning', message: 'Ticket already used! Entry denied.' });
                    toast.error("Duplicate Entry Detected");
                } else {
                    // Success
                    await updateDoc(ticketRef, { status: 'used', checkInTime: new Date().toISOString() });
                    setScanResult({ status: 'success', message: 'Access Granted. Welcome aboard!', data: ticketData });
                    toast.success("Check-in Successful");
                }
            }

        } catch (error) {
            setScanResult({ status: 'error', message: 'Scan failed. Data corrupted.' });
            toast.error("Scanning Error");
        } finally {
            setLoading(false);
        }
    }

    const resetScanner = () => {
        setScanResult(null);
        setScannerActive(true);
    };

    return (
        <div className="min-h-screen pt-20 px-4 max-w-lg mx-auto">
            <button onClick={() => navigate('/organizer')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                <ArrowLeft className="w-5 h-5" /> Back to Dashboard
            </button>

            <div className="glass-panel p-6 rounded-2xl">
                <h1 className="text-2xl font-bold mb-6 text-center text-white flex items-center justify-center gap-2">
                    <Camera className="text-galaxy-400" /> Ticket Scanner
                </h1>

                {!scanResult ? (
                    <div className="space-y-4">
                        {scannerActive ? (
                            <div id="reader" className="overflow-hidden rounded-xl border-2 border-galaxy-500/50"></div>
                        ) : (
                            <div className="text-center py-10 bg-space-800/50 rounded-xl">
                                <p className="text-gray-400 mb-4">Ready to scan attendees</p>
                                <button onClick={() => setScannerActive(true)} className="bg-galaxy-600 hover:bg-galaxy-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg">
                                    Activate Scanner
                                </button>
                            </div>
                        )}
                        <p className="text-center text-xs text-gray-500">Align QR Code within the frame</p>
                    </div>
                ) : (
                    <div className="text-center space-y-6 pt-4">
                        {scanResult.status === 'success' && (
                            <div className="flex flex-col items-center animate-bounce-short">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
                                    <Check className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-green-400">Access Granted</h2>
                                <p className="text-white mt-2">{scanResult.data.eventTitle}</p>
                                <p className="text-gray-400 text-sm">{scanResult.data.userEmail}</p>
                            </div>
                        )}

                        {scanResult.status === 'warning' && (
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/30">
                                    <AlertTriangle className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-yellow-500">Already Checked In</h2>
                                <p className="text-gray-400 mt-2">{scanResult.message}</p>
                            </div>
                        )}

                        {scanResult.status === 'error' && (
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-red-500/30">
                                    <X className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
                                <p className="text-gray-400 mt-2">{scanResult.message}</p>
                            </div>
                        )}

                        <button onClick={resetScanner} className="w-full bg-space-800 hover:bg-space-700 text-white font-bold py-3 rounded-xl border border-galaxy-500/30 transition-all mt-6">
                            Scan Next Ticket
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
