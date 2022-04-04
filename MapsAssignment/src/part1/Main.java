package part1;

public class Main {
    public static void main(String[] args) {
        Message message = new Message();
        Cipher cipher = new Cipher();
        System.out.println(message.message);
        System.out.println(cipher.encrypt(message.message));
        System.out.println(message.message);
        System.out.println(cipher.decrypt(message.message));
    }
}
