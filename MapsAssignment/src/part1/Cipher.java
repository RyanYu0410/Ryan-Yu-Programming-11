package part1;

import java.util.*;

public class Cipher {
    HashMap<Integer, Integer> cipher = new HashMap<>();
    List<Integer> code = new ArrayList<>();

    public Cipher() {
        for (int i = 0; i < 26; i++) {
            cipher.put(i, i);
        }
    }

    public int encrypt(int message) {
        LinkedList<Integer> messageChar = new LinkedList<>();
        int encryptedMessage = 0;
        int multiply = 1;
        while (message > 0) {
            messageChar.add( message % 10 );
            message = message / 10;
        }

        for (int i  : messageChar) {
            this.code.add(cipher.get(cipher.get(i)+1));
        }
        for (int i : code) {
            encryptedMessage += i * multiply;
            multiply *= 10;
        }
        return encryptedMessage;
    }

    public int decrypt(int message) {
        this.code = new ArrayList<>();
        LinkedList<Integer> messageChar = new LinkedList<>();
        int decryptedMessage = 0;
        int multiply = 1;
        while (message > 0) {
            messageChar.add( message % 10 );
            message = message / 10;
        }

        for (int i  : messageChar) {
            this.code.add(cipher.get(cipher.get(i) - 1));
        }
        for (int i : code) {
            decryptedMessage += i * multiply;
            multiply *= 10;
        }
        return decryptedMessage;
    }
}
