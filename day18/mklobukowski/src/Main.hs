module Main where

import Control.Monad ((<=<))
import Data.Foldable

data SnailfishNumber
  = RegularNumber Int
  | Pair SnailfishNumber SnailfishNumber
  deriving (Show, Eq)

type Level = Int

data Context
  = Top
  | Left' Context SnailfishNumber
  | Right' Context SnailfishNumber
  deriving (Show, Eq)

type Location = (SnailfishNumber, Context, Level)

top :: SnailfishNumber -> Location
top n = (n, Top, 1)

left :: Location -> Location
left rn@(RegularNumber n, _, _) = rn
left (Pair n1 n2, c, l) = (n1, Left' c n2, l + 1)

right :: Location -> Location
right rn@(RegularNumber n, _, _) = rn
right (Pair n1 n2, c, l) = (n2, Right' c n1, l + 1)

up :: Location -> Location
up l@(_, Top, _) = l
up (n, Left' c n', l) = (Pair n n', c, l - 1)
up (n, Right' c n', l) = (Pair n' n, c, l - 1)

upMost :: Location -> SnailfishNumber
upMost (n, Top, _) = n
upMost l = upMost . up $ l

p = Pair

n = RegularNumber

-- previous :: Location -> Maybe Location
-- previous l@(RegularNumber _, Right' _ _, _) = Just . left . up $ l
-- previous l@(RegularNumber _, Left' _ _, _) =
--   let goUp l'@(Pair _ _, Right' _ _, _) = Just . left . up $ l'
--       goUp l'@(Pair _ _, Left' _ _, _) = goUp . up $ l'
--       goUp l'@(Pair _ _, Top, _) = Nothing
--       goUp _ = Nothing
--       goDown l' =
--         let l'' = right l'
--          in if l'' == l' then l' else goDown l''
--    in fmap goDown . goUp . up $ l
-- previous _ = Nothing

-- next :: Location -> Maybe Location
-- next l@(RegularNumber _, Left' _ _, _) = Just . right . up $ l
-- next l@(RegularNumber _, Right' _ _, _) =
--   let goUp l'@(Pair _ _, Left' _ _, _) = Just . right . up $ l'
--       goUp l'@(Pair _ _, Right' _ _, _) = goUp . up $ l'
--       goUp l'@(Pair _ _, Top, _) = Nothing
--       goUp _ = Nothing
--       goDown l'@(RegularNumber _, _, _) = l'
--       goDown l' = goDown . left $ l'
--    in fmap goDown . goUp . up $ l
-- next _ = Nothing

-- explode :: Location -> Maybe Location
-- explode l@(Pair (RegularNumber nl) (RegularNumber nr), _, _) =
--   let s1 = left l
--       s2 = case previous s1 of
--         Just (RegularNumber n, c, l) -> next (RegularNumber (n + nl), c, l)
--         _ -> Just s1
--       s3 = case s2 >>= next >>= next of
--         Just (RegularNumber n, c, l) -> previous (RegularNumber (n + nr), c, l)
--         _ -> s2
--    in case up <$> s3 of
--         Just (Pair _ _, c, l) -> Just (RegularNumber 0, c, l)
--         _ -> Nothing
-- explode l = Nothing

prev l@(_, Top, _) = Nothing
prev l@(_, Left' _ _, _) = Just . up $ l
prev l@(_, Right' _ _, _) =
  let goUp l'@(_, Right' _ _, _) = Just . left . up $ l'
      goUp l'@(_, Left' _ _, _) = goUp . up $ l'
      goUp l'@(_, Top, _) = Nothing
      goRight l' = if l' == right l' then l' else goRight . right $ l'
   in fmap goRight . goUp $ l

next l@(_, Top, _) = Just . left $ l
next l@(_, Left' _ _, _) =
  if left l == l
    then Just . right . up $ l
    else Just . left $ l
next l@(_, Right' _ _, _) =
  let goUp l'@(_, Left' _ _, _) = Just . right . up $ l'
      goUp l'@(_, Right' _ _, _) = goUp . up $ l'
      goUp l'@(_, Top, _) = Nothing
   in goUp l

findPrev :: (Location -> Bool) -> Location -> Maybe Location
findPrev p l = prev l >>= \l' -> if p l' then Just l' else findPrev p l'

findNext :: (Location -> Bool) -> Location -> Maybe Location
findNext p l = next l >>= \l' -> if p l' then Just l' else findNext p l'

-- [[[[[9,8],1],2],3],4]
sample1 =
  p (p (p (p (p (n 9) (n 8)) (n 1)) (n 2)) (n 3)) (n 4)

-- [7,[6,[5,[4,[3,2]]]]]
sample2 =
  p (n 7) (p (n 6) (p (n 5) (p (n 4) (p (n 3) (n 2)))))

sample3 =
  p (p (n 1) (n 2)) (p (n 3) (n 4))

sample4 =
  -- [[1,2], 3]
  p (p (n 1) (p (n 21) (n 22))) (n 3)

pred' (Pair (RegularNumber _) (RegularNumber _), _, _) = True
pred' _ = False 

main :: IO ()
main = do
  print . findNext pred' . top $ sample4
  print ""
