
import { EnigmasData } from "../data/EnigmasData";
import UsedHints from "./UsedHints";
import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import '../CSS/General-UI.css';


// NO CAMBIAR FRASE 'CODIGO INCORRECTO', SI SE CAMBIA CAMBIARLA IGUAL EN LA CONDICION DE ERROR ABAJO

export const EnigmaModal = ({ show, onHide, enigmaId, onEnigmaSolved, timerRef }) => {
  console.log("EnigmaModal: Renderizando con show:", show, "y enigmaId:", enigmaId);

  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [isModalEnigmaSolved, setIsModalEnigmaSolved] = useState(false);
 

  let enigma = EnigmasData.enigmasNivel1.find((e) => e.id === enigmaId);
  if (!enigma) {
    enigma = EnigmasData.enigmasNivel2.find((e) => e.id === enigmaId);
  }

  useEffect(() => {
    if (show) {
      setInputValue('');
      setMessage('');
      setIsModalEnigmaSolved(false);
    }



  }, [show, enigmaId]);

  if (!enigma) {
    console.error("Enigma no encontrado con ID:", enigmaId);
    return null;
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setMessage('');
  };

  const handleSubmit = () => {
    if (enigma.solution && inputValue === enigma.solution) {
      setMessage("¡Código correcto!");
      setIsModalEnigmaSolved(true)
   


      if (enigma.id === 2) {
        setMessage(
          "¡Código correcto! Ya has manipulado el reloj...deberías echar un vistazo por la mirilla para comprobar si el señor Geeks está en su despacho."
        );
       
      } else if (enigma.id === 205) {
        setMessage(
          "¡Código correcto! Has descubierto el código de la caja fuerte del Sr Geeks. ¡Enhorabuena!"
        );
      }
      setTimeout(() => {
        onEnigmaSolved(enigma.id, true);
        onHide();
      }, 4000);
    } else if (enigma.solution) {
      setMessage(
        "Código incorrecto. Este error te trae 5 segundos de penalización..."
      );
      if (timerRef.current && timerRef.current.addSeconds) {
        timerRef.current.addSeconds(5);
        console.log("Penalización de 5 segundos aplicada por respuesta incorrecta.");
      }
    }
    else {
      setTimeout(() => {
        onHide();
      }, 4000);

    }
  };
  const currentEnigmaImage = (enigma.id === 2 && enigma.imgBefore && enigma.imgAfter)
    ? (isModalEnigmaSolved ? enigma.imgAfter : enigma.imgBefore)
    : enigma.img;


  return (
    <Modal className='enigmaGeneral' show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header>
        <Modal.Title className="modal-title h1-righteous w-100 text-center">{enigma.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="image-container">
          {currentEnigmaImage && <img src={currentEnigmaImage} alt="enigma" className="img-fluid" />}
        </div>
        {enigma.description && (
          <h3 className="enigma-description righteous-lite brown">{enigma.description}</h3>
        )}
        {enigma.solution && !isModalEnigmaSolved && (
          <Form.Group className="mb-3">
            <Form.Label>
              {enigma.id === 2
                ? "Introduce el código de la caja de luces:"
                : enigma.id === 205
                  ? "Introduce el código de la caja fuerte:"
                  : enigma.description || "Introduce el código:"
              }
            </Form.Label>
            <Form.Control
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Ej: 1234"
            />
          </Form.Group>
        )}
        {message && (
          <p className={`message-box text-center ${message === "Código incorrecto. Este error te trae 5 segundos de penalización..." ? 'text-danger' : 'text-success'}`}>
            {message}
          </p>
        )}
       
        <UsedHints enigmaId={enigma.id} isOpen={show} onClose={onHide} />
      </Modal.Body>
      <Modal.Footer>
        {enigma.solution &&  !isModalEnigmaSolved &&(
          <Button variant="primary" className='ClassicButton SmallButton rounded-pill px-4 py-3' onClick={handleSubmit}>
            Comprobar Código
          </Button>
        )}
        <Button className='ClassicButton rounded-pill px-3 py-2' variant="secondary" onClick={onHide}>
          <i class="fa-solid fa-xmark"></i>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}