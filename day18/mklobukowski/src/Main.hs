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
      goDown l' = goDown . right $ l'
   in fmap goDown . goUp . up $ l
previous _ = Nothing

next :: Location -> Maybe Location
next l@(RegularNumber _, Left' _ _) = Just . right . up $ l
next l@(RegularNumber _, Right' _ _) =
  let goUp l'@(Pair _ _, Left' _ _) = Just . right . up $ l'
      goUp l'@(Pair _ _, Right' _ _) = goUp . up $ l'
      goUp l'@(Pair _ _, Top) = Nothing
      goUp _ = Nothing
      goDown l'@(RegularNumber _, _) = l'
      goDown l' = goDown . left $ l'
   in fmap goDown . goUp . up $ l
next _ = Nothing

explode :: (SnailfishNumber, Context) -> Maybe Location
explode l@(Pair (RegularNumber nl) (RegularNumber nr), _) =
  let s1 = left l
      s2 = case previous s1 of
        Just (RegularNumber n, c) -> next (RegularNumber (n + nl), c)
        _ -> Just s1
      s3 = case s2 >>= next >>= next of
        Just (RegularNumber n, c) -> previous (RegularNumber (n + nr), c)
        _ -> s2
   in case up <$> s3 of
        Just (Pair _ _, c) -> Just (RegularNumber 0, c)
        _ -> Nothing
explode l = Nothing

main :: IO ()
main = do
  print . fmap upMost . explode . left . top $ sample3
  print ""
