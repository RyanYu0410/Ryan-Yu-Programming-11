import java.util.LinkedList;
import java.util.List;

public class NumberCards{
    LinkedList<String> numberCards = new LinkedList<String>();
    public NumberCards() {
        String[] cards = {"1", "2", "3", "4", "5", "6", "7", "8", "9", "10"};
        for (String card : cards) {
            numberCards.add(card);
        }
    }

    public LinkedList<String> getNumberCards() {
        return numberCards;
    }
}
