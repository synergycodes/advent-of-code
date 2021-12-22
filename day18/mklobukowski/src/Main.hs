module Main where

import Data.Foldable

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

lvl (_, _, l) = l

findPair [] = Nothing
findPair [n] = Nothing
findPair (n1 : n2 : ns)
  | lvl n1 == lvl n2 = Just (n1, n2)
  | otherwise = findPair (n2 : ns)

flatten n = flatten' (n, top, 0)

p = Pair

n = RegularNumber

-- [[[[[9,8],1],2],3],4]
sample1 =
  p (p (p (p (p (n 9) (n 8)) (n 1)) (n 2)) (n 3)) (n 4)

-- [7,[6,[5,[4,[3,2]]]]]
sample2 =
  p (n 7) (p (n 6) (p (n 5) (p (n 4) (p (n 3) (n 2)))))

sample3 =
  p (p (n 1) (n 2)) (p (n 3) (n 4))

previous :: Location -> Maybe Location
previous l@(RegularNumber _, Right' _ _) = Just . left . up $ l
previous l@(RegularNumber _, Left' _ _) =
  let goUp l'@(Pair _ _, Right' _ _) = Just . left . up $ l'
      goUp l'@(Pair _ _, Left' _ _) = goUp . up $ l'
      goUp l'@(Pair _ _, Top) = Nothing
      goUp _ = Nothing
      goDown l'@(RegularNumber _, _) = l'
      goDown l' = goDown . right $  l'
   in  fmap goDown . goUp . up $ l
previous _ = Nothing

next :: Location -> Maybe Location
next l@(RegularNumber _, Left' _ _) = Just . right . up $ l
next l@(RegularNumber _, Right' _ _) =
  let goUp l'@(Pair _ _, Left' _ _) = Just . right . up $ l'
      goUp l'@(Pair _ _, Right' _ _) = goUp . up $ l'
      goUp l'@(Pair _ _, Top) = Nothing
      goUp _ = Nothing
      goDown l'@(RegularNumber _, _) = l'
      goDown l' = goDown . left $  l'
   in  fmap goDown . goUp . up $ l
next _ = Nothing

main :: IO ()
main = do
  print . right . right . top $ sample3
  print ""
  print . previous . right . right . top $ sample3
  print ""
  print .  ((=<<) previous . previous) . right . right . top $ sample3
  print ""
  print .  ((=<<) previous . (=<<) previous . previous) . right . right . top $ sample3
  print ""
  print .  ((=<<) next . (=<<) previous . (=<<) previous . previous) . right . right . top $ sample3
  print ""
  print .  ((=<<) next . (=<<) next . (=<<) previous . (=<<) previous . previous) . right . right . top $ sample3

-- print . previous . right . right . left . left . left . top $ sample1
-- print . previous . right . left . left . left . left . top $ sample
-- print . fmap (\(n, _, l) -> (n, l)) . flatten $ sample
