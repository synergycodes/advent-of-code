import           Data.List
import           Data.List.Split
import           Data.Maybe

count' :: Ord a => [a] -> [(Int, a)]
count' = map (\ g -> (length g, head g)) . group . sort

readInput = map read . splitOn ","

initCounter c = fromMaybe (0, c) . find ((==) c . snd)

initCounters fishes =
    map (fst . (`initCounter` fishes)) [0 .. 8]

tick [c0, c1, c2, c3, c4, c5, c6, c7, c8] =
    [c1, c2, c3, c4, c5, c6, c0 + c7, c8, c0]

simulate days = foldl (.) id $ replicate days tick

solve = sum . simulate 256 . initCounters . count'

main = print . solve . readInput =<< readFile "data.txt"
