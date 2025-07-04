// src/components/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { ALLOWED_AVATAR_FILENAMES, getAvatarUrl } from '../data/AvatarData'; 
import { ButtonWithSFX } from '../components/SFXButton';
import '../CSS/General-UI.css'; 

export function UserProfile() {
    const { user, updateUserProfile, deleteUser, logout, isUserLoading } = useGame();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '', 
        avatar_filename: '',
        current_password: '',
        new_password: '',
        confirm_new_password: ''
    });
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState(''); 

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                avatar_filename: user.avatar_filename || 'default_avatar.png',
                current_password: '',
                new_password: '',
                confirm_new_password: ''
            });
        }
    }, [user]);

    if (isUserLoading) {
        return (
            <div className="user-profile-card">
                <p>Cargando perfil...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="user-profile-card">
                <p>No se ha podido cargar la información del usuario.</p>
                <button onClick={() => navigate('/')}>Volver al inicio</button>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setFeedbackMessage('');
        setFeedbackType('');

        if (formData.new_password && formData.new_password !== formData.confirm_new_password) {
            setFeedbackMessage('Las nuevas contraseñas no coinciden.');
            setFeedbackType('error');
            return;
        }
        if (formData.new_password && !formData.current_password) {
            setFeedbackMessage('Debes introducir tu contraseña actual para cambiarla.');
            setFeedbackType('error');
            return;
        }

        const payload = { username: formData.username, avatar_filename: formData.avatar_filename };
        if (formData.new_password) {
            payload.password = formData.new_password;
            payload.current_password = formData.current_password; 
        }

        console.log("Payload enviado a updateUserProfile:", payload);
    console.log("Valor de avatar_filename en frontend (formData.avatar_filename):", formData.avatar_filename);
    
        try {
            await updateUserProfile(payload);
            setFeedbackType('success');
            setIsEditing(false); 
            setFormData(prev => ({
                ...prev,
                current_password: '',
                new_password: '',
                confirm_new_password: ''
            }));
        } catch (error) {
            setFeedbackMessage(error.message || 'Error al actualizar el perfil.');
            setFeedbackType('error');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.')) {
            setFeedbackMessage('');
            setFeedbackType('');
            try {
                await deleteUser();
                setFeedbackMessage('Cuenta eliminada exitosamente. Redirigiendo...');
                setFeedbackType('success');
                setTimeout(() => navigate('/'), 2000); // Redirigir a Home después de un breve delay
            } catch (error) {
                setFeedbackMessage(error.message || 'Error al eliminar la cuenta.');
                setFeedbackType('error');
            }
        }
    };

    return (
        <div className="user-profile-card p-3 mt-5 d-flex flex-column align-items-center w-100">

            {feedbackMessage && (
                <div className={`feedback-message ${feedbackType === 'success' ? 'success' : 'error'}`}>
                    {feedbackMessage}
                </div>
            )}

            {!isEditing ? (
                <div className="profile-display-mode ">
                    <div className="avatar-container d-flex flex-column align-items-center w-100">
                        <img src={getAvatarUrl(user.avatar_filename)} alt="Avatar de usuario" className="avatar-img" />
                    </div>
                    <h1 className="righteous player-name ms-3 mb-0 mt-3">{user.username}</h1>
                    <p className="open-sans player-email-display ms-3 mt-0">{user.email}</p>

                    
                    <div className=" buttons-edit d-flex justify-content-center gap-3 mt-5">
                    <ButtonWithSFX sfxName="BUTTON_CLICK" onClick={() => setIsEditing(true)} className="ClassicButton righteous editbutton mb-3 rounded-pill px-5 py-3"><i class="fa-solid fa-pen"></i></ButtonWithSFX>
                    <ButtonWithSFX sfxName="BUTTON_CLICK" onClick={handleDeleteAccount} className="righteous deletebutton mb-3 rounded-pill px-5 py-3"><i class="fa-solid fa-xmark"></i></ButtonWithSFX>
                    </div>
                </div>
            ) : (
                <form className="profile-edit-mode d-flex flex-column align-items-center" onSubmit={handleSave}>
                    <div className="avatar-container-edit open-sans-lite d-flex flex-column align-items-center">
                        <img src={getAvatarUrl(formData.avatar_filename)} alt="Avatar actual" className="avatar-img-edit" />
                        <label htmlFor="avatarSelect"></label>
                        <select
                            id="avatarSelect"
                            name="avatar_filename"
                            className="edit-input mt-3 text-center"
                            value={formData.avatar_filename}
                            onChange={handleChange}
                        >
                            {ALLOWED_AVATAR_FILENAMES.map(filename => (
                                <option key={filename} value={filename}>
                                    {filename.replace('.png', '').replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                <div className="d-flex flex-column align-items-center w-100">
                    <label className="text-center mt-2 open-sans-lite">
                        Nombre de Usuario:
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="edit-input text-center open-sans-lite"
                            required
                        />
                    </label>
                    <label className="text-center open-sans-lite">
                        Email (No editable):
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            className="edit-input text-center open-sans-lite"
                            disabled
                        />
                    </label >

                    <h6 className="text-center mt-4 righteous-lite brown">Cambiar Contraseña</h6>
                    <label className="text-center open-sans-lite">
                        Contraseña Actual:
                        <input
                            type="password"
                            name="current_password"
                            value={formData.current_password}
                            onChange={handleChange}
                            className="edit-input"
                            autoComplete="current-password text-center open-sans-lite"
                        />
                    </label>
                    <label className="text-center open-sans-lite">
                        Nueva Contraseña:
                        <input
                            type="password"
                            name="new_password"
                            value={formData.new_password}
                            onChange={handleChange}
                            className="edit-input"
                            autoComplete="new-password text-center open-sans-lite"
                        />
                    </label>
                    <label className="text-center mt-2 open-sans-lite">
                        Confirmar Nueva Contraseña:
                        <input
                            type="password"
                            name="confirm_new_password"
                            value={formData.confirm_new_password}
                            onChange={handleChange}
                            className="edit-input"
                            autoComplete="new-password text-center open-sans-lite"
                        />
                    </label>

                    </div>

                    <div className=" buttons-edit d-flex justify-content-center gap-3 mt-4">
                        <ButtonWithSFX sfxName="BUTTON_CLICK" type="submit"  className="ClassicButton righteous editbutton mb-3 rounded-pill px-5 py-3"><i class="fa-solid fa-floppy-disk"></i></ButtonWithSFX>
                        <ButtonWithSFX sfxName="BUTTON_CLICK" onClick={() => setIsEditing(false)} className="righteous deletebutton mb-3 rounded-pill px-5 py-3"><i class="fa-solid fa-xmark"></i></ButtonWithSFX>
                    </div>
                </form>
            )}
        </div>
    );
}