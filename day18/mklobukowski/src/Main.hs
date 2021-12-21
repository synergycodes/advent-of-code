module Main where

data SnailfishNumber
  = RegularNumber Int
  | Pair SnailfishNumber SnailfishNumber
  deriving (Show)

data Context
  = Top
  | Left' Context SnailfishNumber
  | Right' Context SnailfishNumber
  deriving (Show)

type Location = (SnailfishNumber, Context)

top n = (n, Top) 

left rn@(RegularNumber n, _) = rn
left (Pair n1 n2, c) = (n1, Left' c n2)

right rn@(RegularNumber n, _) = rn
right (Pair n1 n2, c) = (n2, Right' c n1)

up (n, Top) = (n, Top)
up (n, Left' c n') = (Pair n n', c)
up (n, Right' c n') = (Pair n' n, c)

flatten (RegularNumber n, c) = [(RegularNumber n, c)]
flatten (Pair l r, c) = flatten (l, left . c) ++ flatten (r, right . c)

p = Pair

n = RegularNumber

sample =
  p (p (n 1) (n 11)) (p (n 2) (n 3))

goUp (RegularNumber _, Top) = Nothing
goUp (RegularNumber _, Right' _ _) = Nothing
goUp l@(RegularNumber _, Left' _ _) = goUp $ up l
goUp l@(Pair _ _, Top) = Just l
goUp l@(Pair _ _, Left' _ _) = goUp $ up l
goUp l@(Pair _ _, Right' _ _) = Just . up $ l


rn2 = left . right . top $ sample
rn3 = right . right . top $ sample
lrn2 = left . up . up $ rn2

main :: IO ()
main = do
  print . map fst . flatten  $ (sample, top) 
