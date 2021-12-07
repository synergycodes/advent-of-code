import           Data.List.Split

solve values =
    let moveCost units = sum [1..units]
        positionCost position = sum $ map (moveCost . abs . (-) position) values
    in minimum $ map positionCost [0..(maximum values)]

main = print . solve . map read . splitOn "," =<< readFile "data.txt"
