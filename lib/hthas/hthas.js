/**
 * <h2>How To Hear A Sentence</h2>
 * Version 1.1
 * <br><br>
 * <p>Each author identified 25 key words in their article and
 * sent them to the other to interpret and infer a sentence. Hemce, there are 25 sentences written 
 * in response to each article, for a total of 50 inferred sentences.</p>
 * 
 * <p>The performance involves either physical reading or electronic playback of the text, with each reader 
 * reading a passage from their article in turn. As article keywords are uttered, the corresponding 
 * sentence is queued according to their queue time.</p>
 * 
 * <p>The initial position of Sentences are random (rather pseudo-random), but they always animate directly to 
 * the black box centered on the page. When a Sentence enters the black box, the keywords from that sentence
 * are rendered into the box, using a color randomly assigned to that keyword.</p>
 * 
 * <p>When two or more Sentences that were found to be related based on the keywords both make it into the black box, 
 * the corresponding Inference is ejected out of the box and into the poem area at the top of the page. The keyword
 * in the inference is colored with the same color, and the box momentarily flashes that color.</p>
 * 
 * @author yoni.ben-meshulam
 */
var hthas = {
	/**
	 * Dynamic CSS used throughout.
	 */
	sWidth:screen.width/4,
	/**
	 * This array will hold our Sentence objects, arranged in order
	 */
	Sentences:[],
	/**
	 * This array will hold our Inference objects, arranged in order
	 */
	Inferences:[],
	/**
	 * A map between Inferences and inferenceIds. Technically not needed, since we have the array.
	 * Still need to refacto this into a map of inferences from which an array can be retrieved.
	 */
	InferenceMap:{},
	/**
	 * The index of the next sentence to animate in
	 */	
	sentenceQueue:0,
	/**
	 * Sentence ids for those sentences that made it to the black box
	 */
	bBoxSentences:{},
	/**
	 * Called when the 'e' key is pressed. Causes all of the Sentences to be ejected from the box
	 * and fly around the bottom half of the screen. Keywords change font size in random order.
	 * This process continues until the 'return/enter' key is pressed.
	 */
	endPresentation:function() {
		// animate sentences
		$('.sentence').each(function(){
			var rTop = Math.random()*screen.height/2 + screen.height/2;
			var rLeft = Math.random()*screen.width;
			$(this).show().animate({top:rTop+'px', left:rLeft+'px', fontSize:12}, 1000);
		});
		
		// animate keyword font sizes
		$('.keyword').each(
			function(){
				var randFontSize = Math.random()*40;
				$(this).animate({fontSize:randFontSize}, 1000);
			});
		
		// call self if 'enter/return' key hasn't been pressed
		if (!hthas.stop) {
			setTimeout("hthas.endPresentation();", 1000);
		}
		
	},
	/**
	 * Loads next sentence into the page from a random spot on 
	 * either the right or the left, depending on who the 
	 * speaker is. Sentences immediately begin moving toward 
	 * the black box.
	 */
	queueNextSentence:function() {
		if (hthas.sentenceQueue <= hthas.Sentences.length) {
		
			var bbPosition = $('.blackBox').position();
			var sentenceId = hthas.Sentences[hthas.sentenceQueue].element.id;
			$('#' + sentenceId).animate({
				left: bbPosition.left + 'px',
				top: bbPosition.top + 'px'
			}, 25000, 'linear', function(){
				hthas.handleSentenceAnimationEnd(sentenceId);
			});
			hthas.sentenceQueue++;
		}
	},
	/**
	 * Called when the sentence animation ends, and the sentence is in the box.
	 * @param sentenceId the element id of the sentence that made it to the box
	 */
	handleSentenceAnimationEnd:function(sentenceId) {
		$('#'+ sentenceId).hide();

		// for each keyword in the sentence we add it to the box and 
		$('#'+ sentenceId +' .keyword').each(
			function() {
				var keyword = hthas.cleanKeyword(this.innerHTML);
				//place keyword in the box				
				var kColor = hthas.keywordMap[keyword].color;
				var kElement = document.createElement('span');
				var word = this.innerHTML.toLowerCase() + ' ';     

				$(kElement).html(word).css({
						'color':kColor,'font-size': '21px',
					});

				//put sentence in the box
				var bounceOptions = {};
				$('.blackBox')
					.append(kElement);
				
				//set this sentence as having arrived at the box
				hthas.bBoxSentences[sentenceId] = true;

				//check if all sentences realated to the keyword have made it to the box
				if(hthas.areAllSentencesInBox(keyword)) {
					hthas.queueKeywordInference(keyword);
				}
			});
	},
	/**
	 * Called when all sentences for a given keyword made it into the box.
	 * @param {Object} keyword
	 */
	queueKeywordInference:function(keyword) {
		var sentenceIds = hthas.keywordMap[keyword].sentences.split(',');
		var inferenceId = hthas.keywordMap[keyword].inference;
		var kColor = hthas.keywordMap[keyword].color;
		if(inferenceId) { //not all keywords have an inference
			var bbPosition = $('.blackBox').position();
			
			var iPos = hthas.InferenceMap[inferenceId].position;
			// animate inference
			$('#' + inferenceId)
				.css({width:'10px'})
				.show()
				.animate({top:iPos.top, left:iPos.left, width:screen.width*3/4+'px'}, 2000);
			
			//animate box color to the keyword color and back again
			$('.blackBox')
				.animate({'backgroundColor': kColor,'z-index': '2'}, 
					1000,'linear', 
					function(){
						$(this).animate({'backgroundColor':'black','z-index':'0'}, 500);
					});
		}
	},
	/**
	 * Checks if all sentences related to the keyword made it into the box
	 * @param {Object} keyword
	 */
	areAllSentencesInBox:function(keyword) {
		var sentenceIds = hthas.keywordMap[keyword].sentences.split(',');
		var allInBox = true;
		for(var i = 0; i < sentenceIds.length; i++) {
			var sentenceId = sentenceIds[i];
			if(!hthas.bBoxSentences[sentenceId]) {
				allInBox = false;
			}
		}
		return allInBox;
	},
	/**
	 * Sets the word to lower case and removes trailing 's'
	 * @param keyword, a String
	 * @return the String set to lower case and with no trailing 's'
	 */
	cleanKeyword:function(keyword) {
		keyword = keyword.toUpperCase();
		keyword = keyword.replace(/S$/,''); //remove trailing s
		keyword = keyword.replace(/ION$/,''); //remove trailing 'ion' (for 'suggestion')
		return keyword;
	},
	/**
	 * Map a given keyword to all of the Sentences and Inferences that have that keyword.
	 * Also associate each keyword with a color.
	 */
	mapKeywords:function() {
		//set up a map to hold all of the keywords and assign them some useful values:
		// a color
		// an array of sentence ids which contain that keyword
		hthas.keywordMap = {};
		$('.sentence').each(function(){
			var sentence = this;
			$('#'+sentence.id + ' .keyword').each(function(){
				var keyword = this.innerHTML;
				keyword = hthas.cleanKeyword(keyword);
				if (!hthas.keywordMap[keyword]) {
					hthas.keywordMap[keyword] = {sentences:'', color:hthas.getKeywordColor()};
					hthas.keywordMap[keyword].sentences += sentence.id;
				}
				else {
					hthas.keywordMap[keyword].sentences += ',' + sentence.id;
				}
			});
		});
		// associate this inference with its keyword		
		$('.inference').each(function(){
			var inference = this;
			$('#'+ inference.id + ' .keyword').each(function(){
				var keyword = this.innerHTML;
				keyword = hthas.cleanKeyword(keyword);
				hthas.keywordMap[keyword].inference = inference.id;
				//assign the color
				$(this).css({color:hthas.keywordMap[keyword].color});
			});
		});
		
	},
	/**
	 * Returns the next available color from the array of possible keyword colors
	 */
	getKeywordColor:function(){
		//for now, just getting a random color. need to change this.
		var rand = Math.random()*KEYWORD_COLORS.length;
		rand = Math.floor(rand);
		return KEYWORD_COLORS[rand];;
	},
	/**
	 * Initializes sentence objects for later manipulation.
	 * TODO:Consider doing this on the fly, so as to support new
	 * sentences coming in live.
	 */
	initializeSentences:function() {
		for(var i = 0; i < SENTENCES.length; i++) {
			var args = {};
			args.text = SENTENCES[i];
			var randomHeight = document.height * Math.random();
			args.position = {x:'-'+ hthas.sWidth + 'px', y:randomHeight+'px'};
			if(i%2) { 
				args.type = 'right';
			} else {
				args.type = 'left';
			}
			args.id = 'sentence'+i;
			hthas.Sentences.push(new Sentence(args));
		}
	},
	/**
	 * Initializes sentence objects for later manipulation.
	 * TODO:Consider doing this on the fly, so as to support new
	 * sentences coming in live.
	 */
	initializeInferences:function() {
		// styles
		$('.inference').css('width', screen.width/2);
		// create the Inference objects and position them
		var nextInfY = 30;
		var margin = 25;
		for(var i = 0; i < INFERENCES.length; i++) {
			var text = INFERENCES[i];
			var numLines = 1;
			if(text.length > 100) numLines += 1;
			
			var args = {};
			args.text = text;
			args.position = {left:screen.width/8 + 'px', top: nextInfY + margin + 'px'};
			args.id = 'inference'+i;
			var inf = new Inference(args);
			$(inf.element).css({width:screen.width*3/4+'px'});
			nextInfY += $(inf.element).outerHeight();
			
			hthas.InferenceMap[args.id] = inf;
			hthas.Inferences.push(inf);
		}
	},
	/**
	 * Set up styles for the sentences, inferences and the black box.
	 */
	initializeStyles:function() {
		var bbLeft = screen.width/2 - screen.width/8;
		var bbTop = screen.height/2.3;
		// set up size of black box
		$('.blackBox').css('height',screen.height/2.5 + 'px');
		$('.blackBox').css('width',hthas.sWidth + 'px');
		
		//set up position of black box
		$('.blackBox').css('left',bbLeft + 'px');
		$('.blackBox').css('top',bbTop + 'px');
		
		$('.sentence').css('width',	hthas.sWidth);
		
		//inferences start from the box and animate up
		$('.inference').css({top:bbTop+'px',left:bbLeft + 'px'});
	},
	/**
	 * Uses the screen size to determine what size black box, fonts, etc.
	 * we should be using. Solves the issue of performances on low resolution 
	 * or small screens.
	 */
	refreshStyles:function() {
		var normalFontSize = 20;
		var idealScreenSize = 1440 * 900;
		var screenSize = screen.height*screen.width;
		var multiplier = screenSize/idealScreenSize;
		
		var smallFontSize = 12;
		var largeFontSize = 35;
		
		hthas.nlFS = normalFontSize*multiplier;
		hthas.smFS = smallFontSize*multiplier;
		hthas.lgFS = largeFontSize*multiplier;
		hthas.sWidth = screen.width/4;
	},
	/**
	 * Called after page load.
	 */
	initialize:function() {
		hthas.initializeSentences();
		hthas.initializeInferences();
		hthas.mapKeywords();
		hthas.initializeStyles();
		hthas.audio.setUpQueue();
		hthas.audio.createPlayer();
	},
	/**
	 * hthas.audio holds all of the logic related to audio setup, playback, and queueing
	 */	
	audio : {
		setUpQueue:function(){
			for(var i in RAW_QUEUE_TIMES) {
				var rawTime = RAW_QUEUE_TIMES[i].time;
				var rawKeyword = RAW_QUEUE_TIMES[i].keyword;
				
				//calculate in seconds
				var minStr=rawTime.split(":")[0];
				var secStr=rawTime.split(":")[1];
				var minNum = Number(minStr);
				var secNum = Number(secStr);
				var totalSecs = minNum*60 + secNum;
				totalSecs += '';
				
				hthas.audio.queue[totalSecs] = {
					keyword:rawKeyword, set: true
				};
			}
		},
		/**
		 * Handles loading of the audio player and using the position
		 * to queue sentences.
		 * 
		 * @author yoni.ben-meshulam
		 */
		createPlayer:function() {
			// generate mp3 file path
			var path = window.location.href;
			path = path.split('/');
			path[path.length-1]="audio/hthas.mp3";
			path = path.join("/");
			// set up and instantiate player
		    var flashvars = {
		            file:path, 
		            autostart:"false"
		    }
		    var params = {
		            allowscriptaccess:"always",
					bufferlength:"60"
		    }
		    var attributes = {
		            id:"player1",  
		            name:"player1"
		    }
		    swfobject.embedSWF("lib/player.swf", "placeholder1", "320", "196", "9.0.115", false, flashvars, params, attributes);
		},
		/**
		 * We attached this listener to the player. It receives the time info every 1/10 of a second.
		 * @param {duration:'a number',position:'a number'}
		 */
		timeListener:function(obj) {
			var playTime = Math.floor(obj.position);
			if(hthas.audio.queue[playTime] && hthas.audio.queue[playTime].set) {
				hthas.queueNextSentence();
				hthas.audio.queue[playTime].set = false; //make sure it isn't called twice
			}
			//the end of the presentation
			if(playTime == 1111) setTimeout("hthas.endPresentation();", 5000);
		},
		player:null,
		// Contains the position in seconds for queueing the sentences
		queue:[]
	}
}

