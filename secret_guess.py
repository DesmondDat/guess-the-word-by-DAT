import hashlib
import getpass
import sys

def sha256(x):
    return hashlib.sha256(x.encode()).hexdigest()

def play(secret, demo=False):
    secret = secret.lower()
    print("Secret hash (commit):", sha256(secret))
    masked = [c if not c.isalpha() else '_' for c in secret]
    guessed = set()
    if demo:
        guesses = list(dict.fromkeys(list(secret)))
    else:
        guesses = []
    while '_' in masked:
        print('Word:',''.join(masked))
        if demo and guesses:
            g = guesses.pop(0)
            print(f"(demo guess) -> {g}")
        else:
            g = input('Guess a letter (or type quit): ').strip().lower()
            if g == 'quit':
                break
        if not g or not g.isalpha():
            continue
        if g in guessed:
            continue
        guessed.add(g)
        for i,ch in enumerate(secret):
            if ch == g:
                masked[i] = g
    print('Final word:', secret)
    print('Reveal hash:', sha256(secret))

if __name__ == '__main__':
    if '--demo' in sys.argv:
        play('Arcium', demo=True)
    else:
        s = getpass.getpass('Player A, enter the secret word (hidden): ')
        play(s)
