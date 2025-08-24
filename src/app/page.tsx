import React from "react";

export default function Home() {
  return (
    <div className="bg-black text-[#00ff41] h-screen w-full p-4 md:p-8 overflow-hidden flex flex-col">
      {/* Overlay para el efecto de monitor CRT*/}
      <div
        className="fixed inset-0 z-10 pointer-events-none opacity-20 crt-overlay-glitch"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.7) 1px, transparent 1px)",
          backgroundSize: "1px 2px",
          filter: "saturate(1.5) constrast(1.2)",
        }}
      ></div>

      {/* Area de la terminal, donde apareceranb los mensajes 
          'overflow-y-auto' permite hacer scroll
          'whitespace-pre-wrap' respeta los salos de linea para el texto
      */}

      <div className=" flex-1 overflow-y-auto pr-2 z-20 whitespace-pre-wrap leading-tight">
        {/* Aqui es donde se renderizaran los mensajes del historial 
          por ahora, solo marcador de posicion
        */}

        <p>Bienvenido a mi portafolio. Para empezar, escribe &#39;help&#39;.</p>
        <br />
      </div>
      {/* Formulario de entrada de comandos */}
      <div className="flex-shrink-0 flex items-center mt-2 z-20">
        <span className="text-[#00ff41] mr-2">&gt;</span>
        <input 
          type="text"
          className="bg-transparent border-none outline-none text-[#00ff41] flex-1 caret-current autofocus"
        />
      </div>
    </div>
  );
}
