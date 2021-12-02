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

type Horizontal = Int
type Depth = Int
type Aim = Int
type Submarine = (Horizontal, Depth, Aim)

executeCommand :: Command -> Submarine ->  Submarine
executeCommand (Forward h') (h, d, a) = (h + h', d + a * h', a) 
executeCommand (Down a')    (h, d, a) = (h, d, a + a') 
executeCommand (Up a')      (h, d, a) = (h,  d, a - a') 

solve :: String -> Int
solve input =
    let commands =  map readCommand $ lines input
        (h, d, a) = foldl (flip executeCommand) (0, 0, 0) commands 
    in h * d

main = print =<< solve <$> readFile "data.txt"

