import React, { useState, useEffect } from "react";
import "../CSS/level2.css"


export const Inventory = ({ pickedUpObjects, allObjects, onPenalty , setSelectedObject, selectedObject }) => {

    const [isOpen, setIsOpen] = useState(false)
    
    const [wrongClicks, setWrongClicks] = useState(0)
    const [message, setMessage] = useState('')
  
    const wrongMessage = [
        "Eso no parece encajar... ¿estás seguro de lo que haces?",
        "Has tocado algo que no deberías. Otra más y habrá consecuencias...",
         "Cada error tiene un precio... y el tuyo son 4 segundos más" 

    ]

    const modalObject = allObjects.filter(obj => pickedUpObjects.includes(obj.id))
    
    const handleSelect = (id) => {
        if (selectedObject === id) {
            setSelectedObject(null)
            setWrongClicks(0)
            setMessage('')
            console.log(`Objeto deseleccionado en inventario: ${id}`)
        }
        else {
            setSelectedObject(id)
            setWrongClicks(0)
            setMessage('')
            console.log(`Objeto seleccionado en inventario: ${id}`)
        }
       
    }
    const handleWrongClick = () => {
        setWrongClicks(prev => {
            const newCount = prev + 1;

            setMessage(wrongMessage[Math.min(newCount - 1, wrongMessage.length - 1)]);

            setTimeout(() => {
                setMessage('');
            }, 3000);

            if (newCount >= 3) {
                console.log("Penalización");
               setTimeout(() => {
                    setSelectedObject(null); 
                    if (typeof onPenalty === "function") {
                        onPenalty(2);
                    }
                }, 0);
                return 0;
            }

            console.log("Se ha ejecutado handleWrongClick")
            return newCount;
        });
    };

    useEffect(() => {
        
        
        if (!selectedObject) return;

        const handleClick = (e) => {
            const isValid = e.target.closest("object-zone");
            console.log("handleClick - isValid:", isValid)

            if (!isValid) {
                handleWrongClick();
            }  
                
            
        };

        const timeoutId = setTimeout(() => {
            document.addEventListener("click", handleClick);
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener("click", handleClick);
        };
    }, [selectedObject,onPenalty])

    return (
        <>
            <div className="inventoryContainer">
                {!isOpen && (
                    <button
                        type="button"
                        className="btn inventory_btn fs-2"
                        onClick={() => setIsOpen(true)}
                    >
                        <i className="fa-solid fa-box-open inventoryIcono"></i>
                    </button>
                )}

                {isOpen && (
                    <div className="inventoryMenuObjects ">
                        {modalObject.length === 0 && (
                            <p className="dropdown-item inventoryName open-sans-lite brown">Ningun objeto en el inventario</p>
                        )}

                        {modalObject.map(obj => (
                            <div
                                key={obj.id}
                                className='inventory-item'
                                onClick={() => handleSelect(obj.id)}
                            >
                                <img
                                    src={obj.img}
                                    className={`inventoryImg ${selectedObject === obj.id ? "selected" : ""}`}
                                    alt={obj.name}
                                />
                               
                            </div>
                        ))}

                        <button
                            type="button"
                            className="ClassicButton SmallButton rounded-pill py-2 px-3"
                            onClick={() => setIsOpen(false)}
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                )}
            </div>
            <div className={`inventoryPenaltyMessage ${message ? 'visible' : 'hidden'}`}>
                {message}
            </div>

        </>

    );
};