import { Outlet, useLocation } from "react-router-dom/dist"
import { useEffect, useCallback } from "react";
import { useGame } from "../context/GameContext";
import '../CSS/Responsive.css';
import '../CSS/General-UI.css';

import RotateDeviceImage from '../assets/img/rotate-device.png';

export function Layout() {
    const {
        audioPlayerRef,
        isMusicEnabled,
        setIsMusicEnabled,
        hasUserInteracted,
        setHasUserInteracted,
        audiusAudioUrl,
        logout,
    } = useGame();

    const location = useLocation();

    useEffect(() => {

        const musicRoutes = ['/level-1', '/level-2', '/level-victory', '/game-victory'];

        if (musicRoutes.includes(location.pathname)) {
            if (!isMusicEnabled) {
                console.log(`[Layout] Entrando en ruta de música (${location.pathname}). Habilitando música.`);
                setIsMusicEnabled(true);
            }
        } else {
            if (isMusicEnabled) {
                console.log(`[Layout] Saliendo de ruta de música (${location.pathname}). Deshabilitando música.`);
                setIsMusicEnabled(false);
            }
        }
        if (location.pathname === '/' && !hasUserInteracted && isMusicEnabled) {
            console.log("[Layout] Activando hasUserInteracted en la ruta '/' si la música está habilitada.");
            setHasUserInteracted(true);
        }
    }, [location.pathname, isMusicEnabled, setIsMusicEnabled, hasUserInteracted, setHasUserInteracted]);

    useEffect(() => {
        const handleFirstInteraction = () => {
            if (!hasUserInteracted) {
                setHasUserInteracted(true);
                console.log("[Layout] Primera interacción del usuario detectada. Música puede empezar a sonar.");
            }
        };

        document.addEventListener('click', handleFirstInteraction, { once: true });
        document.addEventListener('keydown', handleFirstInteraction, { once: true });

        return () => {
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
        };
    }, [hasUserInteracted, setHasUserInteracted]);

    const toggleMusicButtonHandler = useCallback(() => {
        const newState = !isMusicEnabled;
        setIsMusicEnabled(newState);

        if (newState && !hasUserInteracted) {
            setHasUserInteracted(true);
            console.log("[Layout] Música activada por botón. hasUserInteracted = true.");
        } else if (!newState) {
            console.log("[Layout] Música desactivada por botón.");
        }
    }, [isMusicEnabled, setIsMusicEnabled, hasUserInteracted, setHasUserInteracted]);

    return (
        <>
            <audio ref={audioPlayerRef} loop>
                <source src={audiusAudioUrl || ''} type="audio/mpeg" />
                Tu navegador no soporta la reproducción de audio.
            </audio>
            <div className="responsive-gestor-container">
                <Outlet />
            </div>

            <div className="orientation-message">
                <img src={RotateDeviceImage} alt="Por favor, gira tu dispositivo" />
                <p>Por favor, gira tu dispositivo para una mejor experiencia de juego.</p>
                <p>¡Gira tu pantalla a horizontal!</p>
            </div>
        </>
    );
}