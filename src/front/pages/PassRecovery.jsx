import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonWithSFX } from '../components/SFXButton';
import '../CSS/General-UI.css';

export const PassRecovery = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMsg(data.msg);
    } catch (err) {
      setMsg(err.message || "Error al enviar la solicitud");
    }
  };

  return (
   <div className="text-center mt-5 py-5 container col-9">
    <div className="background-green form-background d-flex flex-column align-items-center w-100">
        <div className="righteous ranking-number header-background d-flex justify-content-between w-100 ps-2">
          <ButtonWithSFX sfxName="BUTTON_CLICK" onClick={() => navigate("/login")} className= "forward-button d-flex flex-column yellow mt-5 pt-5 ms-5 mb-4" ><h1><i class="fa-solid fa-caret-left media"></i></h1></ButtonWithSFX>
            <p className="header-title righteous mt-5 yellow mb-5 me-5 pe-5 ps-5 pt-3 d-flex flex-column">RECUPERAR<br/> CONTRASEÑA</p>
        </div>

        <form className="form-content col-9 row g-3 mt-4 d-flex flex-column align-items-center justify-content-center" onSubmit={handleSubmit}>
            <div className="col-12 col-md-8 px-4"> 
                <label htmlFor="emailInput" className="form-label open-sans orange text-start w-100">Tu email</label>
                <input
                    type="email"
                    className="form-control"
                    id="emailInput"
                    placeholder="ejemplo@dominio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="col-12 text-center mt-4 pb-4">
                <ButtonWithSFX type="submit" sfxName="BUTTON_CLICK" className="ClassicButton-Variation righteous rounded-pill px-5 py-3" >Enviar</ButtonWithSFX>
            </div>

            {/* Mensaje de confirmación o error */}
            {msg && <p className="mt-3 open-sans orange">{msg}</p>}
        </form>
    </div>
</div>
  );
};