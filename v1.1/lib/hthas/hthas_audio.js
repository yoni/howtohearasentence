/**
 * Handles all of the audio manupulation and sentence queueing
 * 
 * @author yoni.ben-meshulam
 */

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
 * 
 * @param {duration:'a number',position:'a number'}
 */
function timeListener(obj) {
	if(obj.position == 15) {
		alert('15!');
	}
}

var player = null;
function playerReady(thePlayer) {
	player = document.getElementById(thePlayer.id);
	player.addModelListener('TIME','timeListener'); 
}
