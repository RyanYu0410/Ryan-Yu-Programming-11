package Bonus;

public class Main {
    public static void main(String[] args) {
        Message message = new Message();
        Cipher cipher = new Cipher();
        cipher.encrypt(message.message);
        System.out.println(message.message);
        System.out.println(cipher.code);
    }
}
