import { useGame } from "../context/GameContext";
import React, { useEffect, useState } from "react";
import { ALLOWED_AVATAR_FILENAMES, getAvatarUrl } from '../data/AvatarData'; 
import { ButtonWithSFX } from '../components/SFXButton';
// import Timer from "./Timer";
import GameContainer from "../pages/GameContainer";
// import "../CSS/Game.css";
// import "../CSS/index.css";

import { Dropdown, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useHints } from "../context/HintsContext";


export const InfoModalUser = ({ showEnigma }) => {

  const {user, nivelActual, isUserLoading  } = useGame()
  const {totalHintsUsed} = useHints();

  if (showEnigma) {
    return null;
  }

    if (isUserLoading) {
        return <p>Cargando información del jugador...</p>;
    }
      if (!user) {
        return <p>Información de usuario no disponible.</p>;
    }

  function hintMessage(totalHintsUsed) {

    if (totalHintsUsed === 0) {
      return 'Aún no has usado pistas, ¡la ayuda está lista cuando la necesites!';
    } else if (totalHintsUsed === 1) {
      return 'Una pista ha sido revelada, pero aún queda ayuda disponible.';
    } else if (totalHintsUsed === 2) {
      return 'Solo te queda una pista, ¡úsala sabiamente!';
    } else if (totalHintsUsed >= 3) {
      return 'No queda más ayuda, ahora toca confiar en tu ingenio.';
    }

    return '';
  }

  const hints = [1, 2, 3];



const avatarSrc = user.avatar_filename ? user.avatar_filename : Game_img;

  return (


    <Dropdown drop="end">
      <Dropdown.Toggle 
                as="div" 
                className="profile-toggle-container " 
            >
                <img src={getAvatarUrl(user.avatar_filename)} 
                alt="Avatar de usuario" 
                className="avatar-img" />
            </Dropdown.Toggle>

      <Dropdown.Menu className="infomodal-type-top p-3 righteous background-brown">
        <p>Informe Clasificado</p>

        <div className="d-flex align-items-center gap-3 mb-3">
      
          <h3 className="modalUser-name righteous green">{user.username}</h3>
        </div>

        <p className="open-sans">Nivel : <strong>{nivelActual}</strong></p>
        <p className="open-sans-lite"> {hintMessage(totalHintsUsed)} </p>

        <div className="d-flex gap-3 mt-3 open-sans">
          {hints.map((number) => {
            const used = totalHintsUsed >= number
            const tooltipText = used
              ? " El secreto ya fue revelado."
              : "Un consejo espera, solo tienes que solicitarlo.";

            return (
              <OverlayTrigger
                key={number}
                placement="top"
                overlay={<Tooltip id={`tooltip-${number}`}>{tooltipText}</Tooltip>}
              >
                <button
                  disabled
                  className={`rounded-circle modalUser-hints btn btn-sm ${used
                    ? "modalUse-hints-used"
                    : "modalUse-hints-unused"}`}
                  aria-label={`Pista ${number}`}
                >
                  <i className="fa-solid fa-lightbulb"></i>
                </button>
              </OverlayTrigger>
            );
          })}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};