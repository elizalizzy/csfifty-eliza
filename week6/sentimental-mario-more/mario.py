height = 0

while height < 1 or height > 8:
    try:
        height = int (input("height:"))
    except ValueError:
        print("enter a valid height")

for i in range(height):
    print(" " * (height - 1 - i), end = "")
    print("#" * (i + 1) + "  " +"#" * (i + 1))

