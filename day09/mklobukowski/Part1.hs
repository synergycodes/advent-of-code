
{- stack runghc --resolver lts-18.18 -}

import           Data.Maybe

singleton :: a -> [a]
singleton a = [a]

readInt :: String -> Int
readInt = read

data PointType = Point Int | LowestPoint Int deriving Show

isLowestPoint (LowestPoint _) = True
isLowestPoint _               = False

riskLevel (LowestPoint p) = p + 1
riskLevel _ = 0

at points (x, y)    | x < 0 = Nothing
                    | y < 0 = Nothing
                    | x > length (head points) - 1 = Nothing
                    | y > length points - 1 = Nothing
                    | otherwise = Just ((points !! y) !! x)

pointType points (x, y) =
    let neighbourCoords =   [            (x, y - 1) 
                            , (x - 1, y),          (x + 1, y)
                            ,            (x, y + 1) 
                            ]
        point = fromMaybe 0 $ at points (x, y)
        isLowest = all (point <) $ mapMaybe (at points) neighbourCoords
    in if isLowest then LowestPoint point else Point point

solve points =
    let pointTypes = [ pointType points (x, y)
                     | y <- [0 .. length points - 1]
                     , x <- [0 .. length (head points) - 1]
                     ]
    in sum $ map riskLevel $ filter isLowestPoint pointTypes


main = print . solve .  map (map (readInt . singleton)) . lines =<< readFile "data.txt"
