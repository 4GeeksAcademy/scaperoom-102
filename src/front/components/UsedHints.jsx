
import { useGame } from "../context/GameContext";
import { useState, useEffect } from "react";
import {useHints} from "../context/HintsContext";
import { EnigmasData } from "../data/EnigmasData";
import {ButtonWithSFX} from "./SFXButton";

export default function UsedHints({ enigmaId, isOpen, onClose }) {
  const {  hintsUsed, totalHintsUsed, currentHintMessage, requestHint} = useHints();
  const [localMessage, setLocalMessage] = useState("");

  if (!isOpen) return null;

  // const currentLevelEnigmas = getCurrentEnigmas(); 
  let enigma = EnigmasData.enigmasNivel1.find(e => e.id === enigmaId);
  if (!enigma) {
    
    enigma = EnigmasData.enigmasNivel2.find(e => e.id === enigmaId);
  }
  if (!enigma){
    console.error(`UsedHints: Enigma con ID ${enigmaId} no encontrado en EnigmasData (Nivel 1 ni Nivel 2).`)
   return (
      <div className="mt-3 text-danger">
        <p>Error: No se pudo cargar la información de las pistas.</p>
      </div>
    );
} 
  
  const currentHintsForThisEnigma = hintsUsed[enigmaId] || 0;
  const hints = enigma.hints;
  const canAskForMoreHints = currentHintsForThisEnigma < hints.length && totalHintsUsed < 3;

const handleHint = () => { 
      const hintGiven = requestHint(enigmaId);
      if (!hintGiven) {
          setLocalMessage(currentHintMessage);
      }
  };


  useEffect(() => {
        if (isOpen) {
            setLocalMessage(currentHintMessage);
        } else {
            setLocalMessage(""); 
        }
    }, [isOpen, currentHintMessage]);
    
  return (
    <div>
      <ButtonWithSFX sfxName="USE_HINT" className="ClassicButton rounded-pill px-3 py-2" onClick={handleHint} disabled={!canAskForMoreHints}>
        Pedir pista
      </ButtonWithSFX>
       {currentHintMessage && <p className="mt-2 text-warning">{currentHintMessage}</p>} 
            {!currentHintMessage && localMessage && <p className="mt-2 text-warning">{localMessage}</p>}
            
            {currentHintsForThisEnigma > 0 && (
                <p className="mt-2">{hints[currentHintsForThisEnigma - 1]}</p>
            )}
        </div>
    );
}