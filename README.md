# Chess game developed with React JS

This project was inspired in [Chess.com](https://chess.com) and it even uses some of its pieces assets.

![chess-react](https://user-images.githubusercontent.com/66584326/187077350-64dd6da4-64cd-485e-a6cf-9bd28c6baad5.jpeg)


## A lot of logical programming was used to implement:


### Movements

- Describe all the 5 types of pawn moves (move 2x forward, move 1x forward when it passes the middle board, eat on diagonal, promotion and en passant)
- Describe rook moves
- Describe knight moves
- Describe queen moves
- Describe bishop moves
- Describe king moves (it has to be aware of all the possible threats on board)
- Describe casteling move (king and rook shuffle its positions)

### Interactions
- Describe the interaction of 'eating' a piece
- Recognize Checks on king and inviabilize all moves that doesn't save king from check
- Inviabilize moves that will expose its king to a threat
- Recognize a Checkmate
- Recognize a Stalemate (draw)

### Other
- Draw board
- Place pieces on its squares
- Show moves history on a painel
- Allow users to move backwards or forward in history moves
- Manage pieces turns
- Highlight piece it is being clicked
- Show all the squares availables to move when a piece is highlighted

## To run this project:

### `git clone https://github.com/brunosaunders/React-chess.git`

### `npm start`

