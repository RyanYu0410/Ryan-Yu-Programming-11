import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Cipher {
    HashMap<Integer, Character> cipher = new HashMap<>();

    public Cipher() {
        char[] alphabet = "abcdefghijklmnopqrstuvwxyz".toCharArray();
        for (int i = 0; i < 26; i++) {
            cipher.put(i, alphabet[i]);
        }
        System.out.println(cipher.entrySet());
    }

    public String encrypt(String message) {
        char[] messageChar= message.toCharArray();
        List<Character> code = new ArrayList<>();
        for (char c : messageChar) {
            int locale = cipher.get(c);
            code.add(cipher.get(locale+1));
        }
        return String.valueOf(code);
    }
}

