// src/data/AvatarConstants.js

import Avatar_01 from '../assets/img/UI/Avatars/Avatar_01.png';
import Avatar_02 from '../assets/img/UI/Avatars/Avatar_02.png';
import Avatar_03 from '../assets/img/UI/Avatars/Avatar_03.png';
import Avatar_04 from '../assets/img/UI/Avatars/Avatar_04.png';
import Avatar_05 from '../assets/img/UI/Avatars/Avatar_05.png';
import Default_Avatar from '../assets/img/UI/Avatars/default_avatar.png';

export const AVATAR_IMAGES = {
    "Avatar_01.png": Avatar_01,
    "Avatar_02.png": Avatar_02,
    "Avatar_03.png": Avatar_03,
    "Avatar_04.png": Avatar_04,
    "Avatar_05.png": Avatar_05,
    "default_avatar.png": Default_Avatar,
};

export const ALLOWED_AVATAR_FILENAMES = [
    "Avatar_01.png",
    "Avatar_02.png",
    "Avatar_03.png",
    "Avatar_04.png",
    "Avatar_05.png",
    "default_avatar.png"
];

export const AVATAR_BASE_URL = "/assets/img/UI/Avatars/"; 

export const getAvatarUrl = (filename) => {
    return AVATAR_IMAGES[filename] || AVATAR_IMAGES["default_avatar.png"];
};