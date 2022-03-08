import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Pattern;

public class Main {
    String cardName;
    public String toString() {
        return null;
    }
    public static void main(String[] args) {
        LinkedList<String> deck = new LinkedList<String>();
        LinkedList<String> sortedDeck = new LinkedList<String>();

        NumberCards nc = new NumberCards();
        FaceCards fc = new FaceCards();
        for (Suit suits : Suit.values()) {
            for (int i = 0; i < nc.getNumberCards().size(); i++) {
                deck.add(nc.numberCards.get(i) + suits);
            }for (int i = 0; i < fc.getFaceCards().size(); i++) {
                deck.add(fc.faceCards.get(i) +suits);
            }
        }
        for (int i = 0; i < 4; i++) {
            List<Suit> suitList = Arrays.asList(Suit.values());
            for (String num : nc.numberCards) {
                for (String face : fc.faceCards) {
                    for (String str : deck) {
                        if (str.equals(face)) {
                            if (str.equals(String.valueOf(suitList.get(i)))) {
                                sortedDeck.add(str);
                            }
                        }
                    }
                }
            }
        }
        System.out.println(sortedDeck);
    }

    @Override
    public int hashCode() {
        return cardName.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        Main other = (Main) obj;
        if (this.cardName.contains((CharSequence) other)) {
            return true;
        }
        return false;
    }
}
