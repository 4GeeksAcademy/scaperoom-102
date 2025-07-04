import { useRef, useState, useEffect } from "react";
import Level1BG from "../assets/img/Level1_img/Level1-Background.png";
import "../CSS/level1.css";
import "../CSS/Game.css";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { ObjectsLevel1 } from "../data/ObjectsArray";
import Timer from "../components/Timer";
import { Objects } from "../components/Objects";
import { InfoModalUser } from "../components/InfoModalUser";
import { EnigmaModal } from "../components/EnigmaModal";
import { EnigmasData } from "../data/EnigmasData";
import despacho_vacio from "../assets/img/Level1_img/Level1-despacho_vacio.png";
import despacho_lleno from "../assets/img/Level1_img/Level1-despacho_sr.png";
import Pause from "../components/Pause";
import Avatar_01 from '../assets/img/UI/Avatars/Avatar_01.png';
import Avatar_02 from '../assets/img/UI/Avatars/Avatar_02.png';
import Avatar_03 from '../assets/img/UI/Avatars/Avatar_03.png';
import Default_Avatar from '../assets/img/UI/Avatars/default_avatar.png';
import { ButtonWithSFX } from "../components/SFXButton";

const avatarMap = {
  "Avatar_01.png": Avatar_01,
  "Avatar_02.png": Avatar_02,
  "Avatar_03.png": Avatar_03,
  "default_avatar.png": Default_Avatar,
};

