import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { ButtonWithSFX } from '../components/SFXButton';
import { getAvatarUrl } from '../data/AvatarData';
import '../CSS/General-UI.css';

export function Ranking() {
    const { getRanking } = useGame();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const [ranking, setRanking] = useState([]);

    // Cargar ranking al montar
    useEffect(() => {
        getRanking().then(data => {
            if (Array.isArray(data)) setRanking(data);
        });
    }, [getRanking]);

    const totalPages = Math.ceil(ranking.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = ranking.slice(indexOfFirstItem, indexOfLastItem);

    const goToPrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="ranking-card p-3 mt-5 d-flex flex-column align-items-center w-100 justify-content-between">
            <h1 className="righteous ranking-title mb-5 mt-4">RANKING</h1>
            <div className="ranking-results d-flex flex-column align-items-center w-100">
                {currentItems.length > 0 ? (
                    currentItems.map((item, idx) => (
                        <div key={item.user_id} className="ranking-result d-flex flex-column align-items-start w-100">
                            <div className="righteous ranking-number d-flex flex-column align-items-start w-100 ps-2">
                                <p className="m-0">{indexOfFirstItem + idx + 1}#</p>
                            </div>
                            <div className="d-flex justify-content-between w-100">
                                <div className="ranking-avatar me-2 m-2">
                                    <img src={getAvatarUrl(item.avatar_filename)} alt="Avatar de usuario" className="avatar-img" />
                                </div>
                                <div className="d-flex flex-column flex-grow-1 gap-0 mt-2">
                                    <div className="righteous ranking-name">
                                        <p className="mb-0 text-truncate">{item.username}</p>
                                    </div>
                                    <div className="righteous ranking-time">
                                        <p className="m-0 lh-1">
                                            {Math.floor(item.total_time_completed_game / 60)}:{String(item.total_time_completed_game % 60).padStart(2, "0")} min
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">Cargando ranking...</p>
                )}
            </div>
            <div className="pagination d-flex justify-content-end w-100">
                <ButtonWithSFX sfxName="BUTTON_CLICK" onClick={goToPrevPage} className="paginationbutton me-2"><h2><i className="fa-solid fa-caret-left"></i></h2></ButtonWithSFX>
                <ButtonWithSFX sfxName="BUTTON_CLICK" onClick={goToNextPage} className="paginationbutton me-2"><h2><i className="fa-solid fa-caret-right"></i></h2></ButtonWithSFX>
            </div>
        </div>
    );
}

