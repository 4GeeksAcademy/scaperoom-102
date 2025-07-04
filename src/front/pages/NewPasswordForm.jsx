import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import { ButtonWithSFX } from '../components/SFXButton';
import '../CSS/General-UI.css';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  console.log("TOKEN EN LA URL:", token);
  try {
  console.log("TOKEN DECODED:", decodeURIComponent(token));
  } catch (e) {
  console.error("Error decoding token:", e);
  }
  const decodedToken = decodeURIComponent(token);
  console.log(token)
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + `/api/reset-password/${decodedToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );
      const data = await res.json();
      setMsg(data.msg);
    } catch (err) {
      setMsg("Error al cambiar la contraseña");
    }
  };

  return (
    <div className="text-center mt-5 py-5 container col-9">
            <div className="background-green form-background d-flex flex-column align-items-center w-100">
               <div className="righteous ranking-number header-background d-flex justify-content-between w-100 ps-2">
                         <ButtonWithSFX sfxName="BUTTON_CLICK" onClick={() => navigate("/login")} className= "forward-button d-flex flex-column yellow mt-5 pt-5 ms-5 mb-4" ><h1><i class="fa-solid fa-caret-left media"></i></h1></ButtonWithSFX>
                           <p className="header-title righteous mt-5 yellow mb-5 me-5 pe-5 ps-5 pt-3 d-flex flex-column">CAMBIAR<br/> CONTRASEÑA</p>
                       </div>

                <form className="form-content col-9 row g-3 pt-4 d-flex flex-column align-items-start" onSubmit={handleSubmit}>
                    {/* Campo de nueva contraseña */}
                    <div className="col-12 col-md-10 offset-md-1 px-4">
                        <label htmlFor="passwordInput" className="form-label open-sans orange w-100">Nueva contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            id="passwordInput"
                            placeholder="Introduce tu nueva contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    {/* Botón de envío */}
                    <div className="col-12 text-center mt-4 pb-4">
                        <ButtonWithSFX type="submit" sfxName="BUTTON_CLICK" className="ClassicButton-Variation righteous rounded-pill px-5 py-3">Cambiar</ButtonWithSFX>
                    </div> 

                    {/* Mensaje de confirmación o error */}
                    {msg && <p className="mt-3 open-sans orange">{msg}</p>}
                </form>
            </div>
        </div>
  );
};
