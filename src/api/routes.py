"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import secrets
from flask import Flask, request, jsonify, url_for, Blueprint, current_app, send_from_directory 
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from api.models import db, User, GameSession
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import select, func
from datetime import datetime, timedelta, timezone

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# --- RUTAS DE AUTENTICACIÓN (LOGIN/SIGNUP) ---

@api.route('/signup', methods=['POST'])
def signup():
    try:

        email = request.json.get('email', None)
        username = request.json.get('username', None)
        password = request.json.get('password', None)
        avatar_filename = request.json.get('avatar_filename', None)

        if not email or not username or not password or not avatar_filename: 
            return jsonify({'msg': 'Se necesita email, nombre de usuario, avatar y contraseña'}), 400
        
        ALLOWED_AVATARS = ["Avatar_01.png", "Avatar_02.png", "Avatar_03.png","Avatar_04.png", "Avatar_05.png", "default_avatar.png"]
        if avatar_filename not in ALLOWED_AVATARS:
            return jsonify({"msg": "El avatar seleccionado no es válido"}), 400

        user_exists_email = db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()
        if user_exists_email:
            return jsonify({'msg': 'El email ya está registrado'}), 409
        
        hashed_password = generate_password_hash(password)

        new_user = User(
            email=email,
            username=username,
            password_hash=hashed_password,
            avatar_filename=avatar_filename,
            is_active=True
        )

        db.session.add(new_user)
        db.session.commit()
        return jsonify({'msg': 'User created successfully'}), 201

    except Exception as error:
        print(f'Error al registrar el usuario: {error}')
        return jsonify({"error": "Internal server error"}), 500
    
@api.route('/login', methods=['POST'])
def login():
    try:
        email = request.json.get('email', None)
        password = request.json.get('password', None)
        print(f'Login attempt with email: {email} {password}')
        if email is None or password is None:
            return jsonify({'msg': 'email o contraseña incorrectos'}), 401

        stm = select(User).where(User.email == email)
        user = db.session.execute(stm).scalar_one_or_none()

        if user is None:
            return jsonify({'msg': 'Usuario no encontrado en la base de datos'}), 401

        if not check_password_hash(user.password_hash, password):
            return jsonify({'msg': 'Usuario o contraseña incorrecta'}), 400

        access_token = create_access_token(identity=str(user.id))
        return jsonify({"token": access_token, "user": user.serialize()}), 200 

    except Exception as error:
        print(f'Error en el login: {error}')
        return jsonify({"msg": "Error interno del servidor"}), 500
    
# --- RUTAS DE PERFIL DE USUARIO (GET, PUT, DELETE) ---
    
