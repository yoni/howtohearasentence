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
		var id = hthas.Sentences[hthas.sentenceQueue].element.id;
		$(id).animate({left:'300px', bottom:'300px'}, 5000);
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
				if(keyword=='prototype') {
					alert(sentence.id);
				}
				if (!hthas.keywordMap[keyword]) {
					hthas.keywordMap[keyword] = sentence.id;
				}
				else {
					hthas.keywordMap[keyword] += ',' + sentence.id;
				}
			});
		});
		
	/*
	 * 
1,18,3,false
5,16,2,false
27,34,10,false
11,30,8,false
1,26,5,false
21,40,12,false
3,18,4,false
29,20,7,false
33,0,9,false
39,28,11,false

[
6,13,1,false (remove s)
],[
],[
],[
11,28,6,false (remove s)
],[
],[
],[
],[
],[
],[
]];

	 */
		
		/*
		$('.keyword').each(function() {
			hthas.keywordMap[this.innerHTML] = {sentences:'', color:''};
		});
		
		for(var keyword in hthas.keywordMap) {
			$('.sentence').each(function(){
				var sentence = this;
				$(sentence + ' .keyword').each(function(){
					hthas.keywordMap[keyword].sentences += sentence.id + ',';
				});
			});
		}
		*/
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
		var color = hthas.keywordColors.pop();
		return color;
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
	}
	
}
