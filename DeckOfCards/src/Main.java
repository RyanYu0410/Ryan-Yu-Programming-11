public class Main {
    public static void main(String[] args) {
        Deck deck = new Deck();
        deck.printList(deck.originalDeck);
        deck.setHand();
        System.out.println("**********HAND**********");
        deck.printList(deck.hand);
        deck.setSortedDeck(deck.deck);
        System.out.println("**********SORTED**********");
        deck.printList(deck.sortedDeck);
    }
}

