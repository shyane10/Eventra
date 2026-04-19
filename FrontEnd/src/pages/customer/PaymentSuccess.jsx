import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, Loader2, AlertCircle, Calendar, Ticket, FileDown, Receipt } from "lucide-react";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [bookingData, setBookingData] = useState(null);
    const [isProductOrder, setIsProductOrder] = useState(false);

    const pidx = searchParams.get("pidx");

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.post("http://localhost:5000/api/payment/verify", 
                    { pidx },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.data.success) {
                    setStatus("success");
                    const data = response.data.booking || response.data.order;
                    setBookingData(data);
                    setIsProductOrder(!!response.data.order);
                    
                    if (response.data.order) {
                        localStorage.removeItem('eventra_cart');
                    }
                } else {
                    setStatus("error");
                }
            } catch (err) {
                console.error("Verification error:", err);
                setStatus("error");
            }
        };

        if (pidx) {
            verifyPayment();
        } else {
            setStatus("error");
        }
    }, [pidx]);

    const handleDownloadReceipt = async () => {
        try {
            const token = localStorage.getItem("token");
            const type = isProductOrder ? "Order" : "Booking";
            const response = await axios.get(`http://localhost:5000/api/payment/invoice/${type}/${bookingData._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const invoice = response.data.invoice;
            
            // Create a printable layout in a new tab
            const printWindow = window.open('', '_blank');
            const itemsHtml = isProductOrder 
                ? invoice.items.map(item => `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">रू ${item.price}</td>
                    </tr>
                `).join('')
                : `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${invoice.event.title}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${invoice.quantity}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">रू ${invoice.totalPaid / invoice.quantity}</td>
                    </tr>
                `;

            printWindow.document.write(`
                <html>
                    <head>
                        <title>Invoice - Eventra</title>
                        <style>
                            body { font-family: 'Inter', sans-serif; color: #333; margin: 40px; }
                            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
                            .logo { font-size: 24px; font-weight: 900; font-style: italic; }
                            .invoice-details { margin: 30px 0; display: flex; justify-content: space-between; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th { background: #f8f9fa; padding: 12px; text-align: left; }
                            .total { margin-top: 30px; text-align: right; font-size: 1.2rem; font-weight: bold; }
                            @media print { .no-print { display: none; } }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <div class="logo">EVENTRA</div>
                            <div>
                                <h1 style="margin: 0;">INVOICE</h1>
                                <p style="margin: 0; color: #666;">Date: ${new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div class="invoice-details">
                            <div>
                                <strong>Billed To:</strong>
                                <p>${invoice.user.name}<br>${invoice.user.email}</p>
                            </div>
                            <div>
                                <strong>Payment Info:</strong>
                                <p>Transaction ID: ${invoice.transactionId || 'Completed'}<br>Method: Khalti</p>
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                        </table>
                        <div class="total">
                            Total Paid: रू ${invoice.totalPaid.toLocaleString()}
                        </div>
                        <div style="margin-top: 50px; text-align: center; color: #999; font-size: 0.8rem;">
                            Thank you for using Eventra! This is an electronically generated receipt.
                        </div>
                        <script>
                            window.onload = () => { window.print(); };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        } catch (err) {
            alert("Failed to generate receipt.");
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 text-center shadow-2xl">
                
                {status === "verifying" && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <Loader2 className="animate-spin text-blue-500" size={64} />
                        </div>
                        <h1 className="text-2xl font-black">Verifying Payment...</h1>
                        <p className="text-slate-400">Please wait while we confirm your transaction with Khalti.</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="flex justify-center">
                            <div className="bg-emerald-500/20 p-4 rounded-full">
                                <CheckCircle2 className="text-emerald-500" size={64} />
                            </div>
                        </div>
                        <h1 className="text-3xl font-black text-white">Payment Successful!</h1>
                        <p className="text-slate-400 font-medium">
                            {isProductOrder ? "Your order has been placed successfully." : "Your tickets have been confirmed. Get ready for the experience!"}
                        </p>
                        
                        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-left space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Receipt size={16} className="text-purple-500" />
                                <span className="text-slate-500 uppercase font-black text-[10px] tracking-widest">Transaction Details</span>
                            </div>
                            <p className="font-mono text-blue-400 text-xs break-all">{bookingData?.transactionId || "Confirmed via Khalti"}</p>
                        </div>

                        <div className="pt-4 space-y-3">
                            <button 
                                onClick={handleDownloadReceipt}
                                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-xl transition"
                            >
                                <FileDown size={18} /> DOWNLOAD RECEIPT
                            </button>
                            <button 
                                onClick={() => navigate("/history")}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition shadow-lg shadow-blue-900/20 uppercase tracking-tight"
                            >
                                {isProductOrder ? "View Orders" : "View Tickets"}
                            </button>
                            <Link 
                                to="/home"
                                className="block text-slate-500 hover:text-white transition font-bold text-sm pt-2"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="bg-red-500/20 p-4 rounded-full">
                                <AlertCircle className="text-red-500" size={64} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-black">Payment Failed</h1>
                        <p className="text-slate-400">We couldn't verify your payment. If money was deducted, please contact support.</p>
                        <button 
                            onClick={() => navigate("/booking")}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-xl transition"
                        >
                            TRY AGAIN
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PaymentSuccess;
