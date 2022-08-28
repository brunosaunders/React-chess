import { bishopMoves } from './MoveSquares'
const boardPieces = {
    sq11: 'br', sq12: 'bn', sq13: 'bb', sq14: 'bq', sq15: 'bk', sq16: 'bb', sq17: 'bn', sq18: 'br',
    sq21: 'bp', sq22: 'bp', sq23: 'bp', sq24: 'bp', sq25: 'bp', sq26: 'bp', sq27: 'bp', sq28: 'bp',
    sq81: 'wr', sq82: 'wn', sq83: 'wb', sq84: 'wq', sq85: 'wk', sq86: 'wb', sq87: 'wn', sq88: 'wr',
    sq71: 'wp', sq72: 'wp', sq73: 'wp', sq74: 'wp', sq75: 'wp', sq76: 'wp', sq77: 'wp', sq78: 'wp',
  }
test('blabla', ()=> {
    const moves = bishopMoves({x:3, y:8}, boardPieces, 'wb')
    expect(moves).toBe([])
})
