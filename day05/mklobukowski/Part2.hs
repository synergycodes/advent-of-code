#!/usr/bin/env stack
{- stack runghc --resolver lts-18.18
    --package trifecta
-}

import Text.Trifecta
import Text.Trifecta.Result
import Data.List

type Point = (Int, Int)
type Line = (Point, Point)

-- | https://wiki.haskell.org/Bresenham%27s_line_drawing_algorithm
bresenham :: Line -> [Point]
bresenham (pa@(xa,ya), pb@(xb,yb)) = map maySwitch . unfoldr go $ (x1,y1,0)
    where
        steep = abs (yb - ya) > abs (xb - xa)
        maySwitch = if steep then (\(x,y) -> (y,x)) else id
        [(x1,y1),(x2,y2)] = sort [maySwitch pa, maySwitch pb]
        deltax = x2 - x1
        deltay = abs (y2 - y1)
        ystep = if y1 < y2 then 1 else -1
        go (xTemp, yTemp, error)
            | xTemp > x2 = Nothing
            | otherwise  = Just ((xTemp, yTemp), (xTemp + 1, newY, newError))
            where
            tempError = error + deltay
            (newY, newError) = if (2*tempError) >= deltax
                                then (yTemp+ystep,tempError-deltax)
                                else (yTemp,tempError)

int :: Parser Int
int = fromIntegral <$> integer

point :: Parser Point
point = do    
    x <- int
    char ','
    y <- int
    return (x, y)

line' :: Parser Line
line' = do
    p1 <- point
    whiteSpace >> string "->" >> whiteSpace
    p2 <- point
    return (p1, p2)

readLines :: String -> [Line]
readLines = foldResult (const []) id . parseString (many line') mempty
    
count' :: Ord a => [a] -> [(Int, a)]
count' = map (\ g -> (length g, head g)) . group . sort

solve :: [Line] -> Int
solve ls =
    let points = concatMap bresenham ls
    in length $ filter ((<) 1 . fst) $ count' points

main = print . solve . readLines =<< readFile "data.txt"
