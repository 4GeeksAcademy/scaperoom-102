import { useNavigate } from "react-router-dom";
import '../CSS/General-UI.css';
import {ButtonWithSFX} from "../components/SFXButton";
import Avatar_01 from '../assets/img/UI/Avatars/Avatar_01.png';
import Avatar_02 from '../assets/img/UI/Avatars/Avatar_02.png';
import Avatar_03 from '../assets/img/UI/Avatars/Avatar_03.png';


 export function Credits() {
    const navigate = useNavigate();

    return (
        <div>
                   <div className="text-center mt-0 py-3 container col-9">
                       <div className="background-green credits-top d-flex flex-column align-items-center w-100">
                           <div className="righteous ranking-number header-background d-flex justify-content-between w-100 ps-2">
                               <p className="header-title righteous mt-2 yellow mb-3 ms-5 ps-5 pt-3 d-flex flex-column">CRÉDITOS</p>
                           </div>
                           <div className="menu-content-victory mt-4">
                               <div className="d-flex flex-column align-items-center">
                                <div className="credit-item carol d-flex align-items-center justify-content-start w-100 my-0 ms-5">
                                <img src={Avatar_01} alt="Avatar de Carol" className="credit-avatar me-3" />
                                <div className="d-flex flex-column align-items-start">
                                <p className="righteous orange credit-text mb-0">CAROL</p>
                                <p className="open-sans-lite brown credit-text text-start mb-0 me-5 pe-5">Iniciando mi camino como Full Stack Developer con gran entusiasmo por la tecnología y el desarrollo web. Lista para seguir creciendo y creando proyectos.</p>
                                <a href="https://github.com/CarolCastilloDev" target="_blank" rel="noopener noreferrer" className="credit-link"><strong>Puedes ver mi trabajo aquí</strong></a> 
                                </div>
                            </div>

                            {/* Naiomi - Avatar Derecha */}
                            <div className="credit-item naiomi d-flex align-items-center justify-content-end w-100 my-0 me-5">
                                <div className="d-flex flex-column align-items-end me-3">
                                <p className="righteous orange credit-text mb-0">NAIOMI</p>
                                <p className="open-sans-lite brown credit-text text-start mb-0 ms-5 ms-4 ps-5">Después de hacer un checkout a una nueva rama profesional, éste ha sido mi primer proyecto en equipo y el deploy oficial de mi nueva carrera como desarrolladora. Recién graduada y con el entusiasmo, sigo sumando líneas de código.</p>
                                <a href="https://github.com/naiomi25" target="_blank" rel="noopener noreferrer" className="credit-link"><strong>Puedes ver mi trabajo aquí</strong></a> 
                                </div>
                                <img src={Avatar_02} alt="Avatar de Naiomi" className="credit-avatar" />
                            </div>

                            {/* Sandra - Avatar Izquierda */}
                            <div className="credit-item sandra d-flex align-items-center justify-content-start w-100 ms-5">
                            <img src={Avatar_03} alt="Avatar de Sandra" className="credit-avatar me-3" />
                            {/* ESTA ES LA CLAVE PARA SANDRA: LA MISMA ESTRUCTURA DE TEXTO QUE LAS OTRAS */}
                            <div className="d-flex flex-column align-items-start">
                                <p className="righteous orange credit-text mb-0">SANDRA</p>
                                <p className="open-sans-lite brown credit-text text-start mb-0 me-5 pe-5">Tech Visual Artist creando imágenes y experiencias para juegos y UI/UX. Recién graduada en Full Stack, lista para lanzar mis propios proyectos desde cero. </p>
                                <a href="https://linktr.ee/comic.sanx" target="_blank" rel="noopener noreferrer" className="credit-link"><strong>Puedes ver mi trabajo aquí</strong></a> {/* Añadido un párrafo para el link */}
                            </div>
                        </div>
                               </div>
                               <ButtonWithSFX sfxName="BUTTON_CLICK" className="ClassicButton-Variation righteous rounded-pill px-4 py-3" onClick={() => navigate(`/`)}><h3>Volver al inicio</h3></ButtonWithSFX>
                           </div>
                       </div>
                   </div>
               </div>
    );
}