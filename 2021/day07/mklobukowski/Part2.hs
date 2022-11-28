import           Data.List.Split

solve values =
    let moveCost units = (units * (units + 1)) `div` 2
        positionCost position = sum $ map (moveCost . abs . (-) position) values
    in minimum $ map positionCost [0..(maximum values)]

main = print . solve . map read . splitOn "," =<< readFile "data.txt"
