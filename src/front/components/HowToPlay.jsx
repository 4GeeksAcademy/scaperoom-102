import React, { useState } from 'react';
import { ButtonWithSFX } from '../components/SFXButton';

const HowToPlay = ({ open, onClose }) => {
    if (!open) return null;

    return (
        <div className="howtoplay-overlay position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ zIndex: 2000, background: 'rgba(0,0,0,0.7)' }}>
            <div className="howtoplay-modal background-brown p-4 shadow d-flex flex-column align-items-center">
                <p className="righteous green mb-3">¿CÓMO JUGAR?</p>
                <p className="mb-4 open-sans-lite orange text-center">
                    <h4>¡Bienvenido a <strong>Scaperoom 102</strong>!</h4><br />
                    Explora la habitación; encuentra enigmas y objetos que te ayudarán a descubrir pistas para resolver el <strong>puzzle final.</strong><br />
                    Tienes <strong>tres pistas por nivel</strong>, ¡pero ten cuidado! ¡Solo la primera es gratis, el resto penalizarán tu tiempo!<br />
                    <br />
                    Pulsa el <strong>botón de menú o la tecla ESC</strong> para pausar el juego.<br />
                    ¡Resuelve los acertijos y escapa lo más rápido posible! Cuanto menos tiempo tardes, mejor será tu posición en el ranking final.<br /><br />
                    ¡Disfruta de esta demo y no olvides dejarnos una buena reseña!
                </p>
                <ButtonWithSFX className="ClassicButton righteous mb-3 rounded-pill px-5 py-3" onClick={onClose}>Cerrar</ButtonWithSFX>
            </div>
        </div>
    );
};

export default HowToPlay;