@api.route('/user/profile', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def handle_user_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    if request.method == 'GET':
        # Ruta para obtener el perfil del usuario (ya la tendrías implementada)
        return jsonify(user.serialize()), 200
    
    elif request.method == 'PUT':

        try:
            data = request.get_json()

            new_username = data.get('username', None)
            if new_username is not None:
                user.username = new_username

            new_avatar_filename = data.get('avatar_filename', None)

            if new_avatar_filename is not None:
                ALLOWED_AVATARS = ["Avatar_01.png", "Avatar_02.png", "Avatar_03.png", "Avatar_04.png", "Avatar_05.png", "default_avatar.png"]
                if new_avatar_filename not in ALLOWED_AVATARS:
                    return jsonify({"msg": "Nombre de archivo de avatar no válido."}), 400
                user.avatar_filename = new_avatar_filename

            new_password = data.get('password', None)
            current_password_for_verification = data.get('current_password', None)

            if new_password is not None:
           
                if not current_password_for_verification or not check_password_hash(user.password_hash, current_password_for_verification):
                    return jsonify({"msg": "Contraseña actual incorrecta."}), 401
           
                user.password_hash = generate_password_hash(new_password)

            db.session.commit()

            access_token = create_access_token(identity=str(user.id))
            return jsonify({"msg": "Perfil actualizado con éxito", "user": user.serialize()}), 200

        except Exception as error:
            db.session.rollback()
            print(f"Error al actualizar el perfil del usuario: {error}")
            return jsonify({"msg": "Error interno del servidor"}), 500
    
    elif request.method == 'DELETE':
        try:
            db.session.delete(user)
            db.session.commit()
            return '', 204 
        except Exception as error:
            db.session.rollback()
            print(f"Error al eliminar el usuario: {error}")
            return jsonify({"msg": "Error interno del servidor"}), 500
    
    return jsonify({"msg": "Método no permitido"}), 405 

@api.route('/ranking', methods=['GET'])
def get_ranking():
    try:
        results = (
            db.session.query(
                User.id,
                User.username,
                func.sum(GameSession.accumulated_time).label('total_time')
            )
            .join(GameSession, GameSession.user_id == User.id)
            .filter(GameSession.current_level.in_([1, 2]))
            .group_by(User.id, User.username)
            .order_by(func.sum(GameSession.accumulated_time))
            .all()
        )
        ranking = [
            {
                "user_id": user_id,
                "user_name": user_name,
                "total_time": total_time
            }
            for user_id, user_name, total_time in results
        ]
        return jsonify(ranking), 200
    except Exception as error:
        print(f'Error en el ranking: {error}')
        return jsonify({"msg": "Error interno del servidor"}), 500

# --- FLUJO DE RECUPERACIÓN DE CONTRASEÑA CON TOKEN CORTO EN MEMORIA ---

password_reset_tokens = {}

def generate_short_token(length=12):
    return secrets.token_urlsafe(length)[:length]

def generate_reset_token(email):
    serializer = URLSafeTimedSerializer(os.getenv("FLASK_APP_KEY"))
    return serializer.dumps(email, salt="password-reset-salt")


@api.route('/forgot-password', methods=['POST'])
def forgot_password():
   try:
        email = request.json.get('email')
        if not email:
            return jsonify({"msg": "El email es requerido"}), 400

        user = db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()
        if not user:
            return jsonify({"msg": "Si el email está registrado, recibirás instrucciones"}), 200

        short_token = generate_short_token(12)
        password_reset_tokens[short_token] = {
            "email": email,
            "expires_at": datetime.now(timezone.utc) + timedelta(hours=1)
        }
        reset_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/reset-password/{short_token}"

        msg = Message(
            "Recuperación de contraseña",
            recipients=[email],
            html=f"""<p>Para restablecer tu contraseña, haz clic en el siguiente enlace:<br>
            <a href="{reset_url}">{reset_url}</a>
            <br><br>Este enlace expirará en 1 hora.</p>"""
        )
        mail = current_app.extensions['mail']
        mail.send(msg)

        return jsonify({"msg": "Si el email está registrado, recibirás instrucciones"}), 200
   
   except Exception as error:
        print(f'Error en /forgot-password: {error}')
        return jsonify({"msg": "Error interno del servidor al procesar la solicitud de recuperación de contraseña"}), 500

def verify_reset_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(os.getenv("FLASK_APP_KEY"))
    try:
        email = serializer.loads(token, salt="password-reset-salt", max_age=expiration)
        return email
    except (SignatureExpired, BadSignature):
        return None
    
@api.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    try:
        data = request.get_json()
        new_password = data.get("password")
        if not new_password:
            return jsonify({"msg": "La nueva contraseña es requerida"}), 400

        token_data = password_reset_tokens.get(token)
        if not token_data or token_data["expires_at"] < datetime.now(timezone.utc):
            return jsonify({"msg": "El enlace es inválido o ha expirado"}), 400

        email = token_data["email"]
        user = db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        user.password_hash = generate_password_hash(new_password)
        db.session.commit()

        del password_reset_tokens[token]

        return jsonify({"msg":"Contraseña actualizada correctamente"}), 200
    
    except Exception as error:
        print(f'Error en /reset-password: {error}')
        db.session.rollback()
        return jsonify({"msg": "Error interno del servidor al restablecer la contraseña"}), 500
