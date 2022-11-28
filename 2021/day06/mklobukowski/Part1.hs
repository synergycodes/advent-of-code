import           Data.Bifunctor
import           Data.List.Split
import           Data.Maybe

type Fish = Int

readFishes :: String -> [Fish]
readFishes = map read . splitOn ","

tick :: Fish -> (Fish, Maybe Fish)
tick 0     = (6, Just 8)
tick timer = (timer - 1, Nothing)

tick' = uncurry (++) . second catMaybes . unzip . map tick

simulate days = foldl (.) id $ replicate days tick'

main = print . length . simulate 80 . readFishes =<< readFile "data.txt"
