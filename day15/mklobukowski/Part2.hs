{- stack runghc
    --resolver lts-18.18
    --package search-algorithms
-}

import Algorithm.Search (dijkstra)
import qualified Data.Array as A
import Data.List (zipWith5)

readInput :: String -> [[Int]]
readInput = map (map (read . (: []))) . lines

bounds values =
  let w = length . head $ values
      h = length values
   in (w, h)

type Matrix a = A.Array Int (A.Array Int a)

toMatrix :: [[a]] -> Matrix a
toMatrix values =
  let (w, h) = bounds values
      toArray' values' = A.array (1, w) (zip [1 .. w] values')
   in A.array (1, h) (zip [1 .. h] (map toArray' values))

bounds' values =
  let (_, h) = A.bounds values
      (_, w) = A.bounds . (A.! 1) $ values
   in (w, h)

neighbours :: (Int, Int) -> Matrix a -> [(Int, Int)]
neighbours (x, y) values =
  let (_, h) = A.bounds values
      (_, w) = A.bounds . (A.! 1) $ values
      allNeighbours = [(x - 1, y), (x, y - 1), (x + 1, y), (x, y + 1)]
      isValidNeighbour (x, y) = x >= 1 && x <= w && y >= 1 && y <= h
   in filter isValidNeighbour allNeighbours

nextTile =
  let nextValue 9 = 1
      nextValue v = v + 1
   in map $ map nextValue

expand tile =
  scanl (\t n -> n t) tile $ replicate 4 nextTile

join [] = []
join [row] = row
join (r1 : r2 : rows) =
  let joined = zipWith (++) r1 r2
   in join (joined : rows)

fullMap tile =
  concatMap (join . expand) $ expand tile

solve values =
  dijkstra
    (`neighbours` values)
    (\_ (x, y) -> (values A.! y) A.! x)
    (\point -> point == bounds' values)
    (1, 1)

main = print . solve . toMatrix . fullMap . readInput =<< readFile "data.txt"