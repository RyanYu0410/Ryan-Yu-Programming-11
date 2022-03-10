package Bonus;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Cipher {
    HashMap<Integer, Character> cipher = new HashMap<>();
    HashMap<Character, Integer> reverseCipher = new HashMap<>();
    List<Character> code = new ArrayList<>();

    public Cipher() {
        char[] alphabet = "abcdefghijklmnopqrstuvwxyz".toCharArray();
        for (int i = 0; i < 26; i++) {
            cipher.put(i, alphabet[i]);
        }
        for (int i = 0; i < 26; i++) {
            reverseCipher.put(alphabet[i], i);
        }
    }

    public String encrypt(String message) {
        char[] messageChar= message.toLowerCase().toCharArray();
        for (char c : messageChar) {
            if (reverseCipher.containsValue(c)) {
                int locale = reverseCipher.get(c);
                this.code.add(cipher.get(locale+1));
            } else {
                this.code.add(c);
            }
        }
        return String.valueOf(code);
    }
}

