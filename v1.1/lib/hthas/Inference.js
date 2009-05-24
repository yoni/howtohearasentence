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

	//the initial position of the sentence on the screen
	this.element.style.top = this.position.y;
	this.element.style.left = this.position.x;
	//add element to the document
	document.body.appendChild(this.element);
};