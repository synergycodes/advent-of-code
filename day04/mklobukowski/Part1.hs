#!/usr/bin/env stack
{- stack runghc --resolver lts-6.0
    --package split
-}

import           Data.List
import           Data.List.Split

type Input = [String]
type Numbers = [Int]
type Board = [[BoardValue]]
data BoardValue = Unmarked Int | Marked Int deriving Show

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

play :: (Numbers, [Board]) -> (Int, Board)
play (number:numbers, boards) =
    let boards' = map (markBoard number) boards
        winner = find bingo boards'
    in case winner of
        Nothing    -> play (numbers, boards')
        Just board -> (number, board)

unmarkedValue :: BoardValue -> Int
unmarkedValue (Unmarked v) = v
unmarkedValue _            = 0

sumUnmarkedValues :: Board -> Int
sumUnmarkedValues = sum . map (sum . map unmarkedValue)

solve :: String -> Int
solve input =
    let (numberCalled, winnerBoard) = play $ readInput $ lines input
    in numberCalled * sumUnmarkedValues winnerBoard


main = print . solve =<< readFile "data.txt"
