module Main where

import Text.Trifecta

hexToBin :: Char -> String
hexToBin '0' = "0000"
hexToBin '1' = "0001"
hexToBin '2' = "0010"
hexToBin '3' = "0011"
hexToBin '4' = "0100"
hexToBin '5' = "0101"
hexToBin '6' = "0110"
hexToBin '7' = "0111"
hexToBin '8' = "1000"
hexToBin '9' = "1001"
hexToBin 'A' = "1010"
hexToBin 'B' = "1011"
hexToBin 'C' = "1100"
hexToBin 'D' = "1101"
hexToBin 'E' = "1110"
hexToBin 'F' = "1111"
hexToBin _ = error "Invalid character"

readInput :: String -> String
readInput = concatMap hexToBin

type Version = Int

type TypeID = Int

data Packet
  = Literal Version Int
  | Operator Version Op [Packet]
  deriving (Show)

data Op = Sum
        | Product
        | Minimum
        | Maximum
        | GreaterThan
        | LessThan
        | EqualTo
        deriving (Show)

op :: TypeID -> Op
op 0 = Sum
op 1 = Product
op 2 = Minimum
op 3 = Maximum
op 5 = GreaterThan
op 6 = LessThan
op 7 = EqualTo
op _ = error "Invalid type ID"

bitChar :: Parser Char
bitChar = oneOf "01"

bit :: Parser Int
bit = read . (: []) <$> bitChar

decimal' :: [Int] -> Int
decimal' bits =
  let powers = reverse [0 .. (length bits - 1)]
   in sum $ zipWith (\b p -> b * 2 ^ p) bits powers

number :: Int -> Parser Int
number bits = decimal' <$> count bits bit

group :: Parser [Int]
group = char '1' >> count 4 bit

lastGroup :: Parser [Int]
lastGroup = char '0' >> count 4 bit

value :: Parser Int
value = do
  gs <- many group
  lg <- lastGroup
  return . decimal' . concat $ gs ++ [lg]

version :: Parser Int
version = number 3

type' :: Parser Int
type' = number 3

literal :: Version -> Parser Packet
literal ver = do
  Literal ver <$> value

operator :: Version -> TypeID -> Parser Packet
operator ver typeID = do
  lengthType <- bit
  case lengthType of
    0 -> do
      subpacketBits <- number 15
      packets <- parseString (many (try packet)) mempty <$> count subpacketBits bitChar
      return $ Operator ver (op typeID) $ foldResult (const []) id packets
    1 -> do
      subpacketsCount <- number 11
      packets <- count subpacketsCount packet
      return $ Operator ver (op typeID) packets
    _ ->
      fail "Invalid length type"

packet :: Parser Packet
packet = do
  ver <- version
  t <- type'
  case t of
    4 -> literal ver
    typeID -> operator ver typeID

sumVersions (Literal v _) = v
sumVersions (Operator v _ packets) = v + sum (map sumVersions packets)

eval (Literal _ value) = value
eval (Operator _ Sum packets) = sum (map eval packets)
eval (Operator _ Product packets) = product (map eval packets)
eval (Operator _ Minimum packets) = minimum (map eval packets)
eval (Operator _ Maximum packets) = maximum (map eval packets)
eval (Operator _ GreaterThan packets) = 
    let [v1, v2] = map eval packets
    in if v1 > v2 then 1 else 0 
eval (Operator _ LessThan packets) = 
    let [v1, v2] = map eval packets
    in if v1 < v2 then 1 else 0 
eval (Operator _ EqualTo packets) = 
    let [v1, v2] = map eval packets
    in if v1 == v2 then 1 else 0 

part1 :: IO ()
part1 = print . fmap sumVersions . parseString packet mempty . readInput =<< readFile "data.txt"

part2 :: IO ()
part2 = print . fmap eval . parseString packet mempty . readInput =<< readFile "data.txt"

main :: IO ()
main = part2
