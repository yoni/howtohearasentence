/**
 * Handles loading of the audio player and using the position
 * to queue sentences.
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

// The raw times that the keywords are spoken in the text
var rawQueueTimes = [
'00:13',
'00:52',
'01:03',
'01:10',
'01:37',
'01:56',
'02:07',
'02:20',
'02:40',
'02:47',
'03:13',
'03:46',
'03:55',
'04:24',
'04:35',
'04:40',
'05:36',
'05:47',
'06:47',
'07:00',
'07:11',
'07:16',
'07:56',
'08:09',
'10:35',
'10:47',
'11:20',
'11:32',
'11:50',
'12:07',
'12:40',
'12:46',
'12:56',
'13:17',
'14:12',
'14:38',
'15:05',
'15:14',
'15:39',
'15:46',
'15:53',
'16:27',
'16:35',
'16:52',
'17:03',
'17:17',
'17:40',
'17:51',
'18:10',
'18:30'];

// Contains the position in seconds for queueing the sentences
var queue = [];
for(var i in rawQueueTimes) {
	var rawTime = rawQueueTimes[i];
	var minStr=rawTime.split(":")[0];
	var secStr=rawTime.split(":")[1];
	var minNum = Number(minStr);
	var secNum = Number(secStr);
	var totalSecs = minNum*60 + secNum;
	queue[totalSecs] = true;
}