/**
 * A prototype for Sentence objects 
 * (i.e. a recipe for making a Sentence)
 * args must be an object literal (i.e. a map of key:value pairs).
 * It supports the following keys:
 * text, position, type
 * 
 * Usage:
 * var sentence = new Sentence(
 *     {
 *     		text:'My Sentence goes like this', 
 *     		position:{x:'100',y:'100'},
 *     		type:'left'
 * 	   });
 * 
 * text: any text value, supports embedded html.
 * type: left/right, depending on which speaker wrote the sentence
 * 
 * @param {Object} args
 * @author yoni
 */
Sentence = function(args){
	//set the member values, according to the constructor parameters
	this.text = args.text;
	this.position = args.position;
	this.type = args.type;

	/***************************************************************
	 * Set up document element for the Sentence
	 **************************************************************/
	//create a document element that will contain our text on screen
	this.element = document.createElement("span");
	
	// set up the document element
	this.element.id = args.id;
	this.element.innerHTML = this.text;
	this.element.className = "sentence";
	this.element.style.display = 'inline';

	//the initial position of the sentence on the screen
	this.element.style.bottom = this.position.y;
	if(this.type == 'left') {
		this.element.style.left = this.position.x;
	} else {
		this.element.style.right = this.position.x;
	}
	//add element to the document
	document.body.appendChild(this.element);
}

/**
 * A prototype for Inference objects 
 * (i.e. a recipe for making an Inference)
 * args must be an object literal (i.e. a map of key:value pairs).
 * It supports the following keys:
 * text, position, type
 * 
 * Usage:
 * var sentence = new Sentence(
 *     {
 *     		text:'My Sentence goes like this', 
 *     		position:{x:'100',y:'100'},
 *     		type:'left'
 * 	   });
 * 
 * text: any text value, supports embedded html.
 * type: left/right, depending on which speaker wrote the sentence
 * 
 * @param {Object} args
 * @author yoni
 */
Inference = function(args){
	//set the member values, according to the constructor parameters
	this.text = args.text;
	this.position = args.position;
	this.type = args.type;

	/***************************************************************
	 * Set up document element for the Inference
	 **************************************************************/
	//create a document element that will hold our text on screen
	this.element = document.createElement("span");
	
	// set up the document element
	this.element.id = args.id;
	this.element.innerHTML = this.text;
	this.element.className = "inference";
	this.element.style.display = 'none';

	//add element to the document
	document.body.appendChild(this.element);
};
