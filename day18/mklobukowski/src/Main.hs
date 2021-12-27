module Main where

import Control.Applicative (Alternative ((<|>)))
import Control.Monad ((<=<))
import Data.Maybe (fromMaybe)

data SnailfishNumber
  = RegularNumber Int
  | Pair SnailfishNumber SnailfishNumber
  deriving (Eq)

instance Show SnailfishNumber where
  show (RegularNumber v) = show v
  show (Pair vl vr) = "[" ++ show vl ++ "," ++ show vr ++ "]"

isRegularNumber (RegularNumber _) = True
isRegularNumber _ = False

type Level = Int

data Context
  = Top
  | Left' Context SnailfishNumber
  | Right' Context SnailfishNumber
  deriving (Show, Eq)

type Location = (SnailfishNumber, (Context, Level))

top :: SnailfishNumber -> Location
top n = (n, (Top, 1))

left :: Location -> Location
left rn@(RegularNumber n, _) = rn
left (Pair n1 n2, (c, l)) = (n1, (Left' c n2, l + 1))

right :: Location -> Location
right rn@(RegularNumber n, _) = rn
right (Pair n1 n2, (c, l)) = (n2, (Right' c n1, l + 1))

up :: Location -> Location
up l@(_, (Top, _)) = l
up (n, (Left' c n', l)) = (Pair n n', (c, l - 1))
up (n, (Right' c n', l)) = (Pair n' n, (c, l - 1))

upMost :: Location -> SnailfishNumber
upMost (n, (Top, _)) = n
upMost l = upMost . up $ l

p = Pair

n = RegularNumber

prev l@(_, (Top, _)) = Nothing
prev l@(_, (Left' _ _, _)) = Just . up $ l
prev l@(_, (Right' _ _, _)) =
  let goUp l'@(_, (Right' _ _, _)) = Just . left . up $ l'
      goUp l'@(_, (Left' _ _, _)) = goUp . up $ l'
      goUp l'@(_, (Top, _)) = Nothing
      goRight l' = if l' == right l' then l' else goRight . right $ l'
   in fmap goRight . goUp $ l

next l@(_, (Top, _)) = Just . left $ l
next l@(_, (Left' _ _, _)) =
  if left l == l
    then Just . right . up $ l
    else Just . left $ l
next l@(_, (Right' _ _, _)) =
  let goUp l'@(_, (Left' _ _, _)) = Just . right . up $ l'
      goUp l'@(_, (Right' _ _, _)) = goUp . up $ l'
      goUp l'@(_, (Top, _)) = Nothing
   in if right l == l then goUp l else Just . left $ l

findPrev :: (Location -> Bool) -> Location -> Maybe Location
findPrev p l = if p l then Just l else prev l >>= findPrev p

findNext :: (Location -> Bool) -> Location -> Maybe Location
findNext p l = if p l then Just l else next l >>= findNext p

isPairNestedInFourPairs (Pair (RegularNumber _) (RegularNumber _), (_, level)) = level > 4
isPairNestedInFourPairs _ = False

isRegularNumber' = isRegularNumber . fst

replaceWithZero (_, c) = (RegularNumber 0, c)

addLeftValue (Pair (RegularNumber v) _, _) (RegularNumber v', c) =
  (RegularNumber (v + v'), c)
addLeftValue _ n = n

addRightValue (Pair _ (RegularNumber v), _) (RegularNumber v', c) =
  (RegularNumber (v + v'), c)
addRightValue _ n = n

explode l0@(lp@(Pair (RegularNumber rv) (RegularNumber lv)), _) =
  let l1 = fmap (addLeftValue l0) . findPrev isRegularNumber' $ l0
      l2 = (findNext ((==) lp . fst) =<< l1) <|> Just l0
      l3 = fmap (addRightValue l0) . findNext isRegularNumber' =<< (next . right) =<< l2
      l4 = (findPrev ((==) lp . fst) =<< l3) <|> l2
   in maybe l0 replaceWithZero l4
explode l = l

isRegularGreaterThan9 (RegularNumber v, _) = v >= 10
isRegularGreaterThan9 _ = False

split (RegularNumber v, c) =
  let lv = fromIntegral $ floor (fromIntegral v / 2)
      rv = fromIntegral $ ceiling (fromIntegral v / 2)
   in (p (n lv) (n rv), c)
split l = l

reduce l =
  case findNext isPairNestedInFourPairs $ top l of
    Just p -> reduce . upMost . explode $ p
    Nothing -> case findNext isRegularGreaterThan9 $ top l of
      Just n -> reduce . upMost . split $ n
      Nothing -> l

add a b = reduce $ p a b

sample7 =
  -- [[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]
  p (p (p (p (p (n 4) (n 3)) (n 4)) (n 4)) (p (n 7) (p (p (n 8) (n 4)) (n 9)))) (p (n 1) (n 1))

sample8 =
  p (p (p (p (p (n 1) (n 1)) (p (n 2) (n 2))) (p (n 3) (n 3))) (p (n 4) (n 4))) (p (n 5) (n 5))

main :: IO ()
main = do
  -- let s1 = add (p (n 1) (n 1)) (p (n 2) (n 2))
  -- print s1
  -- print ""
  -- let s2 = add s1 (p (n 3) (n 3))
  -- print s2
  -- print ""
  -- let s3 = add s2 (p (n 4) (n 4))
  -- print s3
  -- print ""
  -- let s4 = add s3 (p (n 5) (n 5))
  -- print s4
  -- print ""
  -- print sample7
  -- print ""
  -- print . reduce  $ sample7
  -- print ""
  -- print sample8
  -- print ""
  -- print . reduce $ sample8
  let s1 = reduce sample8
  print s1
  print ""
  -- let s2 = findNext isPairNestedInFourPairs $ top sample8
  -- print s2
  -- print ""
  -- let s3 = upMost . explode <$> s2
  -- print s3
  -- print ""
  return ()

-- [[[[[1,1],[2,2]],[3,3]],[4,4]],[5,5]]
-- [[[[0,[3,2]],[3,3]],[4,4]],[5,5]]
-- [[[[3,0],[5,3]],[4,4]],[5,5]]