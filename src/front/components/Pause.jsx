import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HowToPlay from './HowToPlay';
import { useGame } from '../context/GameContext';
import { ButtonWithSFX } from '../components/SFXButton';
import '../CSS/General-UI.css';

const Pause = ({ open, onClose }) => {
    const [musicOn, setMusicOn] = useState(true);
    const [effectsOn, setEffectsOn] = useState(true);
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const navigate = useNavigate();
    const { setMusicVolume, displayMusicVolume } = useGame();

    // Si se cierra el menú de pausa, también se cierra el modal de ayuda
    useEffect(() => {
        if (!open) setShowHowToPlay(false);
    }, [open]);

    if (!open) return null;

    return (
        <>
            <div className="pause-overlay d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1000 }}>
                <div className="pause-menu background-brown p-4 rounded shadow d-flex flex-column align-items-center" style={{ minWidth: '300px' }}>
                    <h2 className="righteous orange mb-4">PAUSA</h2>
                    <div className="d-flex flex-column gap-2 mt-4 w-100">
                        <ButtonWithSFX sfxName="BUTTON_CLICK" className="ClassicButton righteous mb-0 mt-2 rounded-pill px-4 py-2" onClick={() => setShowHowToPlay(true)}><h3>¿Cómo Jugar?</h3></ButtonWithSFX>
                        <div className="open-sans orange d-flex align-items-center gap-2 mt-3">
                            <span>Música</span>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                value={displayMusicVolume}
                                onChange={e => {
                                    const vol = parseFloat(e.target.value);
                                    setMusicVolume(vol);
                                    setMusicOn(vol > 0);
                                }}
                                style={{ width: '120px' }}
                            />
                            <span>{Math.round(displayMusicVolume * 100)}%</span>
                        </div>
                        
                        <ButtonWithSFX sfxName="BUTTON_CLICK" onClick={() => { onClose && onClose(); navigate('/dashboard'); }} className="righteous deletebutton mt-4 mb-3 rounded-pill px-2 py-1">Abandonar</ButtonWithSFX>
                    </div>
                    <ButtonWithSFX sfxName="BUTTON_CLICK" className="ClassicButton righteous mb-0 mt-4 rounded-pill px-4 py-2" onClick={onClose}><h3>Cerrar</h3></ButtonWithSFX>
                </div>
            </div>
            <HowToPlay open={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
        </>
    );
};

export default Pause;
