main = do
    print =<< solve <$> readData
    
readData :: IO [Int]
readData = map read . lines <$> readFile "data.txt"

solve :: [Int] -> Int
solve = length . filter (\ mc -> mc == Increased) . getChanges

getChanges :: [Int] -> [MeasurmentChange]
getChanges [] = []
getChanges (a:[]) = []
getChanges (a:b:ms) = (measurmentChange a b) : (getChanges (b : ms))

data MeasurmentChange = Increased | Decreased | NoChange deriving (Show, Eq)

measurmentChange :: Int -> Int -> MeasurmentChange
measurmentChange a b | a > b = Decreased
                     | a < b = Increased
                     | a == b = NoChange