import Data.List

mostCommonBit :: [Int]  -> Int
mostCommonBit column | sum column > half = 1
                     | otherwise = 0   
                       where half = length column `div` 2

type Report = [[Int]]
type Rate = [Int]

gammaRate :: Report -> Rate
gammaRate report =
    let columns = transpose report
    in  map mostCommonBit columns

not' :: Int -> Int
not' 0 = 1
not' 1 = 0

epsilonRate :: Report -> Rate
epsilonRate report = map not' $ gammaRate report

readInt :: Char -> Int
readInt c = read [c]

readReport :: String -> Report
readReport = (map . map) readInt . lines

toDec :: [Int] -> Int
toDec bits = 
    let powers = reverse [0..(length bits - 1)]
    in sum $ zipWith (\ b p -> b * 2 ^ p ) bits powers

powerConsumption :: Report -> Int
powerConsumption report = 
    let g = toDec $ gammaRate report
        e = toDec $ epsilonRate report
    in e * g

main = print =<<  powerConsumption . readReport <$> readFile "data.txt"
