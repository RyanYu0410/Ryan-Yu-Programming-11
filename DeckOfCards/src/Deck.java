import java.util.LinkedList;
import java.util.Objects;

public class Deck {
    LinkedList<String> deck = new LinkedList<String>();
    LinkedList<String> originalDeck = new LinkedList<String>();
    LinkedList<String> sortedDeck = new LinkedList<String>();

    public Deck() {
        NumberCards nc = new NumberCards();
        FaceCards fc = new FaceCards();

        for (Suit suits : Suit.values()) {
            for (int i = 0; i < nc.getNumberCards().size(); i++) {
                this.deck.add(nc.numberCards.get(i) + suits);
            }for (int i = 0; i < fc.getFaceCards().size(); i++) {
                this.deck.add(fc.faceCards.get(i) +suits);
            }
        }
    }

    public void setOriginalDeck() {
        LinkedList<String> fullNumCardsNumber = new LinkedList<String>();
        NumberCards nc = new NumberCards();
        FaceCards fc = new FaceCards();
        fullNumCardsNumber.addAll(fc.getFaceCards());
        fullNumCardsNumber.addAll(nc.getNumberCards());
        for (String num : fullNumCardsNumber) {
            for (Suit suits : Suit.values()) {
                this.originalDeck.add(num + suits);
            }
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Deck deck1 = (Deck) o;
        return Objects.equals(deck, deck1.deck);
    }

    @Override
    public int hashCode() {
        return Objects.hash(deck);
    }

    public void setSortedDeck (LinkedList<String> sortedDeck) {
        for (String origin : originalDeck) {
            for (String card : deck) {
                if (card.equals(origin)) {
                    this.sortedDeck.add(card);
                }
            }
        }
    }
}
