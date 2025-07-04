import llave from "../assets/img/llave.png"
import balleta  from "../assets/img/Level2_img/Mopa.png"
import lupa from "../assets/img/Level2_img/lupa.png"

export const ObjectsLevel1 = [{

    id : 101,
    name : 'llave maestra',
    img : llave,
    className :'objectPosition',
    useIn : 'puerta',
    message : '¡Has conseguido la llave maestra! ¿Qué abrirá en tu aventura?'
}]

export const ObjectsLevel2 = [
 {

    id : 102,
    name : 'gamuza',
    img : balleta,
    className :'balleta',
    useIn : 'telescopio',
    message : 'Búscale una utilidad a la gamuza, ¡quizás te sorprenda!'

},
 {

    id : 103,
    name : 'lupa',
    img : lupa,
    className :'lupa',
    useIn : 'libro',
    message : 'Quizás puedas ver algo mejor con la lupa, ¡inténtalo!'
}, 

]