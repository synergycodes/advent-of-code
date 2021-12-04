import os

file = open(os.path.dirname(os.path.abspath(__file__)) + '/data.txt', 'r')
lines = file.read().splitlines()

# prepare data

numbers = list(map(lambda x: int(x), lines[0].split(",")))
bingos = []

current_bingo = []
for line in lines[2:]:
  if not line:
    bingos.append(current_bingo)
    current_bingo = []
  else:
    nums = list(map(lambda x: (int(x), False), filter(lambda x: x, line.split(" "))))
    current_bingo.append(nums)

# helper functions

def mark_number(index, number):
  bingo = bingos[index]
  for row in bingo:
    for i in range(len(row)):
      if row[i][0] == number:
        row[i] = (number, True)

def is_solved(index):
  bingo = bingos[index]
  # check rows
  for row in bingo:
    if all(x[1] for x in row):
      return True
  # check columns
  for i in range(len(bingo)):
    column = [x[i] for x in bingo]
    if all(x[1] for x in column):
      return True
  # not solved
  return False

# solve riddle

def solve():
  solved_bingos = set()
  last_solved = (None, None)
  for num in numbers:
    for i in range(len(bingos)):
      mark_number(i, num)
      if is_solved(i):
        solved_bingos.add(i)
        last_solved = (num, i)
        if len(solved_bingos) == len(bingos):
          return last_solved

(number, i) = solve()
print(f'number: {number}')
print(f'i: {i}')
print(f'bingo: {bingos[i]}')

flat_bingo = [x for row in bingos[i] for x in row]
filtered_bingo = list(filter(lambda x: not x[1], flat_bingo))
result = number * sum([x[0] for x in filtered_bingo])
print(f'result: {result}')