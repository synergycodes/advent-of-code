import           Data.List.Split


digit 7 = 8
digit 4 = 4
digit 3 = 7
digit 2 = 1
digit _ = 0

main = print . length . filter (> 0) . concatMap (map (digit . length) . words . (!! 1) .  splitOn "|") . lines =<< readFile "data.txt"
