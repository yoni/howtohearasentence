/**
 * @author yoni
 */
var hthas = {
	//This array will hold our Sentence objects, arranged in order
	Sentences:[],
	
	/**
	 * On each spacebar press, we queue in the next sentence.
	 * @param {Object} eventObject
	 */
	handleKeypress:function(eventObject) {
		switch (eventObject.which) {
			case 32://spacebar pressed
				hthas.queueNextSentence();
				break;
			default:
				break;
		}
	},
	
	/**
	 * Finds common keywords between sentences.
	 */
	findCommonKeywords:function(){
		var keywords = "";
		$('.keyword').each(function(){
			keywords += $(this).html() + "\n";
			return keywords;
		});
	},
	
	sentenceQueue:0,
	/**
	 * Loads next sentence into the page from a random spot on 
	 * either the right or the left, depending on who the 
	 * speaker is. Sentences immediately begin moving toward 
	 * the black box
	 */
	queueNextSentence:function() {
		var bbPosition = $('.blackBox').position();
		var id = hthas.Sentences[hthas.sentenceQueue].element.id;
		$('#'+id).animate({
				left:bbPosition.left + 'px', 
				top:bbPosition.top + 'px'}, 
				10000,
				'linear', 
				function(){
					hthas.handleSentenceAnimationEnd(id);
				});
		hthas.sentenceQueue++;
	},
	
	/**
	 * Called when the sentence animation ends, and the sentence is in the box.
	 */
	handleSentenceAnimationEnd:function(sentenceId) {
		// for each keyword in the sentence
		$('#'+ sentenceId +' .keyword').each(
			function() {
				//alert(this);
				var word = hthas.cleanKeyword(this.innerHTML);
				var kColor = hthas.keywordMap[word].color;
				$(this).animate(
					{
						color: 'blue'
					}, 1000);
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
		return keyword;
	},
	
	/**
	 * Map a given keyword to all of the Sentences that have that keyword
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
			args.position = {x:'0px', y:randomHeight+'px'};
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
	 * Set up positioning for the black box.
	 */
	initializeStyles:function() {
		// width for the black box and sentnences
		var width = screen.width/4;
		
		// set up size of black box
		$('.blackBox').css('height',screen.height/4 + 'px');
		$('.blackBox').css('width',width + 'px');
		//set up position of black box
		$('.blackBox').css('left',screen.width/2 - screen.width/8+ 'px');
		$('.blackBox').css('top',screen.height/2 + 'px');
		
		$('.sentence').css('width',	width);
	}
	
}
