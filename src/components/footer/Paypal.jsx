export function Paypal() {
    return (
        <div className="flex flex-1 flex-col justify-between items-center mb-4">
            <p className="text-center text-sm pb-2">Invitarme un cafe con PayPal:</p>
            <a
            href="https://www.paypal.com/paypalme/angelrangelm"
            target="_blank" 
            rel="noopener noreferrer"
            >
                <button 
                className="w-80 text-center text-sm bg-yellow-500 
                text-white font-bold py-2 px-4 rounded 
                hover:bg-yellow-700 transition-colors duration-300"
                >
                    Donar con PayPal
                </button>
            </a>
        </div>
    );
}