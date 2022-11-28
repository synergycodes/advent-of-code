{- stack runghc --resolver lts-18.18
    --package trifecta
-}

import           Data.Bifunctor
import           Data.List
import           Data.Maybe
import           Text.Trifecta
import           Text.Trifecta.Result

type Rule = (String, Char)
type Template = String
type Input = (Template, [Rule])

rule :: Parser Rule
rule = do
    a <- letter
    b <- letter
    whiteSpace >> string "->" >> whiteSpace
    c <- letter
    return ([a, b], c)

input :: Parser Input
input = do
    template <- many letter
    whiteSpace
    rules <- many (whiteSpace >> rule)
    return  (template, rules)

count' :: Ord a => [a] -> [(a, Int)]
count' = map (\ g -> (head g, length g)) . group . sort

pairs []      = []
pairs [a]     = []
pairs (a:b:r) = [a, b] : pairs (b:r)

applyRule rules pair =
    pairs $ fromMaybe "" $ flip intersperse pair <$> lookup pair rules

iteration rules =
    sum' . sort . concatMap (\ (p, c) -> map (\ p' -> (p', c)) p) . map (first (applyRule rules))

sum' :: Eq a => [(a, Int)] -> [(a, Int)]
sum' [] = []
sum' [a] = [a]
sum' (a:b:rest) = if fst a == fst b
                    then sum' $ (fst a, snd a + snd b) : rest
                    else a : sum' (b : rest)

solve n (Success (template, rules)) =
     let pairCounters = foldl (.) id (replicate n (iteration rules)) . count' . pairs $ template
         characterCounters = map (\ (s, c) -> (c, s)) . sum' . sort . map (first (drop 1)) $ pairCounters
         mostCommon = fst $ maximum characterCounters
         leastCommon = fst $ minimum characterCounters
     in mostCommon - leastCommon


main = print . solve 40 . parseString input mempty  =<< readFile "data.txt"
