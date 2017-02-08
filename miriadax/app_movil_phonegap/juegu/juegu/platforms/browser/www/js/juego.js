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

// Multiplicador velocidad
var VELOCITY_MULTIPLIER = 100;

// sonidos
var music;
var okSound;
var failSound;
var winSound;
var looseSound;

var app = {

    init: function(){
        height  = document.documentElement.clientHeight;
        width = document.documentElement.clientWidth;

        app.vigilaSensores();
        app.startGame();
    },

    startGame: function(){
        var game = new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update});

        function preload() {

            game.stage.backgroundColor = '#FFF';

            // cargar sonidos
            app.loadAudios(game);

            // imagenes
            app.loadSprites(game);

            // fuente para la puntuacion
            game.load.bitmapFont('desyrel-pink', 'assets/fonts/desyrel-pink.png', 'assets/fonts/desyrel-pink.xml');
            
            // posiciones del dibujo
            app.loadPuntosCometa();

            // sprites del dibujo
            spritesDibujo = [];

            // inicializar el puntero que indicara el siguiente punto a colisionar
            currentPoint = 0;

            // score inicial
            score = INITIAL_SCORE;
        }

        function create() {

            // fondo degradado
            app.createBackground(game);

            // iniciar sprite jugador
            app.createPlayerSprite(game);

            // preparar los puntos del dibujo
            app.createPointSprites(game);

            // sonidos
            app.createAudios(game);

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
            player.body.velocity.y = (velocidadY * VELOCITY_MULTIPLIER);
            player.body.velocity.x = (velocidadX * (-1 * VELOCITY_MULTIPLIER));
        }
    },    

    loadAudios: function(game){
        game.load.audio('audio', ['assets/audio/background_music.wav']);
        game.load.audio('okSound', ['assets/audio/hit.mp3']);
        game.load.audio('failSound', ['assets/audio/fail.wav']);
        game.load.audio('winSound', ['assets/audio/winning.wav']);
        game.load.audio('looseSound', ['assets/audio/loosing.wav']);
    },

    loadSprites: function(game){
        game.load.image('player', 'assets/sprites/player.png');
        game.load.image('aqua_ball', 'assets/sprites/aqua_ball.png');
        game.load.image('purple_ball', 'assets/sprites/purple_ball.png');
        game.load.image('green_ball', 'assets/sprites/green_ball.png');
    },

    loadPuntosCometa: function(){
        puntosCometa = [
            {'x':240, 'y':380, 'sprite':'purple_ball', 'enable':true, 'toEnable':15},     
            {'x':235, 'y':320, 'sprite':'purple_ball', 'enable':true},  
            {'x':230, 'y':240, 'sprite':'purple_ball', 'enable':true},  
            {'x':225, 'y':180, 'sprite':'purple_ball', 'enable':true},  
            {'x':220, 'y':88, 'sprite':'purple_ball', 'enable':true}, 

            {'x':270, 'y':65, 'sprite':'aqua_ball', 'enable':true},  
            {'x':310, 'y':50, 'sprite':'aqua_ball', 'enable':true},  
            {'x':355, 'y':30, 'sprite':'aqua_ball', 'enable':true}, 
             
            {'x':425, 'y':0, 'sprite':'aqua_ball', 'enable':true}, 
            {'x':440, 'y':45, 'sprite':'aqua_ball', 'enable':true},  
            {'x':460, 'y':105, 'sprite':'aqua_ball', 'enable':true},  
            {'x':485, 'y':180, 'sprite':'aqua_ball', 'enable':true}, 

            {'x':430, 'y':225, 'sprite':'purple_ball', 'enable':true},  
            {'x':380, 'y':265, 'sprite':'purple_ball', 'enable':true},  
            {'x':325, 'y':310, 'sprite':'purple_ball', 'enable':true},  
            {'x':240, 'y':380, 'sprite':'purple_ball', 'enable':false},
             
            {'x':224, 'y':415, 'sprite':'green_ball', 'enable':true},  
            {'x':220, 'y':455, 'sprite':'green_ball', 'enable':true},  
            {'x':225, 'y':500, 'sprite':'green_ball', 'enable':true},  
            {'x':255, 'y':530, 'sprite':'green_ball', 'enable':true},  
            {'x':290, 'y':515, 'sprite':'green_ball', 'enable':true},  
            {'x':315, 'y':490, 'sprite':'green_ball', 'enable':true},  
            {'x':350, 'y':455, 'sprite':'green_ball', 'enable':true},  
            {'x':365, 'y':485, 'sprite':'green_ball', 'enable':true},  
            {'x':365, 'y':510, 'sprite':'green_ball', 'enable':true},  
            {'x':365, 'y':550, 'sprite':'green_ball', 'enable':true},  
            {'x':380, 'y':575, 'sprite':'green_ball', 'enable':true},  
            {'x':425, 'y':565, 'sprite':'green_ball', 'enable':true},  
            {'x':450, 'y':565, 'sprite':'green_ball', 'enable':true},
            {'x':475, 'y':565, 'sprite':'green_ball', 'enable':true}
        ];
    },

    createBackground: function(game){
        var bitMap = game.add.bitmapData(game.width, game.height);
        var grd=bitMap.context.createLinearGradient(0,0,0,500);
        grd.addColorStop(0,"#9F81F7");
        grd.addColorStop(1,"#E3CEF6");
        bitMap.context.fillStyle=grd;
        bitMap.context.fillRect(0,0,game.width, game.height);
        var gradient = game.add.sprite(0,0, bitMap);
        gradient.alpha = 0;
        game.add.tween(gradient).to({ alpha: 1 }, 2000).start();
    },

    createPlayerSprite: function(game){
        player = game.add.sprite(100, 200, 'player');
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        game.physics.enable(player, Phaser.Physics.ARCADE);
    },

    createPointSprites: function(game){        
        dibujo = game.add.physicsGroup();
        var point
        for(point in puntosCometa){
            var sprite = dibujo.create(puntosCometa[point]['x'], puntosCometa[point]['y'], puntosCometa[point]['sprite']);
            game.physics.arcade.enable(sprite);
            sprite.body.enable = puntosCometa[point]['enable'];
            sprite.body.collideWorldBounds = true;
            spritesDibujo[point] = sprite;
        }
    },

    createAudios: function(game){
        music = game.add.audio('audio', 0.1, true);
        music.play();
        okSound = game.add.audio('okSound');
        failSound = game.add.audio('failSound');
        winSound = game.add.audio('winSound');
        looseSound = game.add.audio('looseSound');
    },

    drawLine: function (player, point){

        var correctPoint = false;

        // pintar la linea entre dos puntos, cuando haya colisionado con dos puntos
        if(undefined === firstPoint && puntosCometa[currentPoint]['x'] === point.position.x && puntosCometa[currentPoint]['y'] === point.position.y){
            firstPoint = point.position;

            //activar punto desactivado inicialmente
            spritesDibujo[puntosCometa[currentPoint]['toEnable']].body.enable = true;

            correctPoint = true;
        }else if(undefined != firstPoint){
            correctPoint = app.doDrawLine(point);
        }

        // deshabilitar el punto y sumar puntuacion al usuario
        app.manageScore(point, correctPoint);

        // pintar puntuacion
        app.drawScore();
    },

    doDrawLine: function(point){
        var secondPoint = point.position;
        // si los dos puntos son los correspondientes en la lista de puntos del dibujo, se puede dibujar la linea
        if(spritesDibujo[currentPoint].x === firstPoint.x && spritesDibujo[currentPoint].y === firstPoint.y 
            && spritesDibujo[currentPoint+1].x === secondPoint.x && spritesDibujo[currentPoint+1].y === secondPoint.y){
            graphics.moveTo(firstPoint.x, firstPoint.y);
            graphics.lineTo(secondPoint.x, secondPoint.y);
            console.log("Pintando linea entre (" + firstPoint.x + "," + firstPoint.y + ") y (" + secondPoint.x + "," + secondPoint.y+")");
            firstPoint = secondPoint;
            currentPoint++;
            return true;
        }else{
            return false;
        }
    },

    manageScore: function(point, correctPoint){
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
    },

    drawScore: function(){
        // Pintar puntuacion
        if(score < MIN_SCORE){// si perdio, se notifica y se deshabilitan todos los puntos restantes
            textScore.setText(LOOSE_MESSAGE);
            music.stop();
            looseSound.play();
            for(var i in spritesDibujo){
                spritesDibujo[i].body.enable = false;
            }
        }else if(currentPoint === (puntosCometa.length-1)){//termino el juego
            textScore.setText(WIN_MESSAGE + "\n" + SCORE_LABEL + " " + score);
            music.stop();
            winSound.play();
        }else{
            textScore.setText(SCORE_LABEL + " " + score);
        }
    },

    vigilaSensores: function(){    
        function onError() {
            console.log('onError!');
        }

        function onSuccess(datosAceleracion){
          app.detectaAgitacion(datosAceleracion);
          app.registraDireccion(datosAceleracion);
        }

        navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
    },

    detectaAgitacion: function(datosAceleracion){
        var agitacionX = datosAceleracion.x > 10;
        var agitacionY = datosAceleracion.y > 10;

        if (agitacionX || agitacionY){
          setTimeout(app.recomienza, 1000);
        }
    },

    recomienza: function(){
        document.location.reload(true);
    },

    registraDireccion: function(datosAceleracion){
        velocidadX = datosAceleracion.x;
        velocidadY = datosAceleracion.y ;
    }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.init();
    }, false);
}