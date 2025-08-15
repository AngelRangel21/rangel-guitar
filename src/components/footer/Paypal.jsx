import { useI18n } from "@/context/i18n-context";

export function Paypal() {
    const { t } = useI18n(); // Hook para obtener traducciones.
    return (
        <div className="flex flex-1 flex-col justify-between items-center mb-4">
            <p className="text-center text-sm pb-2">{t('coffee')}:</p>
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
                    {t('donate')}
                </button>
            </a>
        </div>
    )
}
