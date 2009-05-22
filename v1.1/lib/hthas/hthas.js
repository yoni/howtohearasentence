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
