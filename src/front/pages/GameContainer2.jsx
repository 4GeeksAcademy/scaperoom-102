import { useRef, useState, useEffect } from "react";
import Level2BG from "../assets/img/level2_provisional/Level2-Background.png";
import "../CSS/level1.css";
import "../CSS/level2.css";
import "../CSS/Game.css";

import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { ObjectsLevel2 } from "../data/ObjectsArray";
import Timer from "../components/Timer";
import { Objects } from "../components/Objects";
import { InfoModalUser } from "../components/InfoModalUser";
import { EnigmaModal } from "../components/EnigmaModal";
import { EnigmasData } from "../data/EnigmasData";
import letra_pequeña from "../assets/img/Level2_img/letra_pequeña.png";
import imagen_borrosa from "../assets/img/Level2_img/imagen_borrosa.png";
import Pause from "../components/Pause";
import pantalla_final from '../assets/img/level2_provisional/pantalla_final.png';
import { ButtonWithSFX } from "../components/SFXButton";

// LAS CLASES QUE SE LLAMEN 'object-zone' NO SE LES PUEDE CAMBIAR EL NOMBRE
export default function GameContainer2() {
  const navigate = useNavigate();
  const {
    menuOpen,
    timerRef,
    setMenuOpen,
    isSafeCodeCorrect,
    setIsSafeCodeCorrect,
    setPickedUpObjects,
    nivelActual,
    setNivelActual,
    tiempo,
    setTiempo,
    saveGameProgress
  } = useGame()

  useEffect(() => {
    setNivelActual(2);
    const handleEsc = (e) => {
      if (e.key === "Escape") setMenuOpen((prev) => !prev);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setNivelActual]);

  const [selectedObject, setSelectedObject] = useState(null);
  const [showEnigma, setShowEnigma] = useState(false);
  const [currentEnigma, setCurrentEnigma] = useState(null);
  const [selectPictureCorrectBook, setSelectPictureCorrectBook] = useState(false);
  const [selectPictureCorrectTelescope, setSelectPictureCorrectTelescope] = useState(false);
  const [showFinalImage, setShowFinalImage] = useState(false);
  const [gameMessage, setGameMessage] = useState("");
  const [accumulatedTime, setAccumulatedTime] = useState(parseInt(sessionStorage.getItem('level1Timer') || 0));
  const id_clinex = 102
  const id_magnifying_glass = 103
  const id_telescope = 207
  const id_book = 206
  const id_safe = 205
  const id_calendar = 204
  const id_map = 203
  const id_safe_handle = 208

  useEffect(() => {
    setSelectedObject(null);
    setShowEnigma(false);
    setCurrentEnigma(null);
    setSelectPictureCorrectBook(false);
    setSelectPictureCorrectTelescope(false);
    setShowFinalImage(false);
    setGameMessage("");
    setIsSafeCodeCorrect(false);
  }, [setTiempo, setPickedUpObjects]);

  // función para manejar el objeto seleccionado
  const handleObjectUsed = (objectId) => {
    console.log(`Objeto (ID: ${objectId}) ha sido usado y se eliminará del inventario.`);
    setPickedUpObjects(prevObjects => prevObjects.filter(id => id !== objectId));
    setSelectedObject(null);
  };

  // Función para abrir cualquier enigma
  const handleEnigmaClick = (enigmaIdToOpen) => {
    setCurrentEnigma(enigmaIdToOpen);
    setShowEnigma(true);
    console.log(`Abriendo enigma ${enigmaIdToOpen}`);
    setSelectedObject(null);
  };

  // función para abrir la bola del mundo
  const handleMapClick = () => {
    handleEnigmaClick(id_map);
  }
  const handleCalendarClick = () => {
    handleEnigmaClick(id_calendar);
  }

  // Función para abrir enigma libro
  const handleBookClick = () => {
    if (selectedObject === id_magnifying_glass) {
      handleEnigmaClick(id_book);
      handleObjectUsed(id_magnifying_glass)
    } else {
      setGameMessage("¿Consigues leer lo que pone?")
      setSelectPictureCorrectBook(true);
      setSelectedObject(null);
      setTimeout(() => {
        setSelectPictureCorrectBook(false);
        setGameMessage("");
      }, 5000);
    }
  };

  // funcion para enigma de telescopio
  const handleTelescopeClick = () => {
    if (selectedObject === id_clinex) {
      handleEnigmaClick(id_telescope);
      handleObjectUsed(id_clinex);
    } else {
      setGameMessage("El telescopio está sucio. Necesitas algo para limpiarlo.");
      setSelectPictureCorrectTelescope(true);
      setSelectedObject(null);
      setTimeout(() => {
        setSelectPictureCorrectTelescope(false);
        setGameMessage("");
      }, 5000);
    }
  };

  const handleSafeClick = () => {
    handleEnigmaClick(id_safe);
  }

  //  Función para manejar la resolución de enigma final desde EnigmaModal
  const handleEnigmaSolved = (enigmaId, isCorrect) => {
    setShowEnigma(false);
    setCurrentEnigma(null);

    if (enigmaId === id_safe) {
      if (isCorrect) {
        setIsSafeCodeCorrect(true);
        setGameMessage("¡Felicidades! Has conseguido descifrar el codigo¡ Solo tienes que abrirla...");
        setTimeout(() => setGameMessage(""), 4000);
      }
    }
  }

  // funcion para manejar el clic en la manilla de la caja fuerte
  const handleSafeHandle = () => {
    let status = "completed";
    if (!isSafeCodeCorrect) {
      setGameMessage("Necesitas resolver el enigma de la caja fuerte para poder abrirla.");
      setTimeout(() => setGameMessage(""), 4000);
    } else {
      saveGameProgress((nivelActual + 1), (accumulatedTime + tiempo), status);
      setTiempo((accumulatedTime + tiempo));
      setShowFinalImage(true);
      setTimeout(() => {
        setShowFinalImage(false);
        navigate("/game-victory");
      }, 14000);

    }
  }

  // Función para aplicar penalización de tiempo
  const handlePenalty = (seconds) => {
    if (timerRef.current) {
      timerRef.current.addSeconds(seconds);
    }
  };

  const currentEnigmaData = EnigmasData.enigmasNivel2.find(e => e.id === currentEnigma)

  return (
    <div className="game-container-bg">
      <img src={Level2BG} className="bg-img" alt="BG Level2" />
      <ButtonWithSFX sfxName='PICK_OBJECT_COMMON' id="calendar" onClick={handleCalendarClick}></ButtonWithSFX>
      <ButtonWithSFX sfxName='PICK_OBJECT_COMMON' id="id_safe" onClick={handleSafeClick}></ButtonWithSFX>
      <ButtonWithSFX sfxName='PICK_OBJECT_COMMON' id="id_safe_handle" onClick={handleSafeHandle}></ButtonWithSFX>
      <ButtonWithSFX sfxName='PICK_OBJECT_COMMON' id="map" onClick={handleMapClick}></ButtonWithSFX>
      <ButtonWithSFX sfxName='PICK_OBJECT_COMMON' id="telescope" className='object-zone' onClick={handleTelescopeClick}></ButtonWithSFX>
      <ButtonWithSFX sfxName='PICK_OBJECT_COMMON' id="book" className='object-zone' onClick={handleBookClick}></ButtonWithSFX>
      <span id="pencilcase" ></span>
      <ButtonWithSFX sfxName='PICK_OBJECT_COMMON' id="ESC" onClick={() => setMenuOpen(true)}></ButtonWithSFX>
      {/* <ButtonWithSFX sfxName= 'PICK_OBJECT_COMMON' id="PlayerInfo"></ButtonWithSFX> */}

      <div className="game-message-container justfy-content-center align-items-center w-100 d-flex flex-column">

        {gameMessage && (
          <div className="mailbox-message background-brown rounded">
            <p>{gameMessage}</p>
          </div>
        )}

        {/* Imagen del imagen borrosa*/}
        {selectPictureCorrectTelescope && (
          <div className="enigma-image-overlay">
            <img src={imagen_borrosa} alt="imagen borrosa" className="enigma-zoom-image view-image" />
          </div>
        )}

        {/* Imagen del libro ilegible*/}
        {selectPictureCorrectBook && (
          <div className="enigma-image-overlay">
            <img src={letra_pequeña} alt="Texto ilegible del libro" className="enigma-zoom-image view-image" />
          </div>
        )}
      </div>

      {showEnigma && currentEnigmaData && (
        <EnigmaModal show={showEnigma} onEnigmaSolved={handleEnigmaSolved} onHide={() => setShowEnigma(false)} enigmaId={currentEnigma}
          timerRef={timerRef}
        />
      )}
      {showFinalImage && (
        <div className="final-image-overlay w-100"> {/* Esta clase la definiremos en CSS */}
          <img src={pantalla_final} alt="Repositorio Desbloqueado" className="final-image-content" />
        </div>
      )}


      <Timer className="timer" menuOpen={menuOpen} ref={timerRef} tiempo={tiempo} setTiempo={setTiempo} />

      <div className="menu-toggle">

        <InfoModalUser className="info-modal-user" showEnigma={showEnigma} />

      </div>
      <Pause open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Objects objectsLevel={ObjectsLevel2} onPenalty={handlePenalty} setSelectedObject={setSelectedObject} selectedObject={selectedObject} />

    </div>



  );
}
