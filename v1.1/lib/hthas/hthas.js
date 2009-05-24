/**
 * @author yoni
 */
var hthas = {
	//the black box and sentence width
	sWidth:screen.width/4,
	//These arraya will hold our Sentence and Inference objects, arranged in order
	Sentences:[],
	Inferences:[],
	// the inde of the next sentence to animate in
	sentenceQueue:0,
	// holds sentence ids for those sentences that made it to the black box
	bBoxSentences:{},
	/**
	 * On each spacebar press, we queue in the next sentence.
	 * @param {Object} eventObject
	 */
	handleKeypress:function(eventObject) {
		switch (eventObject.which) {
			case 32://spacebar pressed
				if (hthas.sentenceQueue < hthas.Sentences.length) {
					hthas.queueNextSentence();
				}
				else{
					hthas.endPresentation();
				}
				break;
			default:
				break;
		}
	},
	
	/**
	 * Called after all of the sentences have been animated in.
	 */
	endPresentation:function() {
		//do something?
	},
	
	/**
	 * Loads next sentence into the page from a random spot on 
	 * either the right or the left, depending on who the 
	 * speaker is. Sentences immediately begin moving toward 
	 * the black box
	 */
	queueNextSentence:function() {
		var bbPosition = $('.blackBox').position();
		var sentenceId = hthas.Sentences[hthas.sentenceQueue].element.id;
		$('#'+sentenceId).animate({
				left:bbPosition.left + 'px', 
				top:bbPosition.top + 'px'}, 
				10000,
				'linear', 
				function(){
					hthas.handleSentenceAnimationEnd(sentenceId);
				});
		hthas.sentenceQueue++;
	},
	
	/**
	 * Called when the sentence animation ends, and the sentence is in the box.
	 */
	handleSentenceAnimationEnd:function(sentenceId) {
		// for each keyword in the sentence
		
		//TODO: add the keywords to the box instead of just changing their colors
		$('#'+ sentenceId +' .keyword').each(
			function() {
				
				var keyword = hthas.cleanKeyword(this.innerHTML);
				
				//place keyword in the box				
				var kColor = hthas.keywordMap[keyword].color;
				$(this).css(
					{
						'color':kColor,'font-size': '24px'
					});
				
				//set this sentence as having arrived at the box
				hthas.bBoxSentences[sentenceId] = true;
				//check if all sentences realated to the keyword have made it to the box
				var kSentences = hthas.keywordMap[keyword].sentences;
				
			});
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
			});
		});
		
	},
	
	/**
	 * Colors to be used for 'lighting up' keywords
	 */
	keywordColors:['#F08080','#DC132C','#EEB422','#0000FF',
	'#FF8C00','#006400','#8B2323','#9932CC','#B8860B','#00008B',
	'#B452CD','#2F4F4F'],
	
	/**
	 * Returns the next available color from the array of possible keyword colors
	 */
	getKeywordColor:function(){
		
		//for now, just getting a random color. need to change this.
		var rand = Math.random()*hthas.keywordColors.length;
		rand = Math.floor(rand);
		return hthas.keywordColors[rand];;
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
		var margin = 10;
		for(var i = 0; i < INFERENCES.length; i++) {
			var args = {};
			args.text = INFERENCES[i];
			args.position = {x:screen.width/4 + 'px', y: nextInfY + margin + 'px'};
			args.id = 'inference'+i;
			var inf = new Inference(args);
			nextInfY += $(inf.element).outerHeight();
			hthas.Inferences.push(inf);
		}
	},
	
	/**
	 * Set up positioning for the black box.
	 */
	initializeStyles:function() {
		
		// set up size of black box
		$('.blackBox').css('height',screen.height/4 + 'px');
		$('.blackBox').css('width',hthas.sWidth + 'px');
		//set up position of black box
		$('.blackBox').css('left',screen.width/2 - screen.width/8+ 'px');
		$('.blackBox').css('top',screen.height/2 + 'px');
				
		
		$('.sentence').css('width',	hthas.sWidth);
	}
	
}
