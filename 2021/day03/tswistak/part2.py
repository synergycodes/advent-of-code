import os

file = open(os.path.dirname(os.path.abspath(__file__)) + '/data.txt', 'r')
lines = file.read().splitlines()

def order_by_frequency(position, list):
  zero_counter = 0
  one_counter = 0

  for line in list:
    if (line[position] == '0'):
      zero_counter += 1
    else:
      one_counter +=1

  return ['0', '1'] if zero_counter > one_counter else ['1', '0']

o2 = lines.copy()
co2 = lines.copy()
length = len(lines[0])

for i in range(length):
  o2_num = order_by_frequency(i, o2)[0]
  co2_nums = order_by_frequency(i, co2)
  co2_num = co2_nums[1] if len(co2) > 1 else co2_nums[0]
  o2 = list(filter(lambda line: line[i] == o2_num, o2))
  co2 = list(filter(lambda line: line[i] == co2_num, co2))

o2_dec = int(o2[0], 2)
co2_dec = int(co2[0], 2)

print(f'o2_dec: {o2_dec}')
print(f'co2_dec: {co2_dec}')
print(f'o2_dec * co2_dec: {o2_dec * co2_dec}')