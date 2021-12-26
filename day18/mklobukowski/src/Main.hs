module Main where

import Control.Monad ((<=<))
import Control.Applicative ( Alternative((<|>)) ) 

data SnailfishNumber
  = RegularNumber Int
  | Pair SnailfishNumber SnailfishNumber
  deriving (Show, Eq)

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

explode l1@(Pair (RegularNumber rv) (RegularNumber lv), _) =
  let l2 = case findPrev isRegularNumber' l1 of
        Just (RegularNumber v, c) ->
          fmap up . findNext isRegularNumber' . up $ (RegularNumber (v + lv), c)
        _ -> Just l1
      l3 = case findNext isRegularNumber' =<< l2 of
        Just (RegularNumber v, c) ->
          fmap up . findPrev (isRegularNumber . fst) . up $ (RegularNumber (v + rv), c)
        _ -> l2
   in case l3 of
        Just (_, c) -> (RegularNumber 0, c)
        _ -> l1
explode l = l

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

pred' (Pair (RegularNumber _) (RegularNumber _), _, _) = True
pred' _ = False

main :: IO ()
main = do
  let l0 = findNext isPairNestedInFourPairs . top $ sample1
  print l0
  print ""
  let l1 = findPrev isRegularNumber' =<< l0
  print l1
  print ""
  let l2 = (findNext isPairNestedInFourPairs =<< l1) <|> l0
  print l2
  print ""
  let l3 = findNext isRegularNumber' =<< (next . right) =<< l2
  print l3
  print ""
  let l4 = (findPrev isPairNestedInFourPairs =<< l3) <|> l2
  print l4
  print ""
  return ()

-- print . fmap (upMost . replaceWithZero) . (findNext isPairNestedInFourPairs <=< addToPreviousRegularNumber 4 <=< findNext isPairNestedInFourPairs) . top $ sample2
-- print ""

-- print . (findNext isRegularNumber' <=< findNext isPairNestedInFourPairs) . top $ sample1
-- print ""
