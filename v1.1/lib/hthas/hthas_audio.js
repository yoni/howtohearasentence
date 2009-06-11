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
            allowscriptaccess:"always",
			bufferlength:"3100"
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
	console.debug("timeListener called: " + obj.position);
	var playTime = Math.floor(obj.position);
	if(queue[playTime] && queue[playTime].set) {
		queue[playTime].set = false; //make sure it isn't called twice
		console.debug(keyword + " queued st time " + playTime);
		hthas.queueNextSentence();
	}
}
function bufferListener(obj) {
	console.debug("The buffer is full");
	//$("#buffer").html("Thanks for waiting. The buffer is full.");
}

var player = null;
function playerReady(thePlayer) {
	console.debug("Player " + thePlayer + " ready.");
	player = document.getElementById(thePlayer.id);
	player.addModelListener('TIME','timeListener'); 
	player.addModelListener('BUFFER','bufferListener');
}

// The raw times that the keywords are spoken in the text
var rawQueueTimes = [{
keyword:'objects', time:'00:13'
},{
keyword:'contingent', time:'00:52'
},{
keyword:'order', time: '01:03'
},{
keyword:'artificial', time: '01:10'
},{
keyword:'language', time: '01:37'
},{
keyword:'prove', time: '01:56'
},{
keyword:'event', time: '02:07'
},{
keyword:'generated', time: '02:20'
},{
keyword:'talking', time: '02:40'
},{
keyword:'stored', time: '02:47'
},{
keyword:'speak', time: '03:13'
},{
keyword:'speech', time: '03:46'
},{
keyword:'hearing', time: '03:55'
},{
keyword:'mimicry', time: '04:24'
},{
keyword:'everything', time: '04:35'
},{
keyword:'backing', time: '04:40'
},{
keyword:'past', time: '05:36'
},{
keyword:'hypothesis', time: '05:47'
},{
keyword:'suggests', time: '06:47'
},{
keyword:'orientation', time: '07:00'
},{
keyword:'witness', time: '07:11'
},{
keyword:'noise', time: '07:16'
},{
keyword:'means', time: '07:56'
},{
keyword:'situated', time: '08:09'
},{
keyword:'map', time: '10:35'
},{
keyword:'shifts', time: '10:47'
},{
keyword:'purpose', time: '11:20'
},{
keyword:'bridge', time: '11:32'
},{
keyword:'models', time: '11:50'
},{
keyword:'constrained', time: '12:07'
},{
keyword:'holds', time: '12:40'
},{
keyword:'prototype', time: '12:46'
},{
keyword:'formal', time: '12:56'
},{
keyword:'implied', time: '13:17'
},{
keyword:'emphatic', time: '14:12'
},{
keyword:'channels', time: '14:38'
},{
keyword:'embodiment', time: '15:05'
},{
keyword:'distributed', time: '15:14'
},{
keyword:'experiential', time: '15:39'
},{
keyword:'boot', time: '15:46'
},{
keyword:'attention', time: '15:53'
},{
keyword:'child', time: '16:27'
},{
keyword:'intentions', time: '16:35'
},{
keyword:'bears', time: '16:52'
},{
keyword:'act', time: '17:03'
},{
keyword:'differentiation', time: '17:17'
},{
keyword:'possibility', time: '17:40'
},{
keyword:'draw', time: '17:51'
},{
keyword:'acquire', time: '18:10'
},{
keyword:'silence', time: '18:30'
}];

// Contains the position in seconds for queueing the sentences
var queue = [];
for(var i in rawQueueTimes) {
	var rawTime = rawQueueTimes[i].time;
	var rawKeyword = rawQueueTimes[i].keyword;
	
	//calculate in seconds
	var minStr=rawTime.split(":")[0];
	var secStr=rawTime.split(":")[1];
	var minNum = Number(minStr);
	var secNum = Number(secStr);
	var totalSecs = minNum*60 + secNum;
	totalSecs += '';
	
	queue[totalSecs] = {
		keyword:rawKeyword, set: true
	};
}