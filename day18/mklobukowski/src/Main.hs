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

explode l0@(Pair (RegularNumber rv) (RegularNumber lv), _) =
  let l1 = fmap (addLeftValue l0) . findPrev isRegularNumber' $ l0
      l2 = (findNext isPairNestedInFourPairs =<< l1) <|> Just l0
      l3 = fmap (addRightValue l0) . findNext isRegularNumber' =<< (next . right) =<< l2
      l4 = (findPrev isPairNestedInFourPairs =<< l3) <|> l2
   in replaceWithZero . fromMaybe l0 $ l4
explode l = l

isRegularGreaterThan9 (RegularNumber v, _) = v >= 10
isRegularGreaterThan9 _ = False

split (RegularNumber v, c) =
  let lv = fromIntegral $ floor (fromIntegral v / 2)
      rv = fromIntegral $ ceiling (fromIntegral v / 2)
   in (p (n lv) (n rv), c)
split l = l

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

sample5 =
  -- [[6,[5,[4,[3,2]]]],1]
  p (p (n 6) (p (n 5) (p (n 4) (p (n 3) (n 2))))) (n 1)

sample6 =
  -- [[[[0,7],4],[15,[0,13]]],[1,1]]
  p (p (p (p (n 0) (n 7)) (n 4)) (p (n 15) (p (n 0) (n 13)))) (p (n 1) (n 1))

pred' (Pair (RegularNumber _) (RegularNumber _), _, _) = True
pred' _ = False

main :: IO ()
main = do
  -- let l0 = findNext isPairNestedInFourPairs . top $ sample5
  -- print $ upMost . explode <$> l0
  -- print ""
  -- print . split . top $ n 10
  -- print ""
  print . fmap (upMost . split) . findNext isRegularGreaterThan9 . top $ sample6
  return ()

-- print . fmap (upMost . replaceWithZero) . (findNext isPairNestedInFourPairs <=< addToPreviousRegularNumber 4 <=< findNext isPairNestedInFourPairs) . top $ sample2
-- print ""

-- print . (findNext isRegularNumber' <=< findNext isPairNestedInFourPairs) . top $ sample1
-- print ""
