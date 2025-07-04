from flask import Blueprint, request, jsonify
from api.models import db, User, GameSession # Asegúrate de importar los modelos necesarios
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select, func
from datetime import datetime
from flask_cors import CORS

game_api = Blueprint('game_api', __name__) 
CORS(game_api)

# --- RUTAS DE AUTOGUARDADO / JUEGO ---

@game_api.route('/user/level', methods=['GET'])
@jwt_required() 
def get_user_current_level():
    try:
        current_user_id = get_jwt_identity()

        session = GameSession.query.filter_by(user_id=current_user_id).order_by(GameSession.id.desc()).first()
        if not session:
            return jsonify({"error": "No se encontró sesión de juego para este usuario"}), 404
        
        return jsonify({"current_level": session.current_level})
    except Exception as error:
        print(f'Error al obtener el nivel: {error}')
        return jsonify({"msg": "Error interno del servidor"}), 500

@game_api.route('/user/level', methods=['POST']) 
@jwt_required() 
def update_game_progress():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        new_level = data.get('current_level')
        time_for_this_level = data.get('time_for_this_level', 0.0)

        if new_level is None:
            return jsonify({"error": "Falta el campo current_level"}), 400
        
        session = GameSession.query.filter_by(user_id=current_user_id).order_by(GameSession.id.desc()).first()

        if not session:
            return jsonify({"error": "No se encontró sesión de juego para este usuario"}), 404
        
        session.current_level = new_level
        session.accumulated_time += time_for_this_level


        if new_level == 2:
            session.status = "completed"
            session.total_time = session.accumulated_time

        user = User.query.get(current_user_id)
        if user.best_time is None or session.total_time < user.best_time:
                user.best_time = session.total_time

        db.session.commit()
        return jsonify({"message": "Nivel actualizado", "current_level": session.current_level})
    except Exception as error:
        db.session.rollback()
        print(f'Error al actualizar el nivel: {error}')
        return jsonify({"msg": "Error interno del servidor"}), 500

@game_api.route('/game_session/start', methods=['POST'])
@jwt_required()
def start_new_game_session():
    try:
        current_user_id = get_jwt_identity()

        new_session = GameSession(
            user_id=current_user_id,
            status="playing",
            accumulated_time=0.0,
            total_time=0.0,
            current_level=1
        )

        db.session.add(new_session)
        db.session.commit()
        return jsonify({"msg": "Nueva sesión de juego iniciada", "session_id": new_session.id}), 201

    except Exception as error:
        db.session.rollback()
        print(f'Error al iniciar nueva sesión de juego: {error}')
        return jsonify({"msg": "Error interno del servidor"}), 500
    
@game_api.route('/ranking/global', methods=['GET'])
@jwt_required()
def get_global_ranking():
    try:
        subquery_best_total_time = (
            db.session.query(
                GameSession.user_id,
                func.min(GameSession.accumulated_time).label('best_total_game_time')
            )
            .filter(GameSession.status == "completed")
            .group_by(GameSession.user_id)
            .subquery()
        )

        results = (
            db.session.query(
                User.id,
                User.username, 
                User.avatar_filename,
                subquery_best_total_time.c.best_total_game_time
            )
            .join(subquery_best_total_time, User.id == subquery_best_total_time.c.user_id)
            .order_by(subquery_best_total_time.c.best_total_game_time.asc())
            .all()
        )
        ranking_global = [
            {
                "user_id": user_id,
                "username": username,
                "avatar_filename": avatar_filename,
                "total_time_completed_game": total_game_time
            }
            for user_id, username, avatar_filename, total_game_time in results
        ]
        return jsonify(ranking_global), 200
    except Exception as error:
        print(f'Error en el ranking global: {error}')
        return jsonify({"msg": "Error interno del servidor"}), 500
    
    # --- ENDPOINTS PARA GAMESESSION ---

@game_api.route('/gamesession/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_gamesession_by_user(user_id):
    session = GameSession.query.filter_by(user_id=user_id).order_by(GameSession.id.desc()).first()
    if session:
        return jsonify(session.serialize()), 200
    else:
        return jsonify({"msg": "No hay progreso guardado"}), 404

@game_api.route('/gamesession', methods=['POST'])
@jwt_required()
def create_gamesession():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    user_id = current_user_id
    current_level = data.get('current_level', 1)
    accumulated_time = data.get('accumulated_time', 0.0)
    status = data.get('status', 'playing') 

    if not user_id:
        return jsonify({"msg": "user_id es requerido"}), 400

    new_session = GameSession(
        user_id=user_id,
        current_level=current_level,
        accumulated_time=accumulated_time,
        status=status
    )
    db.session.add(new_session)
    db.session.commit()
    return jsonify(new_session.serialize()), 201

@game_api.route('/gamesession/<int:session_id>', methods=['PUT'])
@jwt_required()
def update_gamesession(session_id):
    session = GameSession.query.get(session_id)
    if not session:
        return jsonify({"msg": "Sesión no encontrada"}), 404

    data = request.get_json()
    session.current_level = data.get('current_level', session.current_level)
    session.accumulated_time = data.get('accumulated_time', session.accumulated_time)
    session.status = data.get('status', session.status)

    db.session.commit()
    return jsonify(session.serialize()), 200