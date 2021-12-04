#!/usr/bin/env stack
{- stack runghc --resolver lts-6.0
    --package split
-}

import           Data.List
import           Data.List.Split

type Input = [String]
type Numbers = [Int]
type Board = [[BoardValue]]
data BoardValue = Unmarked Int | Marked Int deriving (Show)

instance Eq BoardValue where
    (==) (Unmarked a) (Unmarked b) = a == b
    (==) (Unmarked a) (Marked b)   = a == b
    (==) (Marked a) (Unmarked b)   = a == b
    (==) (Marked a) (Marked b)     = a == b

readNumbers :: Input -> (Numbers, [String])
readNumbers (line:lines) = (map read $ splitOn "," line, lines)

readBoard :: Input -> (Board, [String])
readBoard lines =
    let boardLines = take 5 $ drop 1 lines
        board = map (map (Unmarked . read) . words) boardLines
    in (board, drop 6 lines)

readInput :: Input -> (Numbers, [Board])
readInput input =
    let (numbers, lines') = readNumbers input
        boards [] = []
        boards ls =
            let (b, ls') = readBoard ls
            in b : boards ls'
    in (numbers, boards lines')

mark :: Int -> BoardValue -> BoardValue
mark number (Unmarked n) = if n == number then Marked n else Unmarked n
mark _ boardValue        = boardValue

markBoard :: Int -> Board -> Board
markBoard number = map (map (mark number))

marked :: BoardValue -> Bool
marked (Marked _) = True
marked _          = False

bingo :: Board -> Bool
bingo board =
    any (all marked) (board ++ transpose board)

play :: Numbers -> [Board] -> [(Int, [Board])] -> [(Int, [Board])]
play []               _      winners = winners
play (number:numbers) boards winners =
    let boards' = map (markBoard number) boards
        previousWinners = concatMap snd winners
        currentRoundWinners = filter bingo boards'
        winners' = (number, currentRoundWinners \\ previousWinners) : winners
    in  play numbers boards' winners'

unmarkedValue :: BoardValue -> Int
unmarkedValue (Unmarked v) = v
unmarkedValue _            = 0

sumUnmarkedValues :: Board -> Int
sumUnmarkedValues = sum . map (sum . map unmarkedValue)

solve :: String -> Int
solve input =
    let (numbers, boards) = readInput $ lines input
        winners = play numbers boards []
        (number, winner : _) = head $ dropWhile (null . snd) winners
    in number * sumUnmarkedValues winner


main = print . solve  =<< readFile "data.txt"
