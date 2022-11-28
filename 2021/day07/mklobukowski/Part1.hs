import           Data.List.Split

solve values =
    minimum $ map (\ v -> sum $ map (abs . (-) v) values) values

main = print . solve . map read . splitOn "," =<< readFile "data.txt"
