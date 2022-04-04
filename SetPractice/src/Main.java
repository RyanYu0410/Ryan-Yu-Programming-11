import java.io.File;
import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Scanner;
public class Main {
    public static void main(String[] args) throws FileNotFoundException {
        Scanner scanner = new Scanner(new File("illiad.txt"));
        HashSet<String> uniqueWord = new HashSet<>();
        while (scanner.hasNextLine()) {
            String[] split = scanner.nextLine().toLowerCase().split("\\W");
            uniqueWord.addAll(Arrays.asList(split));
        }
        uniqueWord.remove("");
        System.out.println(uniqueWord.size());
        for (String str : uniqueWord) {
            System.out.println(str);
        }
    }
}