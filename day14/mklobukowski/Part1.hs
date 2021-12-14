
{- stack runghc --resolver lts-18.18
    --package trifecta
    --package containers
-}

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

count' :: Ord a => [a] -> [(Int, a)]
count' = map (\ g -> (length g, head g)) . group . sort

pairs []      = []
pairs [a] = [(a, '!')]
pairs (a:b:r) = (a, b) : pairs (b:r)

iteration rules = concatMap (\ (a, b) -> if b == '!' then [a] else [a, fromMaybe '!' $ lookup [a, b] rules]) . pairs

solve (Success (template, rules)) =  
    let counters = count' $ foldl (.) id (replicate 10 (iteration rules)) template
        mostCommon = fst $ maximum counters
        leastCommon = fst $ minimum counters
    in mostCommon - leastCommon

main = print . solve . parseString input mempty  =<< readFile "data.txt"
