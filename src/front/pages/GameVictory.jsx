import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { ButtonWithSFX } from '../components/SFXButton';
import '../CSS/General-UI.css';

export function GameVictory() {
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/api";
    const { tiempo } = useGame();

    return (
        <div>
            <div className="text-center mt-5 py-5 container col-9">
                <div className="background-green form-background d-flex flex-column align-items-center w-100">
                    <div className="righteous ranking-number header-background d-flex justify-content-between w-100 ps-2">
                        <p className="header-title righteous mt-5 yellow mb-5 ms-5 ps-5 pt-3 d-flex flex-column">¡VICTORIA!</p>
                    </div>
                    <div className="menu-content-victory mt-3">
                        <p className="righteous orange mt-4">¡Te has pasado el juego!</p>
                        <p className="righteous orange"> Has empleado {Math.floor(tiempo / 60)} minutos y {String(tiempo % 60).padStart(2, "0")} segundos</p>
                        <p className="righteous-lite orange">Muchas gracias por jugar a la demo, <br /> ¡No te olvides de ver tu puntuación en el ranking!</p>
                        <div className="d-flex flex-column align-items-center">
                            <ButtonWithSFX sfxName="BUTTON_CLICK" className="ClassicButton-Variation righteous mb-0 mt-4 rounded-pill px-4 py-3" onClick={() => navigate(`/dashboard`)}><h3>Volver al inicio</h3></ButtonWithSFX>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}