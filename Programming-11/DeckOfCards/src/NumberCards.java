import java.util.Collections;
import java.util.LinkedList;

public class NumberCards{
    LinkedList<String> numberCards = new LinkedList<String>();
    public NumberCards() {
        String[] cards = {"1", "2", "3", "4", "5", "6", "7", "8", "9", "10"};
        Collections.addAll(numberCards, cards);
    }

    public LinkedList<String> getNumberCards() {
        return numberCards;
    }
}
