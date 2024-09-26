public enum Suit {
     Spade("Spade"),Heart("Heart"),Club("Club"), Diamond("Diamond");

     final String name;

      Suit(String name) {
           this.name = name;
      }

     public String getName(Suit suit) {
          return name;
     }
}