import java.util.Random;

import processing.core.PApplet;
import rita.*;

public class HTHASApplet extends PApplet {
	Random rand = new Random();
	RiPosTagger posTagger = new RiPosTagger();

	RiText[] sentences;
	RiText[] inferences;
	
	int clicks = 0;

	public void setup() {
		RiText.disableAutoDraw();
		size(1000, 1000);
		sentences = RiText.loadStrings(this, "sentences.txt");
		inferences = RiText.loadStrings(this, "inferences.txt");
		for(RiText rt : RiText.getInstances()) {
			rt.setMouseDraggable(true);
		}
	}

	public void draw() {
		background(128, 255, 0);
	}

	public void mouseClicked() {
		//pick a random sentence and position it  at a random point on the screen
		float[] point = randomPosition(); 
		RiText rt = (RiText) RiTa.random(RiText.getInstances());
		rt.setLocation(point[0], point[1]);
		rt.createFont("Arial", 20);
		rt.draw();
		
		//make it animate
		float[] newPoint = randomPosition();
		rt.moveTo(newPoint[0], newPoint[1], 4);
		//textManipulation();
	}
	
	private float[] randomPosition() {
		float yCoord = rand.nextInt(getSize().height);
		float xCoord = rand.nextInt(getSize().width);
		float[] point = {xCoord, yCoord};
		return point;
	}

	private void textManipulation() {
		RiAnalyzer ra = new RiAnalyzer(this);
		String a = "Marisa is too sick to go to work tomorrow. She should probably just stay home.";
		ra.analyze(a);
		ra.dumpFeatures();
		RiText rt = new RiText(this, ra.getStresses(), getSize().height/2, getSize().width/2);
		rt.createFont("Arial", 30);
	}

}
