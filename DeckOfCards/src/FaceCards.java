import java.util.LinkedList;
import java.util.List;

public class FaceCards{
    LinkedList<String> faceCards = new LinkedList<String>();
    public FaceCards() {
        String[] cards = {"Aces", "King", "Queen", "Jack"};
        for (String card : cards) {
            faceCards.add(card);
        }
    }

    public LinkedList<String> getFaceCards() {
        return faceCards;
    }
}
