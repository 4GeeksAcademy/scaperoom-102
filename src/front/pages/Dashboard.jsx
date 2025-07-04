import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGame } from '../context/GameContext';
import { ButtonWithSFX } from '../components/SFXButton';
import { UserProfile } from '../components/UserProfile';
import { Ranking } from '../components/Ranking';
import '../CSS/General-UI.css';
import Logo from '../assets/img/UI/General_UI/Logo.png';
import HowToPlay from '../components/HowToPlay';

export function Dashboard() {
  const { setIsMusicEnabled, setNivelActual, nivelActual, setHasUserInteracted, hasUserInteracted, user, isUserLoading, token, getGameSession, setTiempo } = useGame();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/api";
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [gameSession, setGameSession] = useState(null);
  const { logout } = useGame();


  // Al cargar el dashboard, obtener la sesión de juego
  useEffect(() => {
    if (user && token) {
      getGameSession().then(session => setGameSession(session));
    }
  }, [user, token, getGameSession]);

  // Necesario para el perfil del jugador
  useEffect(() => {
    if (!isUserLoading && !user) {
      console.warn("No user found after loading, redirecting to home.");
      navigate('/');
    }
  }, [isUserLoading, user, navigate]);

  if (isUserLoading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-section">
          <h1>Cargando perfil de usuario...</h1>
          <p>Por favor, espera un momento.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // para mostrar si ha jugado o no
  const hasPlayed = gameSession && (gameSession.current_level === 1 || gameSession.current_level === 2);


  // Necesario para la navegación al juego
  const handleStartNewGame = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    setIsMusicEnabled(true);
    setNivelActual(1);
    navigate(`/level-1`);
  };

  const handleContinueGame = async () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    setIsMusicEnabled(true);
    if (gameSession && gameSession.current_level) {
      setNivelActual(gameSession.current_level);
      setTiempo(gameSession.accumulated_time || 0);
      navigate(`/level-${gameSession.current_level}`);
    } else {
      setNivelActual(1);
      setTiempo(0);
      navigate(`/level-1`);
    }
  };

  const handleLogoutClick = () => {
    logout(); 
    navigate('/login'); 
  }; 

  return (
    <div className="dashboard-container container-fluid d-flex justify-content-center align-items-center vh-100 mt-3">
      <div className="row w-100 h-100">
        <div className="dashboard-lateral col-3 d-flex flex-column">
          <UserProfile />
        </div>
        <div className="col-6 game-controls d-flex flex-column">
          <div className="row w-100">
            <div className="logo-container col-12 text-center">
              <img src={Logo} alt="Scaperoom Logo" className="Scaperoom-Logo img-fluid" />
            </div>
            <div className="btn-group-vertical d-flex justify-content-center align-items-center">
              <div className="button-group righteous col-6 mt-5">
                {!hasPlayed ? (
                  <ButtonWithSFX onClick={handleStartNewGame} sfxName="BUTTON_CLICK"
                    className="ClassicButton mb-3 rounded-pill px-4 py-3 w-100">
                    <h2>Nueva Partida</h2>
                  </ButtonWithSFX>
                ) : (
                  <ButtonWithSFX onClick={handleContinueGame} sfxName="BUTTON_CLICK" className="ClassicButton mb-3 rounded-pill px-4 py-3 w-100">
                    <h2>Continuar</h2>
                  </ButtonWithSFX>
                )}
                <ButtonWithSFX onClick={() => setShowHowToPlay(true)} sfxName="BUTTON_CLICK" className="ClassicButton mb-3 rounded-pill px-4 py-3 w-100">
                  <h2>Cómo Jugar</h2>
                </ButtonWithSFX>
                <ButtonWithSFX onClick={handleLogoutClick} sfxName="BUTTON_CLICK" className="ClassicButton mb-3 rounded-pill px-4 py-3 w-100">
                  <h2>Cerrar Sesión</h2>
                </ButtonWithSFX>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-lateral col-3 d-flex flex-column">
          <Ranking />
        </div >
        <HowToPlay open={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
      </div >
    </div >
  );
}