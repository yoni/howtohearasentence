/**
 * @author yoni
 */
var hthas = {
	//the black box and sentence width
	sWidth:screen.width/4,
	//These arraya will hold our Sentence and Inference objects, arranged in order
	Sentences:[],
	Inferences:[],
	InferenceMap:{},
	// the inde of the next sentence to animate in
	sentenceQueue:0,
	// holds sentence ids for those sentences that made it to the black box
	bBoxSentences:{},
	bBoxKeywords:{},
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
		$('#'+ sentenceId).hide();

		// for each keyword in the sentence
		//TODO: add the keywords to the box instead of just changing their colors
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
				$('.blackBox').append(kElement);

				//set this sentence as having arrived at the box
				hthas.bBoxSentences[sentenceId] = true;

				//check if all sentences realated to the keyword have made it to the box
				if(hthas.areAllSentencesInBox(keyword)) {
					hthas.queueKeywordInference(keyword);
				}
				else {
					//console.debug('Not all sentences in box for keyword' + keyword);
				}
			});
	},
	
	/**
	 * Called when all sentences for a given keyword made it into the box
	 * TODO: break this function up
	 * @param {Object} keyword
	 */
	queueKeywordInference:function(keyword) {
		var sentenceIds = hthas.keywordMap[keyword].sentences.split(',');
		var inferenceId = hthas.keywordMap[keyword].inference;
		
		if(inferenceId) { //not all keywords have an inference
			var bbPosition = $('.blackBox').position();
			//animateSentences(sentenceIds);
			
			var iPos = hthas.InferenceMap[inferenceId].position;
			// animate inference
			$('#' + inferenceId)
				.css({width:'10px'})
				.show()
				.animate({top:iPos.top, left:iPos.left, width:screen.width*3/4+'px'}, 2000);
				//.animate({
					//top:iPos.top+'px',
					//left:iPos.left + 'px'
					//}, 
					//1000);
				
			//make box go white and back to black
			$('.blackBox')
				.animate(
					{
						'background-color':'white',
						'z-index':'2'
					}, 
					1000,
					'linear', 
					function(){
						$(this).animate(
							{
								'background-color':'black',
								'z-index':'0'
							}, 
							500
							);
					});
		}
	},
	animateSentences:function(sentenceIds) {
		var bbPosition = $('.blackBox').position();
		
		for(var i = 0; i < sentenceIds.length; i++) {
			var sentenceId = sentenceIds[i];
			var leftPos;
			var topPos;
			if(i%2) {
				leftPos = bbPosition.left - hthas.sWidth * i;
			} else {
				leftPos = bbPosition.left + hthas.sWidth + hthas.sWidth * i;
			}
			topPos = bbPosition.top - 2 * hthas.sWidth * i;
			$('#' + sentenceId).show();
			
			$('#' + sentenceId)
				.show()
				.animate(
					{top:topPos + 'px', left:leftPos + 'px'}, 
					3000, 
					'linear',
					function(){
						$(this).animate(
							{top:bbPosition.top + 'px', left:bbPosition.left + 'px'}, 
							3000,
							'linear',
							function(){
								$(this).hide();
							});		
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
			//console.debug('Checking if ' + sentenceId + ' is in the box');
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
		var rand = Math.random()*keywordColors.length;
		rand = Math.floor(rand);
		return keywordColors[rand];;
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
		var margin = 15;
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
	 * Set up positioning for the black box.
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
		
	}
	
}
