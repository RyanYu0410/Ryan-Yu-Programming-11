import java.util.Collections;
import java.util.LinkedList;

public class FaceCards{
    LinkedList<String> faceCards = new LinkedList<String>();
    public FaceCards() {
        String[] cards = {"Aces", "King", "Queen", "Jack"};
        Collections.addAll(faceCards, cards);
    }

    public LinkedList<String> getFaceCards() {
        return faceCards;
    }
}
