data Command 
    = Forward Int
    | Down Int
    | Up Int
    deriving (Show)

readCommand :: String -> Command
readCommand input =
    let [rawCommand, rawValue] = words input
        value = read rawValue
    in case rawCommand of
        "forward" -> Forward value
        "down" -> Down value
        "up" -> Up value

type Position = (Int, Int)

executeCommand :: Command -> Position -> Position
executeCommand (Forward x') (x, y) = (x + x', y) 
executeCommand (Down y')    (x, y) = (x, y + y') 
executeCommand (Up y')      (x, y) = (x,  y - y') 

solve :: String -> Int
solve input =
    let commands =  map readCommand $ lines input
        (x, y) = foldr executeCommand (0, 0) commands 
    in x * y

main = print =<< solve <$> readFile "data.txt"

