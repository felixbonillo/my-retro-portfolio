'use client'
import React, { useState, useEffect, useRef } from 'react';

// Define la estructura de un comando para una mejor tipificación con TypeScript.
// Un comando es una función que toma un array de strings (argumentos) y devuelve un string.
interface Command {
    (args: string[]): string | Promise<string>;
}

// Llama a la API real de GitHub para obtener proyectos.
const fetchProjects = async (): Promise<string> => {
    const username = 'felixbonillo'; // Tu nombre de usuario de GitHub
    const url = `https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=5`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        // Define the type for a GitHub repository
        interface GitHubRepo {
            name: string;
            description: string | null;
            html_url: string;
        }

        // Formatea los datos de la respuesta en una cadena de texto.
        const projectList = (data as GitHubRepo[]).map((repo) => {
            return `- ${repo.name}: ${repo.description || 'Sin descripción'}\n  Enlace: ${repo.html_url}`;
        }).join('\n\n');

        return `Proyectos de GitHub de ${username}:\n\n${projectList}\n\n`;
    } catch (error) {
        console.error("Error al obtener proyectos:", error);
        return 'Error: No se pudieron cargar los proyectos. Intenta de nuevo más tarde.';
    }
};

// Usamos un Map para una gestión más limpia y escalable de los comandos.
const commands = new Map<string, Command>([
    ['help', () => 'Comandos disponibles:\n- about: Sobre mí\n- projects: Ver proyectos\n- contact: Contactarme\n- clear: Limpiar pantalla'],
    ['about', () => 'Soy Félix Bonillo, desarrollador frontend junior. Mis tecnologías principales son React, Next.js y Tailwind CSS. Siempre buscando aprender y crecer.'],
    ['projects', async () => {
        // Retornamos un mensaje de carga inicial y luego la respuesta de la API.
        return 'Cargando proyectos...';
    }],
    ['contact', () => 'Puedes contactarme en:\n- Correo: felix.bonillo3@gmail.com\n- LinkedIn: linkedin.com/in/felix-bonillo-b9368936b\n- WhatsApp: [Enlace o número]'],
    ['clear', () => ''], // El comando 'clear' ahora devuelve una cadena vacía. La lógica de limpieza se maneja en 'handleCommand'.
]);

// Este componente encapsula toda la lógica y la UI de la terminal.
export default function Terminal() {
    // Estado para el historial de la terminal (comandos y resultados).
    const [history, setHistory] = useState<{ type: 'command' | 'response', text: string }[]>([]);

    // Estado para el texto que el usuario está escribiendo actualmente.
    const [input, setInput] = useState('');

    // Estado para el mensaje de bienvenida animado.
    const [typedText, setTypedText] = useState('');

    // Referencia al contenedor de la terminal para hacer scroll automático.
    const terminalRef = useRef<HTMLDivElement>(null);

    // Referencia al input para enfocarlo automáticamente.
    const inputRef = useRef<HTMLInputElement>(null);

    // Mensaje de bienvenida para la animación
    const welcomeMessage = "- Bienvenido a mi portafolio. Para empezar, escribe 'help'.\n\n";

    // Efecto 1: Animación de 'máquina de escribir' para el mensaje de bienvenida.
    // Usamos setInterval de forma segura con un return para limpiarlo.
    useEffect(() => {
        let i = 0;
        const intervalId = setInterval(() => {
            // Si aún no hemos escrito todo el mensaje...
            if (i < welcomeMessage.length) {
                setTypedText(prev => prev + welcomeMessage.charAt(i));
                i++;
            } else {
                // ...si ya terminamos, detenemos el intervalo.
                clearInterval(intervalId);
            }
        }, 50);

        // Esta función de limpieza se ejecuta cuando el componente se desmonta.
        // Es crucial para evitar pérdidas de memoria.
        return () => clearInterval(intervalId);
    }, []);


    // Efecto 2: Hace scroll al final de la terminal y enfoca el input.
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [history, typedText]);

    // Maneja la entrada de comandos del usuario
    const handleCommand = async (e: React.FormEvent) => {
        e.preventDefault();
        const [command, ...args] = input.toLowerCase().trim().split(' ');

        // Primero, agregamos el comando del usuario al historial.
        setHistory(prev => [...prev, { type: 'command', text: `> ${input}` }]);

        // Verificamos si el comando existe en nuestro Map.
        const commandFunc = commands.get(command);

        if (command === 'clear') {
            // Si el comando es 'clear', limpiamos el historial.
            setHistory([]);
        } else if (commandFunc) {
            // Manejamos la posibilidad de que el comando sea una promesa (asíncrono).
            const response = await commandFunc(args);

            if (command === 'projects' && response === 'Cargando proyectos...') {
                // Si el comando es 'projects', mostramos el mensaje de carga...
                setHistory(prev => [...prev, { type: 'response', text: response }]);

                // ...y luego esperamos a la respuesta real.
                const projectsResponse = await fetchProjects();
                setHistory(prev => prev.slice(0, -1).concat([{ type: 'response', text: projectsResponse }]));
            } else {
                // Para los comandos síncronos, mostramos la respuesta de inmediato.
                setHistory(prev => [...prev, { type: 'response', text: response }]);
            }
        } else {
            // Si el comando no existe, mostramos un mensaje de error.
            setHistory(prev => [...prev, { type: 'response', text: `Comando no reconocido: '${command}'. Escribe 'help' para ver los comandos.` }]);
        }

        // Limpia el input para el siguiente comando.
        setInput('');
    };

    return (
        <div className="flex flex-col h-full w-full">
            <style>{`
        /* Efecto de ruido/grano para imitar una pantalla CRT */
        .crt::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            rgba(0,0,0,0.15),
            rgba(0,0,0,0.15) 1px,
            transparent 1px,
            transparent 3px
          );
          pointer-events: none;
          z-index: 10;
        }
        
        /* Animación para el efecto de la pantalla parpadeante */
        @keyframes flicker {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }

        .crt-flicker {
          animation: flicker 1s infinite;
        }

        /* Estilo para los scanlines */
        .scanlines::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            ellipse at center,
            rgba(0,0,0,0) 0%,
            rgba(0,0,0,0.8) 100%
          );
          opacity: 0.2;
          pointer-events: none;
        }
      `}</style>

            <div className="relative w-full h-full p-4 overflow-hidden rounded-lg shadow-lg"
                style={{
                    backgroundImage: 'linear-gradient(180deg, #1A202C 0%, #000000 100%)',
                    border: '2px solid #2D3748'
                }}>

                {/* El div principal con los efectos CRT y de parpadeo */}
                <div className="w-full h-full crt crt-flicker scanlines text-green-400 font-mono">
                    <div ref={terminalRef} className="flex-1 overflow-y-auto pr-2 z-20 whitespace-pre-wrap leading-tight">
                        {/*
              Muestra el texto de bienvenida animado.
              El 'cursor' parpadeante es una animación de Tailwind.
            */}
                        <div className="typed-text">
                            {typedText}
                            <span className="animate-pulse">_</span>
                        </div>

                        {history.map((entry, index) => (
                            <div key={index} className={entry.type === 'command' ? 'text-green-400' : 'text-gray-300'}>
                                {entry.text}
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleCommand} className="flex-shrink-0 flex items-center mt-2 z-20">
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
        </div>
    );
}