export default function GameContainer() {

  const {
    menuOpen,
    timerRef,
    setMenuOpen,
    setPickedUpObjects,
    isGearboxCodeCorrect,
    setIsGearboxCodeCorrect,
    hasLookedRoom,
    setHasLookedRoom,
    nivelActual,
    user,
    tiempo,
    setTiempo,
    saveGameProgress,


  } = useGame()


  const navigate = useNavigate();
  const [selectedObject, setSelectedObject] = useState(null);
  const [showEnigma, setShowEnigma] = useState(false);
  const [currentEnigma, setCurrentEnigma] = useState(null);
  const [mailboxMessage, setMailboxMessage] = useState("")
  const [gameMessage, setGameMessage] = useState("");
  const [showRoomImage, setShowRoomImage] = useState(false);
  const currentEnigmaData = EnigmasData.enigmasNivel1.find(e => e.id === currentEnigma)
  const id_key = 101
  const id_box_letter = 1
  const id_gearbox = 2


  useEffect(() => {
    setPickedUpObjects([]);
    setIsGearboxCodeCorrect(false);
    setHasLookedRoom(false);
    setSelectedObject(null);
    setShowEnigma(false);
    setCurrentEnigma(null);
    setMailboxMessage("");
    setGameMessage("");
    setShowRoomImage(false);
  }, [setTiempo, setPickedUpObjects, setIsGearboxCodeCorrect, setHasLookedRoom]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setMenuOpen((prev) => !prev);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // función para manejar el objeto seleccionado
  const handleObjectUsed = (objectId) => {
    console.log(`Objeto (ID: ${objectId}) ha sido usado y se eliminará del inventario.`);
    setPickedUpObjects(prevObjects => prevObjects.filter(id => id !== objectId));
    setSelectedObject(null);
  };

  // Función para abrir cualquier enigma
  const handleEnigmaClick = (enigmaIdToOpen) => {
    console.log("handleEnigmaClick llamado con ID:", enigmaIdToOpen)
    const enigma = EnigmasData.enigmasNivel1.find(e => e.id === enigmaIdToOpen);
    if (enigma) {
      setCurrentEnigma(enigmaIdToOpen);
      setShowEnigma(true);
      console.log(`Abriendo enigma ${enigmaIdToOpen}`)
    } else {
      console.log(`ERROR: Enigma ${enigmaIdToOpen} no encontrado.`);
    }
    setSelectedObject(null)
    setMailboxMessage("")
  }

  // Función para abrir enigma buzón
  const handleMailboxClick = () => {
    console.log("Clic en el buzón detectado.");
    if (selectedObject === id_key) {
      handleEnigmaClick(id_box_letter);
      handleObjectUsed(id_key)
    } else {
      console.log("No tienes la llave seleccionada, o no es la llave correcta para el buzón.");
      setMailboxMessage("Parece que necesitas algo para abrir esto.")
      setSelectedObject(null);
      setTimeout(() => {
        setMailboxMessage("");
      }, 4000);
    }
  };

  // Función para mirar por la mirilla
  const handlePeepholeClick = () => {
    setHasLookedRoom(true);
    console.log("Mirando por la mirilla...");
    const messageToShow = isGearboxCodeCorrect
      ? "¡La habitación está vacía!Es momento de pasar al despacho!."
      : "El Sr Geeks sigue en el despacho...hay que encontrar la forma de hacerle creer que es la hora de la comida";
    setGameMessage(messageToShow);
    setShowRoomImage(true);
    setTimeout(() => {
      setShowRoomImage(false);
      setGameMessage("");
    }, 5000);
  };

  // Función para el clic en el Cuadro de Luces
  const handleLightsPanelClick = () => {
    console.log("Clic en el cuadro de luces detectado.");
    if (!hasLookedRoom) {
      setGameMessage("Primero, debes mirar por la mirilla para comprobar la situación.");
      setTimeout(() => setGameMessage(""), 4000);

      return;
    }
    handleEnigmaClick(id_gearbox);
    setHasLookedRoom(false);
  }

  // Función para click de la puerta final
  const handleDoorClick = () => {
    let status = "playing";
    console.log("Clic en la puerta detectado.");
    if (isGearboxCodeCorrect && hasLookedRoom) {
      setGameMessage("¡La puerta se abre! Avanzando al siguiente nivel...");
      saveGameProgress((nivelActual + 1), tiempo, status);
      sessionStorage.setItem('level1Timer', tiempo);
      setTimeout(() => {
      }, 5000);
      navigate(`/level-victory`);
    } else {
      setGameMessage("La puerta está cerrada. Debes asegurarte de que la habitación esté vacía.");
      setTimeout(() => setGameMessage(""), 5000);
    }
  };

  //  Función para manejar la resolución de enigmas desde EnigmaModal
  const handleEnigmaSolved = (enigmaId, isCorrect) => {
    setShowEnigma(false);
    setCurrentEnigma(null);
    if (enigmaId === id_gearbox) {
      if (isCorrect) {
        setIsGearboxCodeCorrect(true);
        setGameMessage("¡Conseguiste manipular el reloj! Compreba si el señor Geeks se ha ido a comer.");
        setTimeout(() => setGameMessage(""), 5000);
      }
    }
  }
  // Función para aplicar penalización de tiempo
  const handlePenalty = (seconds) => {
    if (timerRef.current) {
      timerRef.current.addSeconds(seconds);
    }
  };

  return (
    <div className="game-container-bg">
      <img src={Level1BG} className="bg-img" alt="BG Level1" />
      <button id="plant"></button>
      <ButtonWithSFX sfxName='PICK_OBJECT_COMMON' id="door" onClick={handleDoorClick}></ButtonWithSFX>
      <ButtonWithSFX sfxName='PICK_OBJECT_COMMON' id="letterbox" className='object-zone' onClick={handleMailboxClick} ></ButtonWithSFX>
      <ButtonWithSFX sfxName='PICK_OBJECT_COMMON' id="ESC" onClick={() => setMenuOpen(true)}></ButtonWithSFX>
      <ButtonWithSFX sfxName='PICK_OBJECT_COMMON' id="lock" onClick={handlePeepholeClick}></ButtonWithSFX>
      <ButtonWithSFX sfxName='PICK_OBJECT_COMMON' id="gearbox" onClick={handleLightsPanelClick}></ButtonWithSFX>
      {/* <ButtonWithSFX sfxName= 'PICK_OBJECT_COMMON' id="PlayerInfo"></ButtonWithSFX> */}


      <div className="game-message-container justfy-content-center align-items-center w-100 d-flex flex-column">
        {showEnigma && currentEnigmaData && (
          <EnigmaModal show={showEnigma} onHide={() => { setShowEnigma(false) }}
            enigmaId={currentEnigma} onEnigmaSolved={handleEnigmaSolved}
            timerRef={timerRef} />)}
        {(mailboxMessage || gameMessage) && (
          <div className="mailbox-message open-sans mailbox-message background-brown rounded ">
            <p>{mailboxMessage || gameMessage}</p>
          </div>
        )}
        {showRoomImage && (
          <div className="image-room">
            <img
              src={isGearboxCodeCorrect ? despacho_vacio : despacho_lleno}
              alt="Vista a través de la mirilla"
              className="view-image"
            />
          </div>
        )}
      </div>


      <Timer className="timer-display" menuOpen={menuOpen} ref={timerRef} tiempo={tiempo} setTiempo={setTiempo} />
      <div className="menu-toggle">
        <InfoModalUser className="info-modal-user" showEnigma={showEnigma} />

      </div>

      <Pause open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Objects objectsLevel={ObjectsLevel1} onPenalty={handlePenalty} setSelectedObject={setSelectedObject} selectedObject={selectedObject} />
    </div>

  );
}
