from random import randint
i = 1

for b in range(1, 21):
    for count in range(randint(3, 8)):
        u = randint(1, 22)
        p = randint(1, 100)
        c = int(p*(1+randint(-20, 20)/100))
        print(i, b, u, p, c, sep=',')
        i += 1