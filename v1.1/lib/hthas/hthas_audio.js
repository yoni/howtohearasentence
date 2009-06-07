/**
 * Handles loading of the audio player and using the position
 * to queue sentences.
 * 
 * @author yoni.ben-meshulam
 */
// the positions in the audio file that have keywords
var queuePositions;
// the positions in the audio file that have keywords
var queuePositions = [15,20,25,30,35,40,45,50,55,60];
var queue = [];
for(var i in queuePositions) {
	queue[queuePositions[i]] = true;
}
function createPlayer() {
    var flashvars = {
            file:"http://omnib.in/hthas/v1.1/audio/we_record_on_monday4.mp3", 
            autostart:"false"
    }
    var params = {
            allowfullscreen:"true", 
            allowscriptaccess:"always"
    }
    var attributes = {
            id:"player1",  
            name:"player1"
    }
    swfobject.embedSWF("lib/mediaplayer/player.swf", "placeholder1", "320", "196", "9.0.115", false, flashvars, params, attributes);
}

/**
 * We attached this listener to the player. It receives the time info every 1/10 of a second.
 * @param {duration:'a number',position:'a number'}
 */
function timeListener(obj) {
	if(queue[obj.position]) {
		hthas.queueNextSentence();
	}
}

var player = null;
function playerReady(thePlayer) {
	player = document.getElementById(thePlayer.id);
	player.addModelListener('TIME','timeListener'); 
}
