import Data.List

type Report = [[Int]]
type Rating = Int

count :: Ord a => [a] -> [(Int, a)]
count = map (\ g -> (length g, head g)) . group . sort

mostCommonValue :: Ord a => [a] -> a
mostCommonValue = snd . maximum . count

leastCommonValue :: Ord a => [a] -> a
leastCommonValue = snd . minimum . count

getRating :: ([Int] -> Int) -> Int -> Report -> Rating
getRating _          _         (r:[]) = toDec r 
getRating getCriteria position report =
    let columns = transpose report
        criteria = getCriteria (columns !! position)
        report' = filter (\ v -> v !! position == criteria) report
    in getRating getCriteria (position + 1) report'

oxygenGeneratorRating :: Report -> Rating
oxygenGeneratorRating = getRating (mostCommonValue) 0

co2ScrubberRating :: Report -> Rating
co2ScrubberRating = getRating (leastCommonValue) 0

readInt :: Char -> Int
readInt c = read [c]

readReport :: String -> Report
readReport = (map . map) readInt . lines

toDec :: [Int] -> Int
toDec bits = 
    let powers = reverse [0..(length bits - 1)]
    in sum $ zipWith (\ b p -> b * 2 ^ p ) bits powers

lifeSupportRating :: Report -> Rating
lifeSupportRating report = oxygenGeneratorRating report * co2ScrubberRating report

main = print =<< lifeSupportRating . readReport <$> readFile "data.txt"

