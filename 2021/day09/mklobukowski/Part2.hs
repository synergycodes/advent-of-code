{-# LANGUAGE TupleSections #-}

{- stack runghc --resolver lts-18.18 --package containers --package mtl -}

import qualified Control.Monad.Trans.State as State
import           Data.List                 (sort)
import           Data.Maybe                (fromMaybe, mapMaybe)
import qualified Data.Set                  as Set

atIndex index list | index < 0 = Nothing
                   | index >= length list = Nothing
                   | otherwise = Just $ list !! index

atPoint (x, y) list = atIndex x =<< atIndex y list

coords points =  [ (x, y)
                 | y <- [0 .. length points]
                 , x <- [0 .. length (head points)]
                 ]

neighbours (x, y) = [(x, y - 1), (x - 1, y), (x + 1, y), (x, y + 1)]

isLowestPoint points p =
    let
        point = fromMaybe 0 $ atPoint p points
    in all (point <) $ mapMaybe (`atPoint` points) (neighbours p)

lowestPoints points = filter (isLowestPoint points) $ coords points

basin points p = do
    visited <- State.get
    if p `elem` visited
        then return []
        else do
            State.put $ Set.insert p visited
            let h = fromMaybe 9 $ atPoint p points
            let allNeighbours = mapMaybe (\p' -> (p',) <$> atPoint p' points) $ neighbours p
            let validNeighbours = map fst . filter (and' (== h + 1) (< 9) . snd) $ allNeighbours
            basin' <- concat <$> mapM (basin points) validNeighbours
            return (p:basin')

and' f1 f2 a = f1 a && f2 a

solve points =
    let basins = map (\ p -> State.evalState ( basin points p ) Set.empty) $ lowestPoints points
    in product . take 3 . reverse . sort . map length $ basins

main = print . solve . map (map (read . (:[]))) . lines =<< readFile "data.txt"
