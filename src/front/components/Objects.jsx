import React, { useState } from "react";
import { ObjectsLevel1 } from "../data/ObjectsArray";
import { Inventory } from "./Inventory";
import { useGame } from "../context/GameContext";
import {ButtonWithSFX} from "./SFXButton";

export const Objects = ({objectsLevel = [], onPenalty,selectedObject, setSelectedObject }) => {

     const {pickedUpObjects, setPickedUpObjects} = useGame()
    const [message, setMessage] = useState(false)


    const handlePickUp = (id) => {

        if (pickedUpObjects.includes(id))
            return
        const pickedObjectMessage = objectsLevel.find(obj => obj.id === id);
        setPickedUpObjects([...pickedUpObjects, id]);
        setMessage(pickedObjectMessage);
        setTimeout(() => {
            setMessage('');
        }, 3000);

        console.log("Objeto recogido:", id);
    }


    return (
        <>
            {objectsLevel.map((object) => (
               <ButtonWithSFX sfxName= 'PICK_OBJECT'
                    key={object.id}
                    className={`${object.className} ${pickedUpObjects.includes(object.id) ? 'objectButtonDisable' : ''}`}
                    onClick={() => handlePickUp(object.id)}
                    disabled={pickedUpObjects.includes(object.id)}
                >
                    <img src={object.img} className= 'objectImg' alt={object.name}/>
                </ButtonWithSFX>
            ))}

            {message && (
                <div className="objectModal">
                    <div className="modal-content">
                        <h2>{message.message}</h2>
                        {/* <button onClick={() => setMessage(false)}>X</button> */}
                    </div>
                </div>
            )}

            <Inventory pickedUpObjects ={pickedUpObjects} allObjects ={objectsLevel} onPenalty={onPenalty} setSelectedObject={setSelectedObject}
                selectedObject={selectedObject}   />
        </>
    );
}