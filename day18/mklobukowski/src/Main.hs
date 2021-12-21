module Main where

data SnailfishNumber
  = RegularNumber Int
  | Pair SnailfishNumber SnailfishNumber
  deriving (Show)

type Level = Int

data Context
  = Top
  | Left' Context SnailfishNumber
  | Right' Context SnailfishNumber
  deriving (Show)

type Location = (SnailfishNumber, Context)

top :: SnailfishNumber -> Location
top n = (n, Top)

left :: Location -> Location
left rn@(RegularNumber n, _) = rn
left (Pair n1 n2, c) = (n1, Left' c n2)

right :: Location -> Location
right rn@(RegularNumber n, _) = rn
right (Pair n1 n2, c) = (n2, Right' c n1)

up :: Location -> Location
up l@(_, Top) = l
up (n, Left' c n') = (Pair n n', c)
up (n, Right' c n') = (Pair n' n, c)

flatten (RegularNumber n, c, lvl) = [(RegularNumber n, c, lvl)]
flatten (Pair l r, c, lvl) = flatten (l, left . c, lvl + 1) ++ flatten (r, right . c, lvl + 1)

p = Pair

n = RegularNumber

sample =
  p (p (n 1) (n 11)) (p (n 2) (n 3))

rn2 = left . right . top $ sample

rn3 = right . right . top $ sample

lrn2 = left . up . up $ rn2

main :: IO ()
main = do
  print . map (\(n, _, l) -> (n, l)) . flatten $ (sample, top, 0)
