package bonusUnfinished;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

public class Decipher {

    Scanner scan;
    HashMap<Integer, Character> cipher = new HashMap<>();
    HashMap<Character, Integer> reverseCipher = new HashMap<>();
    ArrayList<Integer> shiftList = new ArrayList<>();
    int shift = 0;

    public Decipher() throws FileNotFoundException {
        this.scan = new Scanner(new File("words_alpha.txt"));
    }

    public void Cipher() {
        char[] alphabet = "abcdefghijklmnopqrstuvwxyz".toCharArray();
        for (int i = 0; i < 26; i++) {
            cipher.put(i, alphabet[i]);
        }
        for (int i = 0; i < 26; i++) {
            reverseCipher.put(alphabet[i], i);
        }
    }

    public void decrypt(String message) {
        LinkedList<String> stringLinkedList = new LinkedList<String>(List.of(message.toLowerCase().split("\\W")));
        shiftList.add(0);
        shiftList.add(1);
        while (shiftList.size() > 2) {
            for (String string : stringLinkedList) {
//                decryptMessage(string);

            }
        }
    }

/*    public int decryptMessage(String string) {

    }*/


    public void countEncrypt(String string) {
        StringBuilder message = new StringBuilder(string);
        StringBuilder decodingMessage = new StringBuilder();
        ArrayList<Character> messageChar = new ArrayList<Character>();
        ArrayList<Integer> messageList = new ArrayList<>();
        ArrayList<Integer> maxList = new ArrayList<>();
        int equaledMessage = 0;
        for (int i = 0; i < cipher.size(); i++) {
            equaledMessage = 0;
            decodingMessage = new StringBuilder(string);
            for (char c : messageChar) {
                decodingMessage.append(cipher.get(c) + 1);
            }
            if (scan.hasNext()) {
                if (decodingMessage.toString().equals(scan.next())) {
                    equaledMessage++;
                }
            }
            messageList.add(equaledMessage);
        }
        for (int i : messageList) {
            for (Integer integer : maxList) {
                if (i >= integer) {
                    maxList.add(i);
                }
            }
        }
    }
}
