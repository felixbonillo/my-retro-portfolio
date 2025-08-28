import Terminal from './Terminal'

//Maqueta de computadora retro
//Recibe un children (Componente Terminal)

export default function RetroPC() {
    return (
        //Contenedor principal de la pc con efectos
        <div className="flex justify-center items-center h-screen w-full p-4 md:p-8">
            {/* Overlay para efecto de monitor */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7) 1px, transparent 1px)',
                backgroundSize: '1px 2px',
                animation: 'glitch 0.2s infinite',
                filter: 'saturate(1.5) contrast(1.2)'
            }}></div>

            <div className="relative w-full max-w-5xl aspect-[1.5/1] bg-[#FAEBD7] rounded-lg p-6 md:p-10 shadow-lg border-t-4 border-l-4 border-r-2 border-b-2 border-gray-900 z-10 flex flex-col">
                <div className="absolute top-2 left-2 right-2 flex justify-between items-center text-gray-900 text-sm font-bold">
                    <span>POWER</span>
                    <span>HDD</span>
                </div>
                <div className="absolute top-8 left-4 right-4 flex justify-between items-center text-gray-400 text-xs">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-gray-400 text-sm flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-1 bg-gray-700 rounded-full"></div>
                        <div className="w-8 h-1 bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="text-sm font-bold">PC-Front-End Jr.</div>
                </div>

                {/*Este es el contenedor de la pantalla */}
                <div className="bg-black border-2 border-gray-900 shadow-inner rounded-sm flex-1 mb-8 p-1">
                    <Terminal />
                </div>

            </div>
        </div>
    )
}