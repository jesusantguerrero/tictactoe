
const board = [
  [
   {value:' ', coord:'0,0'},
   {value:' ',coord:'0,1'},
   {value:' ', coord:'0,2'}
  ],
  [
   {value:' ', coord:'1,0'},
   {value:' ',coord:'1,1'},
   {value:' ', coord:'1,2'}
  ],
  [
   {value:' ', coord:'2,0'},
   {value:' ', coord:'2,1'},
   {value:' ', coord:'2,2'}
  ]
]

const ticTacToe = new Vue({
  el: '.tic-tac-toe',
  data: {
    board,
    player1: ' ',
    computer: ' ',
    players: ['X','O'],
    state: false,
    result: '',
    move: 0,
    playerTurn: true
  },
  computed: {
    turn() {
      return (this.playerTurn) ? 'Your turn' : 'Machine turn'
    }
  },
  
  methods: {
    setValue(value, computer, test = false){
      let falseMove= false 
      const [i, j] = value.split(',')
      const cell   = this.board[i][j]
      
      if (cell.value == ' ') {
        const play = (computer) ? this.computer : this.player1
         if ( computer) {
           cell.value = play
           if (!test){
            this.playerTurn = true 
           }
         } else if (test) {
           cell.value = play
         }else if (this.playerTurn && !test) {
           cell.value = play
           this.playerTurn = false
         } 
      } else {
        falseMove == true
        return
      }
      
      const [game, empty] = this.winningCombinations(this.board)
      const result        = this.analizeGame(game, empty)
   
      if (test) {
        cell.value = ' '
        return result
      } else {
        if (!falseMove) this.move++
        this.endPlay(result, computer, empty)
      }
    },
    
    endPlay(result, computer, empty){
      const self = this
      switch(result) {
        case 'X':
        case 'O':
          if (this.player1 == result) {
            this.result = 'Win, for you'
          } else {
            this.result = 'You lose'
          } 
          setTimeout(() => this.clear(), 2000)
          break;
        case 'tied':
          this.result = 'it is a tie'
          setTimeout(() => this.clear(), 2000)
          break
        case 'incomplete':
          if (!computer) {
            this.machinePlay(empty) 
          }
          break
      }  
    },
    
    choose(value) {
      const index = (value == this.players[1])
      this.player1  = this.players[Number(index)] 
      this.computer = this.players[Number(!index)] 
      this.state = true
    },
    
    analizeGame(board, empty) {
      for (let i = 0; i < board.length; i++){
        const result = this.lookForCombinations(board[i])
        
        if (result.x) {
          return 'X'
        } else if (result.o) {
          return 'O'
        } else if (empty.length == 0 && i == board.length - 1 ) {
          return 'tied'
        } else if (empty.length >  0 && i == board.length - 1) {
          return 'incomplete'
        }
      }
    },
  
    lookForCombinations(arr){
      const forX = arr.every((value) => (value == 'X'))
      const forO = arr.every((value) => (value == 'O'))
      const free = arr.some((value) => (value == ' '))
      return {x: forX, o: forO, free: free}
   },
    
    getColumn(n, arr){
      const column = []
      for (let i = 0;i < 3; i++){
        column.push(arr[i][n])
      }
      return column
    },
    
    getDiagonal(arr,...cells){
      return cells.map((x) => {
        return arr[x[0]][x[2]]
      })
    },
    
    winningCombinations(_board) {
      const emptyPlaces = []
      const game  = _board.map((x)=> {
        return x.reduce((row, val) => {
          if (val.value == ' ') {
            emptyPlaces.push(val.coord)
          }
          return row.concat(val.value)
        }, [])
      })
      
      const col0 = this.getColumn(0, game)
      const col1 = this.getColumn(1, game)
      const col2 = this.getColumn(2, game)
      const row0 = game[0]
      const row1 = game[1]
      const row2 = game[2]
      const d0   = this.getDiagonal(game,'0,0','1,1','2,2')
      const d1   = this.getDiagonal(game,'2,0','1,1','0,2')
      return  [[col0,col1,col2,row0,row1,row2,d0,d1], emptyPlaces]
    },
    
    clear(){
      this.result = ''
      this.move = 0
      this.board.forEach((row)=> {
        row.forEach((cell) => cell.value = ' ')
      })
      if (!this.playerTurn){
        this.setValue('1,1')
      }
    },
    
    // the AI
    machinePlay(empty) {
      const results  = {X: 1, O: 1, tied: 0, incomplete: 0}
      let bestMove = {val: -1, coord: ''} 
      const self  = this
      
      empty.forEach((val) => {
        const i = this.setValue(val, true, true)
        const j = this.setValue(val, false, true)
        
        if (val == '1,1') bestMove = {val: 0.5, coord: '1,1'}
        
        if (results[i] > bestMove.val ) {
            bestMove.val   = results[i]
            bestMove.coord = val 
        }
        
        if (results[j] > bestMove.val ) {
            bestMove.val   = results[i]
            bestMove.coord = val 
        }
        
      })
      setTimeout(()=> {
        self.setValue(bestMove.coord, true)
      },2000)
    },
    
  }
})