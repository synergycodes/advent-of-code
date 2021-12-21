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

upMost :: Location -> SnailfishNumber
upMost (n, Top) = n
upMost l = upMost . up $ l

modify :: (SnailfishNumber -> SnailfishNumber) -> (SnailfishNumber -> Location) -> SnailfishNumber -> SnailfishNumber
modify m f n =
  let (v, c) = f n
      v' = m v
   in upMost (v', c)

flatten' (RegularNumber n, c, lvl) = [(RegularNumber n, c, lvl)]
flatten' (Pair l r, c, lvl) = flatten' (l, left . c, lvl + 1) ++ flatten' (r, right . c, lvl + 1)

flatten n = flatten' (n, top, 0)

p = Pair

n = RegularNumber

sample =
  p (p (n 1) (n 11)) (p (n 2) (n 3))

rns = flatten sample

fix11 = 
  let (_, f, _) = rns !! 1
  in modify (const (RegularNumber 9)) f sample

main :: IO ()
main = do
  print  fix11
