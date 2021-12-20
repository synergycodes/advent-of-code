module Main where

import Data.Ix (Ix (inRange))
import Data.List (nub)

hMax (_, (yMin, _)) = sum [1 .. (abs yMin - 1)]

part1 = hMax

area = ((29, 73), (-248, -194))

beforeArea ((xMin, _), (_, yMax)) (x, y) = x < xMin || y > yMax

inArea ((xMin, xMax), (yMin, yMax)) (x, y) = x >= xMin && x <= xMax && y >= yMin && y <= yMax

velocities min max init =
  nub $
    map last $
      filter (not . null) $
        filter ((>= min) . sum) $
          filter ((<= max) . sum) $
            concatMap (scanl (flip (:)) []) $ scanl (flip (:)) [] [init .. max]

step (0, y) = (0, y - 1)
step (x, y) = (x - 1, y - 1)

landsInArea area =
  not . null . takeWhile (inArea area) . dropWhile (beforeArea area) . scanl (\(x, y) (x', y') -> (x + x', y + y')) (0, 0) . iterate step

part2 a@((xMin, xMax), (yMin, yMax)) =
  let xVelocities = velocities xMin xMax 0
      yVelocities = velocities yMin (abs yMin - 1) yMin
      velocities' = (,) <$> xVelocities <*> yVelocities
   in length $ filter (landsInArea a) velocities'

main :: IO ()
main = do
  print $ part1 area
  print $ part2 area
