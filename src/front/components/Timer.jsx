import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import useChrono from "../hooks/useChrono";

const Timer = forwardRef(function Timer({ menuOpen, tiempo, setTiempo }, ref) {
    const { seconds, start, pause, addSeconds } = useChrono(true);
    const pausedByMenu = useRef(false);

    useImperativeHandle(ref, () => ({
        addSeconds
    }));

    useEffect(() => {
        setTiempo(seconds);
    }, [seconds, setTiempo]);

    useEffect(() => {
        if (menuOpen) {
            pause();
            pausedByMenu.current = true;
        } else if (pausedByMenu.current) {
            start();
            pausedByMenu.current = false;
        }
    }, [menuOpen, pause, start]);

    return (
        <div className="timer">
            <div className="righteous orange timer-position background-brown rounded-pill px-4 py-1">
                {String(Math.floor(seconds / 3600)).padStart(2, '0')}:
                {String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}:
                {String(seconds % 60).padStart(2, '0')}
            </div>
        </div>
    );
});

export default Timer;
