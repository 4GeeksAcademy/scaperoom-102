import { EnigmasData } from "../data/EnigmasData";
import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { SFXManager } from '../components/SFXManager';
import { SFX_CONFIG } from '../data/SFXData';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/api";

export const GameProvider = ({ children, SFXManagerComponent }) => {

  // --- 1. Estado Global del Juego (useState y useRef) ---
  //1.1 constantes de usuario y autenticación
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isUserLoading, setIsUserLoading] = useState(true);

  //1.2 constantes generales de juego
  const [nivelActual, setNivelActual] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const timerRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);

  //1.3 constantes de mecánicas
  const [pickedUpObjects, setPickedUpObjects] = useState([])
  const [isSafeCodeCorrect, setIsSafeCodeCorrect] = useState(false);
  const [isGearboxCodeCorrect, setIsGearboxCodeCorrect] = useState(false);
  const [hasLookedRoom, setHasLookedRoom] = useState(false);

  //1.4 constantes de audio y SFX
  const [audiusAudioUrl, setAudiusAudioUrl] = useState(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioPlayerRef = useRef(null);
  const currentVolume = useRef(0.1);
  const [displayMusicVolume, setDisplayMusicVolume] = useState(currentVolume.current);
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const sfxVolume = useRef(0.5);
  const [displaySfxVolume, setDisplaySfxVolume] = useState(sfxVolume.current);
  const sfxManagerPlayRef = useRef(null);

  // --- 2. Configuraciones y Constantes Externas ---

  // Configuración de Audius (Música Principal)
  const SINGLE_AUDIUS_TRACK_ID = 'zK2Vq';
  const AUDIUS_DISCOVERY_PROVIDERS = [
    "https://discoveryprovider.audius.co",
    "https://discoveryprovider2.audius.co",
    "https://discoveryprovider3.audius.co"
  ];

  // --- 3. Funciones Utilitarias (API y generales) ---

  // 3.1 Función centralizada para realizar solicitudes a la API Backend
  const makeRequest = useCallback(async (url, method = 'GET', body = null, token = '') => {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

    const res = await fetch(fullUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "Error desconocido en la API" }));
      throw new Error(errorData.message || "Error en la API");
    }
    
    if (res.status === 204) {
      return null;
    }

    
    try {
      return await res.json();
    } catch (e) {
     
      console.warn(`makeRequest: Se esperaba una respuesta JSON para ${fullUrl} (status ${res.status}), pero no se pudo parsear.`, e);
      return true;
}
    // return await res.json();
  }, [API_BASE, token]);

  // --- 4. Funciones de Autenticación y Gestión de Usuario (CRUD) ---

  //4.1 logout
  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  //4.2 CRUD
  const signup = async (data) => {
    try {

      await makeRequest("/api/signup", "POST", data);
      alert("¡Registro exitoso! Ya puedes iniciar sesión.");
      return true;
    } catch (error) {
      console.error("Error durante el registro:", error);
      alert( "No se pudo conectar con el servidor. Inténtalo de nuevo más tarde."||error.message );
      return false;
    }
  };

  const login = async (email, password) => {
    try {

      const data = await makeRequest("/api/login", "POST", { email, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (error) {
      alert( "Login fallido"||error.message );
      return false;
    }
  };

  const deleteUser = async () => {
    if (!user || !user.id || !token) {
      throw new Error("No hay usuario autenticado para eliminar.");
    }
    try {

      await makeRequest(`/api/user/profile`, "DELETE", null, token);
      logout();
      return true;
    } catch (error) {
      console.error("Error al eliminar usuario en la API:", error);
      throw new Error(error.message);
    }
  };

  const updateUserProfile = async (newProfile) => {
    if (!user || !user.id || !token) {
      throw new Error("No hay usuario autenticado para modificar.");
    }
    try {

      const responseData = await makeRequest(`/api/user/profile`, "PUT", newProfile, token);
      setUser(responseData.user);

      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
        setToken(responseData.token);
        console.log("Token actualizado después de modificar perfil.");
      }

      alert("Perfil actualizado exitosamente.");
      return true;
    } catch (error) {
      console.error("Error al actualizar usuario en la API:", error);
      throw new Error(error.message);
    }
  };


  // --- 5. Funciones de Lógica de Juego ---

  // 5.1 Obtener el estado de la partida (solo GET)
  const getGameSession = useCallback(async () => {
    if (!user || !user.id || !token) {
      console.error("No hay usuario autenticado.");
      return null;
    }
    try {
      return await makeRequest(`/api/gamesession/user/${user.id}`, "GET", null, token);
    } catch (error) {
      console.error("Error al obtener sesión de juego:", error);
      return null;
    }
  }, [user, token, makeRequest]);

  // 5.2 Guardar progreso (POST o PUT, según si hay sessionId)
  const saveGameProgress = useCallback(async (current_level, accumulated_time, status, sessionId = null) => {
    if (!user || !user.id || !token) {
      console.error("No hay usuario autenticado.");
      return false;
    }
    try {
      let method, endpoint;
      if (sessionId) {
        method = "PUT";
        endpoint = `/api/gamesession/${sessionId}`;
      } else {
        method = "POST";
        endpoint = `/api/gamesession`;
      }
      await makeRequest(endpoint, method, {
        current_level,
        accumulated_time,
        status
      }, token);
      setNivelActual(current_level);
      setTiempo(accumulated_time);
      return true;
    } catch (error) {
      console.error("Error al guardar progreso:", error);
      alert(error.message || "No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.");
      return false;
    }
  }, [user, token, makeRequest, setNivelActual, setTiempo]);

  // 5.3 Obtencion de enigmas  
  const getCurrentEnigmas = () => {

    switch (nivelActual) {
      case 1:
        return EnigmasData.enigmasNivel1;
      case 2:
        return EnigmasData.enigmasNivel2;

      default:
        return [];
    }
  };

  // --- 6. Funciones y Efectos de Audio/SFX ---

  // 6.1 logout audio
  const audioLogout = useCallback(() => {
    setHasUserInteracted(false);
    setIsMusicEnabled(false);
    if (audioPlayerRef.current) {
      if (!audioPlayerRef.current.paused) {
        audioPlayerRef.current.pause();
      }
      audioPlayerRef.current.src = "";
      audioPlayerRef.current.load();
      console.warn("[GameContext] Audio se ha 'deslogueado' (reiniciando interacción de usuario para audio).");
    }
  }, []);

  // 6.2 Volumen musica
  const setMusicVolume = useCallback((newVolume) => {
    const volume = Math.max(0, Math.min(1, newVolume));
    currentVolume.current = volume;
    setDisplayMusicVolume(volume);

    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = volume;
    }
  }, []);

  // 6.3 Volumen SFX
  const setSfxVolume = useCallback((newVolume) => {
    sfxVolume.current = newVolume;
    setDisplaySfxVolume(newVolume);
  }, []);

  // 6.3 Play SFX
  const playSfx = useCallback((sfxName, loop = false, localVolume = 1) => {
    if (sfxManagerPlayRef.current) {
      sfxManagerPlayRef.current(sfxName, loop, localVolume);
    } else {
      console.warn("[GameContext] SFXManager no está listo para reproducir:", sfxName);
    }
  }, [sfxManagerPlayRef]);

  // 6.4 Cargar la URL de la pista de Audius
  useEffect(() => {
    const fetchSingleMusicTrackDirectly = async () => {
      setIsAudioLoading(true);
      setAudiusAudioUrl(null);

      let foundStreamUrl = null;
      for (const providerUrl of AUDIUS_DISCOVERY_PROVIDERS) {
        try {
          console.log(`[GameContext] Intentando cargar la URL de la pista única desde el proveedor: ${providerUrl}`);
          const response = await fetch(`${providerUrl}/v1/tracks/${SINGLE_AUDIUS_TRACK_ID}/stream`);

          if (response.ok && response.url) {
            foundStreamUrl = response.url;
            console.log(`[GameContext] URL de Audius para pista única obtenida de ${providerUrl}: ${foundStreamUrl}`);
            break;
          } else {
            console.warn(`[GameContext] Proveedor ${providerUrl} no pudo obtener la URL de stream o la respuesta no fue OK. Intentando con el siguiente...`);
          }
        } catch (error) {
          console.warn(`[GameContext] Error al conectar con el proveedor ${providerUrl}:`, error);
        }
      }

      setAudiusAudioUrl(foundStreamUrl);
      if (!foundStreamUrl) {
        console.warn("[GameContext] No se pudo obtener la URL de stream de ninguna de los proveedores de la lista.");
      }
      setIsAudioLoading(false);
    };

    if (!audiusAudioUrl && !isAudioLoading) {
      fetchSingleMusicTrackDirectly();
    }
  }, [audiusAudioUrl, isAudioLoading]);

  // 6.5 Play Música
  useEffect(() => {
    const audio = audioPlayerRef.current;
    console.log("------------------------------------------");
    console.log("Estado de audio en useEffect (inicio):", {
      isMusicEnabled,
      audiusAudioUrl,
      hasUserInteracted,
      audioReady: !!audio,
      currentAudioSrc: audio ? audio.src : 'N/A',
      audioPaused: audio ? audio.paused : 'N/A',
      // nivelActual 
    });

    if (audio && audiusAudioUrl) {
      if (isMusicEnabled && hasUserInteracted) {
        if (audio.paused || audio.src !== audiusAudioUrl) {
          if (audio.src !== audiusAudioUrl) {
            audio.src = audiusAudioUrl;
            console.log("[Audio Player] Asignando la única URL de audio y cargando.");
            audio.load();
          }

          console.log(`[Audio Player] ReadyState antes de play: ${audio.readyState}`);
          setTimeout(() => {
            audio.volume = currentVolume.current;
            audio.loop = true;
            audio.muted = false;
            console.log("[Audio Player] Intentando reproducir DESPUÉS del setTimeout...");
            audio.play().then(() => {
              console.log("[Audio Player] REPRODUCCIÓN EXITOSA.");
            }).catch(e => {
              console.warn("[Audio Player] FALLO EN LA REPRODUCCIÓN (con catch):", e.name, e.message, e);
            });
          }, 100);
        }

      } else {

        if (!audio.paused) {
          console.log("[Audio Player] Pausando audio (música deshabilitada, sin interacción, o no es nivel de música).");
          audio.pause();
        }
      }
    } else {
      console.log("[Audio Player] No se puede gestionar audio: elemento de audio o audiusAudioUrl no disponibles.", { audio, audiusAudioUrl });
    }
    console.log("------------------------------------------");
  }, [isMusicEnabled, hasUserInteracted, audiusAudioUrl, audioLogout, currentVolume]); // nivelActual

  // 6.6 Cargar usuario al inicializar la música
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user && !isUserLoading) {
        setIsUserLoading(false);
        return;
      }

      if (!token) {
        setUser(null);
        setIsUserLoading(false);
        return;
      }

      if (!user && token) {
        setIsUserLoading(true);
        try {
          const userData = await makeRequest(`/api/user/profile`, "GET", null, token);
          setUser(userData);
        } catch (error) {
          console.error("Error al cargar el perfil de usuario al iniciar:", error);
          logout();
        } finally {
          setIsUserLoading(false);
        }
      }
    };
    loadUserProfile();
  }, [token, makeRequest, user, setUser, setIsUserLoading, logout]);

  // 7 Cargar ranking de usuario
  const getRanking = useCallback(async () => {
    if (!user || !user.id || !token) {
      console.error("No hay usuario autenticado.");
      return null;
    }
    try {
      return await makeRequest(`/api/ranking/global`, "GET", null, token);
    } catch (error) {
      console.error("Error al obtener ranking:", error);
      return null;
    }
  }, [user, token, makeRequest]);


  return (
    <GameContext.Provider
      value={{
        user,
        setUser,
        isUserLoading,
        setIsUserLoading,
        token,
        login,
        logout,
        nivelActual,
        setNivelActual,
        tiempo,
        setTiempo,
        makeRequest,
        signup,
        getGameSession,
        saveGameProgress,
        deleteUser,
        updateUserProfile,
        menuOpen,
        setMenuOpen,
        timerRef,
        pickedUpObjects,
        setPickedUpObjects,
        hasLookedRoom,
        setHasLookedRoom,
        isGearboxCodeCorrect,
        setIsGearboxCodeCorrect,
        getCurrentEnigmas,
        audiusAudioUrl,
        isAudioLoading,
        audioPlayerRef,
        isMusicEnabled,
        setIsMusicEnabled,
        hasUserInteracted,
        setHasUserInteracted,
        currentVolume,
        setMusicVolume,
        displayMusicVolume,
        sfxVolume: displaySfxVolume,
        setSfxVolume,
        playSfx,
        isSafeCodeCorrect,
        setIsSafeCodeCorrect,
        getRanking
      }}
    >
      {SFXManagerComponent && (
        <SFXManagerComponent
          sfxManagerPlayRef={sfxManagerPlayRef}
          sfxGlobalVolumeRef={sfxVolume}
        />
      )}
      {children}
    </GameContext.Provider>
  );
};