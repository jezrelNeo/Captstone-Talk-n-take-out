// receipt-app.js — LOGO FIXED + PERFECT FOR 80mm THERMAL PRINTER
function ReceiptApp() {
  const [order, setOrder] = React.useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('data');
    if (!raw) return;

    try {
      const decoded = decodeURIComponent(escape(atob(raw)));
      setOrder(JSON.parse(decoded));
    } catch (e) {
      console.error("Invalid receipt data");
    }
  }, []);

  const print = () => window.print();

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="text-center bg-white p-12 rounded-3xl shadow-2xl">
          <h1 className="text-4xl font-bold text-red-600 mb-6">No Receipt Found</h1>
          <a href="order.html" className="px-12 py-5 bg-blue-600 text-white text-2xl font-bold rounded-2xl hover:bg-blue-700 shadow-lg">
            Back to Menu
          </a>
        </div>
      </div>
    );
  }

  const total = parseFloat(order.total || 0);

  return (
    <>
      {/* PERFECT PRINT + SCREEN STYLES */}
      <style jsx>{`
        @media print {
          body { margin: 0; padding: 0; background: white !important; }
          .no-print { display: none !important; }
          .receipt { width: 80mm; margin: 0 auto; font-family: 'Courier New', monospace; }
          .logo { width: 60mm; height: auto; margin: 10px auto; display: block; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .bold { font-weight: bold; }
          .text-lg { font-size: 16px; }
          .divider { border-top: 2px dashed #000; margin: 15px 0; }
          .mt-4 { margin-top: 16px; }
        }
        @media screen {
          .receipt { max-width: 400px; margin: 30px auto; }
          .logo { width: 120px; height: 120px; }
        }
      `}</style>

      <div className="min-h-screen bg-gray-100 py-8">
        <div className="receipt bg-white shadow-2xl rounded-3xl overflow-hidden">

          {/* HEADER WITH PERFECT LOGO */}
          <div className="text-center pt-8 pb-4 bg-gradient-to-b from-blue-50 to-white">
            {/* LOGO — NOW NEVER CROPPED */}
            <img 
              src="assets/img/Logo2.png" 
              alt="Skyhawk Logo" 
              className="logo rounded-full border-4 border-white shadow-2xl mx-auto object-contain bg-white"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=SKYHAWK'; }}
            />
            
            <h1 className="text-3xl font-bold mt-6 tracking-wider">SKYHAWK RESTO BAR</h1>
            <p className="text-sm mt-2 opacity-80">Rizal St., Iloilo City</p>
            <p className="text-xs mt-1">VAT Reg TIN: 123-456-789-000</p>
            <p className="text-xs">Tel: (033) 123-4567</p>
          </div>

          <div className="divider"></div>

          {/* ORDER INFO */}
          <div className="px-8 py-4 text-sm">
            <div className="grid grid-cols-2 gap-y-2">
              <span>Order ID:</span> 
              <span className="text-right font-bold">{order.orderId}</span>
              
              <span>Date/Time:</span>
              <span className="text-right">{new Date(order.timestamp).toLocaleString('en-PH')}</span>
              
              <span>Type:</span>
              <span className="text-right font-bold text-blue-600">{order.orderType}</span>
            </div>
          </div>

          <div className="divider"></div>

          {/* ITEMS */}
          <div className="px-8 py-4 text-sm">
            {order.items.map((item, i) => (
              <div key={i} className="grid grid-cols-3 py-2 border-b border-gray-300 last:border-0">
                <div className="col-span-2">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-600">
                    ₱{parseFloat(item.price || 0).toFixed(2)} × {item.quantity}
                  </div>
                </div>
                <div className="text-right font-bold">
                  ₱{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="divider"></div>

          {/* SUMMARY */}
          <div className="px-8 py-6 bg-gray-50 text-lg font-bold">
            <div className="flex justify-between text-2xl pt-4 border-t-4 border-double border-gray-800">
              <span className="font-extrabold">TOTAL</span>
              <span className="text-blue-700">₱{total.toFixed(2)}</span>
            </div>
          </div>

          {/* FOOTER */}
          <div className="text-center py-8 text-sm bg-gray-100">
            <p className="text-2xl font-bold mb-2">THANK YOU!</p>
            <p className="opacity-80">This serves as your Official Receipt</p>
            <p className="mt-4 text-xs opacity-60">
              Powered by Skyhawk POS • {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* SCREEN-ONLY BUTTONS */}
        <div className="no-print max-w-md mx-auto mt-10 flex gap-6 justify-center pb-10">
          <button
            onClick={print}
            className="flex-1 py-6 bg-green-600 text-white text-2xl font-bold rounded-3xl shadow-2xl hover:bg-green-700 transform hover:scale-105 transition-all flex items-center justify-center gap-4"
          >
            PRINT RECEIPT
          </button>
          <a
            href="order.html"
            className="flex-1 py-6 bg-orange-600 text-white text-2xl font-bold rounded-3xl shadow-2xl hover:bg-orange-700 transform hover:scale-105 transition-all text-center block"
          >
            NEW ORDER
          </a>
        </div>
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ReceiptApp />);