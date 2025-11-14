import java.util.*;
import java.security.*;

public class SecretGuess {
    public static String sha256(String s) {
        try{ MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] b = md.digest(s.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder();
            for(byte x: b) sb.append(String.format("%02x", x));
            return sb.toString();
        } catch(Exception e){ return ""; }
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Player A, enter secret word (will be visible here): ");
        String secret = sc.nextLine().trim().toLowerCase();
        System.out.println("Secret hash (commit): " + sha256(secret));
        char[] masked = new char[secret.length()];
        for (int i=0;i<secret.length();i++) masked[i] = Character.isLetter(secret.charAt(i)) ? '_' : secret.charAt(i);
        Set<Character> guessed = new HashSet<>();
        while (new String(masked).contains("_")) {
            System.out.println("Word: " + new String(masked));
            System.out.print("Guess a letter (or type quit): ");
            String g = sc.nextLine().trim().toLowerCase();
            if (g.equals("quit")) break;
            if (g.length()==0 || !Character.isLetter(g.charAt(0))) continue;
            char c = g.charAt(0);
            if (guessed.contains(c)) continue;
            guessed.add(c);
            for (int i=0;i<secret.length();i++) if (secret.charAt(i)==c) masked[i]=c;
        }
        System.out.println("Final word: " + secret);
        System.out.println("Reveal hash: " + sha256(secret));
    }
}
