import agenda from '../assets/img/Level1_img/Level1-Agenda.png';
import mapa from '../assets/img/Level2_img/Mapa.png';
import calendario from '../assets/img/Level2_img/calendario.png';
import poesia from '../assets/img/Level2_img/poesía.png';
import edificio from '../assets/img/Level2_img/edificios.png';
import caja_fuerte from '../assets/img/Level2_img/Panel.png';
import puzzle_vacio from  '../assets/img/Level1_img/caja_fuerte_vacia.png';
import puzzle_resuelto from '../assets/img/Level1_img/caja_fuerte_resuelta.png'



export const EnigmasData = {
    
    "enigmasNivel1": [
        {
        id: 1,
        title: "Has encontrado el planning diario del señor Geeks...",
        description: "El planning diario del Señor Geeks te dará pistas sobre su rutina y horarios.",
        img: agenda,
        hints: [
      
            "El Señor Geeks es muy estricto con los horarios, y no tolera retrasos. Tampoco le gusta saltarse los descansos. Cada minuto cuenta.",
            "Para encontrar la hora de la comida, primero calcula cuándo termina la Llamada con Proveedores. Recuerda sumar los 30 minutos de descanso antes de esa reunión.",
        ],
           
       
        },
       
        {
        id: 2,
        title: "¡Ya sabes de dónde viene el código!",
        imgBefore: puzzle_vacio,
        imgAfter:puzzle_resuelto,
        solution: "1545",
        description : 'Probemos sabiamente...por cada error tendremos 5 segundos de penalización....',
        hints: [
            "quizás necesites una hora en concreto para resolverlo.",
            "Piensa en cómo se representaría numéricamente en un reloj de 24 horas.",
            
        ],
        
        }
     
     ],
//    falta cambiar esa imagen por el mapa definitivo
     "enigmasNivel2": [ {
        id: 203,
        title: "Documento Clasificado: Ruta Internacional ",
        description: "El señor Geek viaja más que su maleta. Este mapa muestra los trayectos de su última gira internacional de negocios. ",
        img: mapa,
        hints: [
      
            "La línea puede parecer un garabato sin sentido, pero cada cruce de mar cuenta. Un continente no es una parada si no se pisa.",
            "No te dejes engañar por curvas, escalas o zigzags. Cuenta solo los continentes distintos por los que realmente pasa la línea.",
        ],
           
       
        },
        // falta cambiar calendario por el definitivo
    {
        id: 204,
        title: "Un día señalado",
        description:'Entre reuniones, festivos y recordatorios... hay un día que celebra a alguien muy especial.',
        img: calendario,
        hints: [
      
            "Los regalos esperan en silencio, pero la fecha habla por sí sola.",
            "Las velas nunca mienten, aunque no las veas. Un susurro de celebración se esconde en ese día.",
        ],
              
        },
        {
            // queda por fijar la solucion de la caja fuerte y la foto de ella
        id: 205,
        title: "Solo una combinación te separa del contenido de la caja fuerte",
        img: caja_fuerte,
        solution: "1046o22",
        description : 'Observa el sol de la ciudad distante, luego mide el viaje de la tierra, escucha el eco revuelto del verso, recuerda el símbolo que te mira desde el lienzo, y el día que la fortuna celebra.',
        hints: [
            "Cinco caminos, cinco claves. El orden no lo dicta el azar, sino el recorrido que el arte, la tierra, la palabra y la suerte te han marcado. No saltes pasos.",
            "Cada fragmento encierra un número. No mires lo obvio, mira lo que cambia. El código no está oculto… solo está disperso.",
            
        ],
        
        },
        {
            //poner imagen de libro por dentro
        id: 206,
        title: "Pensamientos encriptados de un genio algo raro",
        img: poesia,
        description : 'Parece que el Sr. Geeks ha dejado un mensaje oculto en sus pensamientos más profundos. ¿Podrás descifrarlo?',
        hints: [
           ' El Sr. Geeks no era un hombre directo… sus secretos viajan en las primeras palabras de sus pensamientos.',
          '  Las primeras letras de cada verso forman más que palabras, forman el camino.',
            
        ],
        
        },
         {
            //poner imagen de ciudad, o la imagen que se vaya a usar y adaptar el titulo y las pistas
        id: 207,
        title: "Las que miran",
        img: edificio,
        description :  'No todos los vecinos se atreven a mirar el atardecer.',
        hints: [
          ' Solo las que se atreven a mirar hacia afuera te darán la respuesta',
          ' Solo las persianas completamente subidas revelan el interior... pero no todas se atreven.'
            
        ],
        
        }
          
    ],

    };
   