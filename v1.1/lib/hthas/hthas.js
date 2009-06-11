/**
 * <h2>How To Hear A Sentence</h2>
 * Version 1.1
 * <br><br>
 * <p>This project was written as a second version of a performance/reading done
 * in collaboration with Marisa E. Plumb, Ira S. Murfin, and Yoni Ben-Meshulam.</p>
 * <p>The performance involved the reading of two articles, one written by Ira S. Murfin, 
 * and the other by Marisa E. Plumb. It should be noted that neither of the authors had 
 * read each other's articles before the performance. The performance aims to shed light on the
 * communication process, language and meaning, human-based inference, meanings of the same 
 * words in different context. For more details, see the <a href=http://www.marisaplumb.com/howtohearasentence>
 * project homepage</a>.</p>
 * 
 * <h3>Description of the performance and content writing process</h3>
 * 
 * <p>Each author identified 25 key words in their article and
 * sent them to the other to interpret and infer a sentence. Hemce, there are 25 sentences written 
 * in response to each article, for a total of 50 inferred sentences. These sentences are used in the code
 * as the Sentence object, and the article keywords are coined 'articleKeyword'.</p>
 * 
 * <p>After writing these inferrences, the writers convened and pseformed a second phase of inference 
 * from these fifty sentences, finding common key words in those sentences, and together writing 
 * inferences based on these. These inferences are used in the code as the Inference object, 
 * and the corresponding keywords are coined 'keyword'.</p>
 * 
 * <p>The performance involves either physical reading or electronic playback of the text, with each reader 
 * reading a passage from their article in turn. As article keywords are uttered, the corresponding 
 * sentence is queued in using the spacebar.</p>
 * 
 * <p>The initial position of Sentences are random (rather pseudo-random), but they always animate directly to 
 * the black box centered on the page. When a Sentence enters the black box, the keywords from that sentence
 * are rendered into the box, using a color randomly assigned to that keyword.</p>
 * 
 * <p>When two or more Sentences that were found to be related based on the keywords both make it into the black box, 
 * the corresponding Inference is ejected out of the box and into the poem area at the top of the page. The keyword
 * in the inference is colored with the same color, and the box momentarily flashes that color.</p>
 * 
 * <p>Generally at the end of the performance, the performer has the option of 'spawning' all of the sentences out 
 * of the box and having them fly around the bottom half of the page in random locations and having the keywords 
 * change sizes randomly.</p>
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
	}
}
