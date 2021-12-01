main = do
    print =<< solve <$> readData
    
readData :: IO [Measurment]
readData = map read . lines <$> readFile "data.txt"

solve :: [Measurment] -> Int
solve = length . filter (\ mc -> mc == Increased) . getChanges . getWindows

type Window = Int
type Measurment = Int
data Change = Increased | Decreased | NoChange deriving (Show, Eq)

makeWindow :: Measurment -> Measurment -> Measurment -> Window
makeWindow a b c = a + b + c

getWindows :: [Measurment] -> [Window]
getWindows [] = []
getWindows (a:[]) = []
getWindows (a:b:[]) = []
getWindows (a:b:c:rest) = (makeWindow a b c) : (getWindows $ b : c : rest)


makeChange :: Window -> Window -> Change
makeChange a b | a > b = Decreased
               | a < b = Increased
               | a == b = NoChange

getChanges :: [Window] -> [Change]
getChanges [] = []
getChanges (a:[]) = []
getChanges (a:b:ms) = (makeChange a b) : (getChanges (b : ms))

