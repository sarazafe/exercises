// array con las posiciones de los puntos del dibujo
var puntosCometa;

// array con los sprites del dibujo
var spritesDibujo;

// sprite jugador y sprites del dibujo
var player;
var dibujo;

// primer punto para dibujar las lineas entre puntos
var firstPoint; 

// el grafico para pintar la linea entre dos puntos
var graphics;

// variable que indica cual sera, dentro del array de puntos, el siguiente punto valido con el que colisionar
var currentPoint;

// puntuacion
var score;
var textScore;

// puntuacion minima y puntuaciones a sumar o restar en funcion de si el jugador pinta bien o no cada linea
var MIN_SCORE = 0;
var INITIAL_SCORE = 100;
var SCORE_TO_ADD = 100;
var SCORE_TO_DECREMENT = 1;

// texto puntuacion
var SCORE_LABEL = "Puntos: ";
var LOOSE_MESSAGE = "¡¡¡Oh!!! Perdiste :(";
var WIN_MESSAGE = "¡¡Ganaste!! :)";

// sonidos
var music;
var okSound;
var failSound;

var app = {

    init: function(){
        height  = document.documentElement.clientHeight;
        width = document.documentElement.clientWidth;

        app.startGame();
    },

    startGame: function(){
        var game = new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

        function preload() {

            game.stage.backgroundColor = '#FFF';

            // sacados los assets de la web de phraser
            game.load.baseURL = 'http://examples.phaser.io/assets/';
            game.load.crossOrigin = 'anonymous';

            // cargar sonidos
            game.load.audio('audio', ['audio/CatAstroPhi_shmup_normal.wav']);
            game.load.audio('okSound', ['audio/SoundEffects/p-ping.mp3']);
            game.load.audio('failSound', ['audio/SoundEffects/battery.wav']);

            // imagenes
            game.load.image('player', 'sprites/phaser-dude.png');
            game.load.image('aqua_ball', 'sprites/aqua_ball.png');
            game.load.image('purple_ball', 'sprites/purple_ball.png');
            game.load.image('green_ball', 'sprites/green_ball.png');

            // fuente para la puntuacion
            game.load.bitmapFont('desyrel-pink', 'fonts/bitmapFonts/desyrel-pink.png', '/fonts/bitmapFonts/desyrel-pink.xml');
            
            // posiciones del dibujo
            puntosCometa = [
                {'x':240, 'y':380, 'sprite':'purple_ball'},     
                {'x':235, 'y':320, 'sprite':'purple_ball'},  
                {'x':230, 'y':240, 'sprite':'purple_ball'},  
                {'x':225, 'y':180, 'sprite':'purple_ball'},  
                {'x':220, 'y':88, 'sprite':'purple_ball'}, 

                {'x':270, 'y':65, 'sprite':'aqua_ball'},  
                {'x':310, 'y':50, 'sprite':'aqua_ball'},  
                {'x':355, 'y':30, 'sprite':'aqua_ball'}, 
                 
                {'x':425, 'y':0, 'sprite':'aqua_ball'}, 
                {'x':440, 'y':45, 'sprite':'aqua_ball'},  
                {'x':460, 'y':105, 'sprite':'aqua_ball'},  
                {'x':485, 'y':180, 'sprite':'aqua_ball'}, 

                {'x':430, 'y':225, 'sprite':'purple_ball'},  
                {'x':380, 'y':265, 'sprite':'purple_ball'},  
                {'x':325, 'y':310, 'sprite':'purple_ball'},  
                 
                {'x':224, 'y':415, 'sprite':'green_ball'},  
                {'x':220, 'y':455, 'sprite':'green_ball'},  
                {'x':225, 'y':500, 'sprite':'green_ball'},  
                {'x':255, 'y':530, 'sprite':'green_ball'},  
                {'x':290, 'y':515, 'sprite':'green_ball'},  
                {'x':315, 'y':490, 'sprite':'green_ball'},  
                {'x':350, 'y':455, 'sprite':'green_ball'},  
                {'x':365, 'y':485, 'sprite':'green_ball'},  
                {'x':365, 'y':510, 'sprite':'green_ball'},  
                {'x':365, 'y':550, 'sprite':'green_ball'},  
                {'x':380, 'y':575, 'sprite':'green_ball'},  
                {'x':425, 'y':565, 'sprite':'green_ball'},  
                {'x':450, 'y':565, 'sprite':'green_ball'},
                {'x':475, 'y':565, 'sprite':'green_ball'}
            ];

            // sprites del dibujo
            spritesDibujo = [];

            // inicializar el puntero que indicara el siguiente punto a colisionar
            currentPoint = 0;

            // score inicial
            score = INITIAL_SCORE;
        }

        function create() {

            // fondo degradado
            var bitMap = game.add.bitmapData(game.width, game.height);
            var grd=bitMap.context.createLinearGradient(0,0,0,500);
            grd.addColorStop(0,"#9F81F7");
            grd.addColorStop(1,"#E3CEF6");
            bitMap.context.fillStyle=grd;
            bitMap.context.fillRect(0,0,game.width, game.height);
            var gradient = game.add.sprite(0,0, bitMap);
            gradient.alpha = 0;
            game.add.tween(gradient).to({ alpha: 1 }, 2000).start();

            // iniciar sprite jugador
            player = game.add.sprite(100, 200, 'player');
            game.physics.arcade.enable(player);
            player.body.collideWorldBounds = true;
            game.physics.enable(player, Phaser.Physics.ARCADE);

            // preparar los puntos del dibujo
            dibujo = game.add.physicsGroup();
            var point
            for(point in puntosCometa){
                var sprite = dibujo.create(puntosCometa[point]['x'], puntosCometa[point]['y'], puntosCometa[point]['sprite']);
                game.physics.arcade.enable(sprite);
                sprite.body.collideWorldBounds = true;
                spritesDibujo[point] = sprite;
            }

            // sonidos
            music = game.add.audio('audio', 0.1, true);
            music.play();
            okSound = game.add.audio('okSound');
            failSound = game.add.audio('failSound');

            // on collide action
            player.body.onCollide = new Phaser.Signal();
            player.body.onCollide.add(app.drawLine, this);

            dibujo.setAll('body.immovable', true);

            // preparar el grafico para pintar las lineas
            graphics = game.add.graphics(0,0);
            graphics.lineStyle(3, 0x4C0B5F, 1);

            // puntuacion
            textScore = game.add.bitmapText(10, 10, 'desyrel-pink', SCORE_LABEL + " " + score, 30);
        }

        function update () {

           game.physics.arcade.collide(player, dibujo);

            //  mover el jugador con el raton
            game.physics.arcade.moveToPointer(player, 400);
            if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y))
            {
                player.body.velocity.setTo(0, 0);
            }
        }
        function render () {
        }
    },    

    drawLine: function (player, point){

        var correctPoint = false;

        // pintar la linea entre dos puntos, cuando haya colisionado con dos puntos
        if(undefined === firstPoint && puntosCometa[currentPoint]['x'] === point.position.x && puntosCometa[currentPoint]['y'] === point.position.y){
            firstPoint = point.position;
            correctPoint = true;
        }else if(undefined != firstPoint){
            var secondPoint = point.position;

            // si los dos puntos son los correspondientes en la lista de puntos del dibujo, se puede dibujar la linea
            if(puntosCometa[currentPoint]['x'] === firstPoint.x && puntosCometa[currentPoint]['y'] === firstPoint.y 
                && puntosCometa[currentPoint+1]['x'] === secondPoint.x && puntosCometa[currentPoint+1]['y'] === secondPoint.y){
                graphics.moveTo(firstPoint.x, firstPoint.y);
                graphics.lineTo(secondPoint.x, secondPoint.y);
                console.log("Pintando linea entre (" + firstPoint.x + "," + firstPoint.y + ") y (" + secondPoint.x + "," + secondPoint.y+"). CurrentPoint " + currentPoint + " " + puntosCometa.length);

                firstPoint = secondPoint;

                currentPoint++;

                correctPoint = true;
            }
        }

        // deshabilitar el punto y sumar puntuacion al usuario
        if(correctPoint){
            point.body.enable = false;  
            score += SCORE_TO_ADD;  
            // sonar acierto
            okSound.play();  
        }else{
            score -= SCORE_TO_DECREMENT;
            // sonar fallo
            failSound.play();
        }

        // Pintar puntuacion
        if(score < MIN_SCORE){// si perdio, se notifica y se deshabilitan todos los puntos restantes
            textScore.setText(LOOSE_MESSAGE);
            for(var i in spritesDibujo){
                spritesDibujo[i].body.enable = false;
            }
        }else if(currentPoint === (puntosCometa.length-1)){//termino el juego
            textScore.setText(WIN_MESSAGE + "\n" + SCORE_LABEL + " " + score);
            music.stop();
        }else{
            textScore.setText(SCORE_LABEL + " " + score);
        }
    }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.init();
    }, false);
}