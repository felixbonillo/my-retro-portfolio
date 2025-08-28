"use client";
import React, { useState, useEffect, useRef } from "react";

interface Command {
    (args: string[]): { type: "response" | "command"; text: string };
}

//Definimos comnando y sus repuesta como un objeto para hacerlo dinamico

const commands: { [key: string]: (args: string[]) => string } = {
    help: () =>
        "Comandos disponibles: \n- about: Sobre mi \n- projects: Ver proyectos\n- contact: Contactame\n- clear: Limpiar la terminal",
    about: () =>
        "Soy Félix Bonillo, desarrollador frontend junior. Mis tecnologías principales son React, Next.js y Tailwind CSS. Siempre buscando aprender y crecer.",
    projects: () => "Cargando proyectos ...",
    contact: () =>
        "Puedes contactarme en:\n- Correo: felixbdev@gmail.com\n- LinkedIn: linkedin.com/in/felix-bonillo-b9368936b\n- WhatsApp: +584242105019",
    clear: () => "",
};

//Componente para encapsular toda la logica y la UI de la terminal
export default function Terminal() {
    //Estado para el historial de la terminal (Comandos, resultados)
    const [history, setHistory] = useState<
        { type: "command" | "response"; text: string }[]
    >([]);

    //Estado para el texto que l usuario esta escribiendo actualmente
    const [input, setInput] = useState("");

    //Estado para el mensaje de bienvenida animado
    const [typedText, setTypedText] = useState("");

    //Referencia al contenedor de la terminal para hacer scrolll automatico
    const terminalRef = useRef<HTMLDivElement>(null);

    //Referencia al input para enfocarlo automaticamente
    const inputRef = useRef<HTMLInputElement>(null);

    //Mensaje para la bienvenida animada
    const welcomeMessage =
        "Bienvenido a mi portafolio. Para empezar, escribe 'help' .\n\n";

    //Efecto 1: Animacion de maquina de escribir para el mensaje de bienvenida
    useEffect(() => {
        let i = 0;
        const typing = setInterval(() => {
            if (i < welcomeMessage.length) {
                setTypedText((prev) => prev + welcomeMessage.charAt(i));
                i++;
            } else {
                clearInterval(typing);
            }
        }, 50); // Velocidad de escritura (ms)
        return () => clearInterval(typing);
    }, []);

    //Efecto 2: Hace scroll al final de la terminal y enfoca el input
    useEffect(() => {
        if (terminalRef.current)
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        if (inputRef.current) inputRef.current.focus();
    }, [history, typedText]);

    //Maneja la entrada de comandos del usuario

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const [command, ...args] = input.toLowerCase().trim().split(" ");
        if (!command) return; // Ignora entradas vacias

        //Comando del usuario al historial
        setHistory((prev) => [...prev, { type: "command", text: `> ${input}` }]);

        //Verificamos si el comando existe en nuestro objeto de comandos
        const commandFunc = commands[command];

        if (command === "clear") {
            //Si el comando es clear limpiamos el historial
            setHistory([]);
        } else if (commandFunc) {
            //Si el comando existe ejecutamos la funcion asociada y agregamos la respuesta
            const response = commandFunc(args);
            setHistory((prev) => [...prev, { type: "response", text: response }]);
        } else {
            //Si el comando no existe, mostramos un mensaje de error
            setHistory((prev) => [
                ...prev,
                {
                    type: "response",
                    text: `Comando no reconocido: '${command}'. Escribe 'help' para ver los comandos.`,
                },
            ]);
        }
        //Limpia el input para el siguiente comando
        setInput("");
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div
                ref={terminalRef}
                className="flex-1 overflow-y-auto pr-2 z-20 whitespace-pre-wrap leading-tight"
            >
                <div className="typed-text">
                    {typedText}
                    <span className="animate-pulse">_</span>
                </div>

                {history.map((entry, index) => (
                    <div
                        key={index}
                        className={
                            entry.type === "command" ? "text-green-400" : "text-gray-300"
                        }
                    >
                        {entry.text}
                    </div>
                ))}
            </div>

            <form
                onSubmit={handleCommand}
                className="flex-shrink-0 flex items-center mt-2 z-20"
            >
                <span className="text-green-400 mr-2">&gt;</span>
                <input
                    ref={inputRef}
                    type="text"
                    className="bg-transparent border-none outline-none text-green-400 flex-1 caret-green-400"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </form>
        </div>
    );
}
