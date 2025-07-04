import { useNavigate } from "react-router-dom";
import '../CSS/General-UI.css';
import Logo from '../assets/img/UI/General_UI/Logo.png';
import { ButtonWithSFX } from '../components/SFXButton';

export function Home() {
	const navigate = useNavigate();
	// const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/api";

	    const handleLogin = () => {
        navigate(`/login`);
     }
	 const handleSignup = () => {
		navigate(`/signup`);
	 }
	 const handleCredits = () => {
		navigate(`/credits`);
	 }

	return (

		<div className="dashboard-container container-fluid d-flex justify-content-center align-items-center vh-100 mt-5">
					<div className="row w-100 h-100">
						<div className="col-lg-3 col-md-4 col-sm-2 col-xs-2 d-flex flex-column mt-5">
						</div>
		
						<div className="col-xs-4 col-sm-4 col-md-4 col-lg-6 game-controls d-flex flex-column">
		
							<div className="row w-100">
		
							<div className="logo-container col-12 text-center mb-auto mt-5 mx-auto px-5">
								<img src={Logo} alt="Scaperoom Logo" className="Scaperoom-Logo img-fluid" />
							</div>
		
							<div className="btn-group-vertical d-flex justify-content-center align-items-center">
								<div className="button-group col-lg-6 col-md-12 col-sm-12 col-xs-12 mt-5">
								<ButtonWithSFX onClick={handleLogin} sfxName="BUTTON_CLICK" 
								className="ClassicButton righteous mb-3 rounded-pill px-4 py-3 w-100">
								  <h2>Iniciar Sesión</h2>
								</ButtonWithSFX>
		
								<ButtonWithSFX onClick={handleSignup} sfxName="BUTTON_CLICK" className="ClassicButton righteous mb-3 rounded-pill px-4 py-3 w-100"> 
									<h2>Registro</h2>
								</ButtonWithSFX>
		
								<ButtonWithSFX onClick={handleCredits} sfxName="BUTTON_CLICK" className="ClassicButton righteous mb-3 rounded-pill px-4 py-3 w-100"> 
									<h2>Créditos</h2>
								</ButtonWithSFX>
								</div>
							</div>
							</div>
						</div>
						<div className="col-lg-3 col-md-4 col-sm-2 col-xs-2 d-flex flex-column mt-5">      
						</div >
					</div >
				</div >
	);
}; 