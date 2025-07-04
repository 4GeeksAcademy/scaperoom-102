import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { ButtonWithSFX } from '../components/SFXButton';
import '../CSS/General-UI.css';
import Avatar_01 from '../assets/img/UI/Avatars/Avatar_01.png';
import Avatar_02 from '../assets/img/UI/Avatars/Avatar_02.png';
import Avatar_03 from '../assets/img/UI/Avatars/Avatar_03.png';
import Avatar_04 from '../assets/img/UI/Avatars/Avatar_04.png';
import Avatar_05 from '../assets/img/UI/Avatars/Avatar_05.png';
import Default_Avatar from '../assets/img/UI/Avatars/default_avatar.png';

const avatarImageMap = {
  "Avatar_01.png": Avatar_01,
  "Avatar_02.png": Avatar_02,
  "Avatar_03.png": Avatar_03,
  "Avatar_04.png": Avatar_04,
  "Avatar_05.png": Avatar_05,
  "default_avatar.png": Default_Avatar,
};

export const Signup = () => {
  const { signup } = useGame();
  const navigate = useNavigate()
  const [validate, setValidate] = useState(true)
  const [password, setpassword] = useState('')
  const [data, setData] = useState({
    'username': '',
    'email': '',
    'avatar_filename': 'default_avatar.png',
  })
  const handleEvent = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }
  const handlePassword = (e) => {
    const valor = e.target.value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    setpassword(valor);
    setValidate(regex.test(valor));
  }

      const handleAvatar = (e) => {
      setData({
        ...data,
        avatar_filename: e.target.value
      });
    };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data_and_password = {
      ...data,
      password: password
    }
    try {
      const response = await signup(data_and_password)
      console.log('usuario registrado', response)
      navigate('/login')
    } catch (error) {
      console.log('hubo un error a la hora en registrar al usuario', error)
    }
  };
  return (
    <div className="text-center mt-5 py-5 container col-9"  >
      <div className="background-green form-background d-flex flex-column align-items-center w-100" >
        <div className="righteous ranking-number header-background d-flex justify-content-between w-100 ps-2">
          <ButtonWithSFX sfxName="BUTTON_CLICK" onClick={() => navigate("/login")} className= "forward-button d-flex flex-column yellow mt-5 ms-5 mb-4" ><h1><i class="fa-solid fa-caret-left"></i></h1></ButtonWithSFX>
          <p className="header-title righteous mt-5 yellow mb-5 me-5 ps-5 pt-3 d-flex flex-column">REGISTRO</p>
        </div>
        <form className="form-content row g-3 pt-4" onSubmit={handleSubmit}>
          <div className="col-md-6 d-flex flex-column align-items-start px-4"> {/* Columna izquierda para Username, Email, Password */}
                <div className="col-12 ps-4 pe-4"> {/* Ajustar el ancho de los inputs dentro de esta columna */}
                    <label htmlFor="Username" className="form-label open-sans orange">Username</label>
                    <input type="text" className="form-control" id="validationCustom01" name='username' value={data.username} onChange={handleEvent} required />
                </div>
                <div className="col-12 ps-4 pe-4 mt-3"> {/* Añadir margen superior para separar */}
                    <label htmlFor="email" className="form-label open-sans orange">Email</label>
                    <input type="email" className="form-control" id="validationCustom04" name='email' value={data.email} onChange={handleEvent} required />
                </div>
                <div className="col-12 ps-4 pe-4 mt-3"> {/* Añadir margen superior para separar */}
                    <label htmlFor="Password" className="form-label open-sans orange">Password</label>
                    <input type="password" className="form-control mb-3" id="validationCustom05" value={password} onChange={handlePassword} required />
                    <span id="passwordHelpInline" className="form-text open-sans orange small">
                        <h6>La contraseña debe tener al menos 6 digitos y contener: mayuscula, minuscula,caracter especial y número.</h6>
                    </span>
                    {!validate && (
                        <div className="text-danger">La contraseña no cumple los requisitos</div>
                    )}
                </div>
            </div>

            <div className="col-md-6 d-flex flex-column align-items-start px-4"> {/* Columna derecha para Avatar */}
                <div className="col-12 ps-4 pe-4"> {/* Ajustar el ancho del select de avatar */}
                    <label htmlFor="avatarSelect" className="form-label open-sans orange">Avatar</label>
                    <select
                        className="form-select"
                        id="avatarSelect"
                        name="avatar_filename"
                        value={data.avatar_filename}
                        onChange={handleAvatar}
                        required
                    >
                        <option value="Avatar_01.png">Avatar 1</option>
                        <option value="Avatar_02.png">Avatar 2</option>
                        <option value="Avatar_03.png">Avatar 3</option>
                        <option value="Avatar_04.png">Avatar 4</option>
                        <option value="Avatar_05.png">Avatar 5</option>
                        <option value="default_avatar.png">Vacío</option>
                    </select>
                    {data.avatar_filename && (
                        <img
                            src={avatarImageMap[data.avatar_filename]}
                            alt="Avatar seleccionado"
                            className="img-thumbnail mt-2 avatar-preview"
                        />
                    )}
                </div>
                <div className="col-12 text-end pe-5">
            <ButtonWithSFX type="submit" sfxName="BUTTON_CLICK" className="ClassicButton-Variation righteous mb-0 mt-4 rounded-pill px-5 py-3" disabled={!validate} >Submit form</ButtonWithSFX>
        </div>
            </div>
        
        </form>
      </div>
    </div>
  )
}