import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { ButtonWithSFX } from '../components/SFXButton';
import '../CSS/General-UI.css';

export const Login = () => {
    const { login } = useGame();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

       const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Intentando iniciar sesión con:", email, password);
        setError(null);

        try {
            const resp = await login(email, password); 
            console.log("login realizado", resp);
            console.log(resp);
            if (resp) {
                navigate("/dashboard");
            } else {
                console.error("Error en el login.");
                setError("Credenciales inválidas.");
            }

            console.log("Login exitoso, token:", localStorage.getItem("token"));
        } catch (error) {
            console.error("Error de red al iniciar sesión:", error);
            setError("Error de conexión al servidor.");
        }
    };   

    return (
        <div className="text-center mt-5 py-5 container col-9">
            <div className="background-green form-background d-flex flex-column align-items-center w-100">
                <div className="righteous ranking-number header-background d-flex justify-content-between w-100 ps-2">
            <p className="header-title righteous mt-5 yellow mb-5 ms-5 ps-5 pt-3 d-flex flex-column">INICIAR SESIÓN</p>
            <ButtonWithSFX sfxName="BUTTON_CLICK" onClick={() => navigate("/signup")} className= "forward-button d-flex flex-column yellow mt-5 me-5 mb-4" ><h1><i class="fa-solid fa-caret-right"></i></h1></ButtonWithSFX>
                </div>
            <form onSubmit={handleSubmit} className="form-content col-md-6 mx-auto mt-5 mb-3">
                <div className="mb-3 text-start">
                    <label htmlFor="exampleInputEmail1" className="open-sans orange form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3 text-start">
                    <label htmlFor="exampleInputPassword1" className="open-sans orange form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <ButtonWithSFX type="submit" sfxName="BUTTON_CLICK" className="ClassicButton-Variation righteous mb-0 mt-4 rounded-pill px-5 py-3">Entrar</ButtonWithSFX>
            </form>
            <div className="password-button mt-0">
                <ButtonWithSFX sfxName="BUTTON_CLICK"
                    className="btn btn-link open-sans orange"
                    onClick={() => navigate("/forgot-password")}
                >
                    <h5>He olvidado mi contraseña</h5>
                </ButtonWithSFX>
                
            </div>
            </div>
        </div>
    );
};