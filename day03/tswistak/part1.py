import os

file = open(os.path.dirname(os.path.abspath(__file__)) + '/data.txt', 'r')
lines = file.read().splitlines()

def order_by_frequency(position):
  zero_counter = 0
  one_counter = 0

  for line in lines:
    if (line[position] == '0'):
      zero_counter += 1
    else:
      one_counter +=1

  return [0, 1] if zero_counter > one_counter else [1, 0]

gamma = 0
epsilon = 0
length = len(lines[0])

for i in range(length):
  numbers = order_by_frequency(i)
  pos = pow(2, length - i - 1)
  gamma += numbers[0] * pos
  epsilon += numbers[1] * pos

print(f'gamma: {gamma}')
print(f'epsilon: {epsilon}')
print(f'gamma * epsilon: {gamma * epsilon}')