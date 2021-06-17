import React from 'react'
import './SnakeGame.css'
import GameOver from './GameOver.jsx'
import SnakeGame1 from './NewAi.jsx'
import GridBlock from'./gridBlock.jsx'
import LightGrid from './lightGrid.jsx'
import Tail from './tail.jsx'
import Palette from 'react-palette'
import { ColorExtractor } from 'react-color-extractor'
// import serverApp from './serverApp'
// import Player from '../../../jonny spotify api/spotify-node-react-starter-kit/client/src/App'

//main
class App extends React.PureComponent {
  
  render() {

    return (
      <div>
        <SnakeGame 
        key = {'snakegameunique'}
          tempo = {this.props.tempo}
          albumArt = {this.props.albumArt}
          aiCount = {this.props.aiCount}
          extractedColors = {this.props.extractedColors}
        />

      </div>
    )
  }
}

// var tween = React.createClass({
//   mixins: [tweenState.Mixin],
//   getInitialState: function() {
//     return {left: 0};
//   },
//   handleClick: function() {
//     this.tweenState('left', {
//       easing: tweenState.easingTypes.easeInOutQuad,
//       duration: 500,
//       endValue: this.state.left === 0 ? 400 : 0
//     });
//   },
//   render: function() {
//     var style = {
//       position: 'absolute',
//       width: 50,
//       height: 50,
//       backgroundColor: 'lightblue',
//       left: this.getTweeningValue('left')
//     };
//     return <div style={style} onClick={this.handleClick} />;
//   }
// });
class SnakeGame extends React.Component {
  constructor(props) {
    super(props)
    // this.handleKeyDownAi = this.handleKeyDownAi.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.colorSwap = this.colorSwap.bind(this)
    this.lockOn = this.lockOn.bind(this)
    this.state = {
      snakeDivs: [],
      gridLight: <div></div>,
      // tempoToMs: Math.floor((60000)/this.props.tempo),
      gridBlocks: [],
      diCode: 0,
      lightCount: 3,
      count: 0,
      sidelength: 0,
      grid: [],
      gridWidth: 0,
      gridHeight: 0,
      gridNum: 0,
      snakeGlobal: [],
      freeleft: true,
      freeright:true,
      freeup:true,
      freedown:true,
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      // colors:[this.getRandomColor(),this.getRandomColor(),this.getRandomColor()],
      colors:['yellow','green','purple'],
      extractedColors: [],
      colorBody: [],
      index: 0,
      locked: false,
      width: 0,
      height: 0,
      blockWidth: 0,
      blockHeight: 0,
      tempo: this.props.tempo, 
      gameLoopTimeout: 0,
      timeoutId: 0,
      startSnakeSize: 0,
      snake: [],
      snakeHead: [],
      apple: {},
      diCode: [],
      direction: 'right',
      directionChanged: false,
      isGameOver: false,
      snakeColor: this.props.appleColor || this.getRandomColor(),
      appleColor: this.props.appleColor || this.getRandomColor(),
      diColor: 'gray',
      score: 0,
      highScore: Number(localStorage.getItem('snakeHighScore')) || 0,
      newHighScore: false,
    }
  }

  componentDidMount() {

    this.initGame()
    // this.createGrid()
    window.addEventListener('keydown', this.colorSwap)
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keydown', this.lockOn)

    this.gameLoop()
  
  }
  componentDidUpdate(prevProps, prevState){
    if(prevState.gameLoopTimeout !== this.state.gameLoopTimeout || 
      prevState.locked !== this.state.locked || prevState.diCode !== this.state.diCode) this.createGrid()
    
    }

  initGame() {
    let extractedColors = this.props.extractedColors
    let colors = extractedColors.slice(0,3)
    // Game size initialization
    let multi = 5
    let percentageWidth = this.props.percentageWidth || 50
    let width = Math.ceil(1200)
      // document.getElementById('GameBoard').parentElement.offsetWidth *
    
    width -= width % 30
    // if (width < 30) width = 30
    let height = ((width / 3)*2)
    let blockWidth = Math.ceil(((width / 30)/ multi))
    let blockHeight = Math.ceil(((height / 20)/ multi))
    let gridNum = 15
    let gridWidth = blockWidth*9 
    let gridHeight = blockHeight*8
    // snake initialization
    let startSnakeSize = 160
    let snake = []
    let colorBody = []
    let Xpos = 72*9
    let Ypos = gridWidth*6
    let snakeHead = { Xpos: Math.ceil(Xpos), Ypos: Math.ceil((gridWidth)*6) }
    // pre grid implementation let snakeHead = { Xpos: Math.ceil(width / 2), Ypos: Math.ceil(height / 2) }
    let colorHead = this.state.colors[this.state.index]
    colorBody.push(colorHead)
    snake.push(snakeHead)
    for (let i = 1; i < startSnakeSize; i++) {
      Xpos -= blockWidth
      let snakePart = { Xpos: Xpos, Ypos: Ypos }
      let colorPart = this.state.colors[this.state.index]
      colorBody.push(colorPart)
      snake.push(snakePart)
    }

    
    // apple position initialization
    let appleXpos =
      Math.ceil(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
      blockWidth
    let appleYpos =
      Math.ceil(Math.random() * ((height - blockHeight*3) / blockHeight + 1)) *
      blockHeight
    while (appleYpos === snake[0].Ypos || appleYpos % 9!==0 || appleXpos > 1080 || appleYpos > height - (blockHeight*3)) {
      appleYpos =
        Math.ceil(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
        blockHeight
    }

    function CalcSize (){
      var number = gridNum; // Example-Number
     
      var area = height * width;
      var elementArea = parseInt(area / number);
  
      // Calculate side length if there is no "spill":
      var sideLength = parseInt(Math.sqrt(elementArea));
  
      // We now need to fit the squares. Let's reduce the square size 
      // so an integer number fits the width.
      var numX = Math.ceil(width/sideLength);
      sideLength = width/numX;
      while (numX <= number) {
          // With a bit of luck, we are done.
          if (Math.floor(height/sideLength) * numX >= number) {
              // They all fit! We are done!
              return sideLength;
          }
          // They don't fit. Make room for one more square i each row.
          numX++;
          sideLength = width/numX;
      }
      // Still doesn't fit? The window must be very wide
      // and low.
      sideLength = height;
      return sideLength;
  }
// const sideLength = CalcSize()
    let tempo = this.props.tempo
    let gameLoopTimeout = ((60000/tempo))
    // let gameLoopTimeout = ((60000/tempo)*(1080/150)/100)
    this.setState({
      colors,
      extractedColors,
      tempo,
      gameLoopTimeout,
      gridNum,
      gridWidth,
      gridHeight,
      // sideLength,
      width,
      height,
      blockWidth,
      blockHeight,
      startSnakeSize,
      colorBody,
      snake,
      apple: { Xpos: appleXpos, Ypos: appleYpos },
    })
   
  }
  createGrid(){
   
  let gridBlocks = []
    let colors = this.state.extractedColors
  for (let i = 0; i <= 10; i++){
      gridBlocks.push(
      <GridBlock
      colors = {this.props.extractedColors}
        key = {`gridblock + ${i}`}
        blockWidth = {this.state.blockWidth}
        blockHeight = {this.state.blockHeight}
        width = {this.state.blockWidth*9} 
        height = {this.state.blockHeight*9} 
        top = {this.state.blockHeight + ((this.state.blockHeight*9)*i)} 
        left = {this.state.blockWidth} 
        pulse = {(60000/this.props.tempo)}
        diCode = {this.state.diCode}
        locked = {this.state.locked}
        index = {i}
        />)
        for (let j = 1; j <= 14; j++){
          gridBlocks.push(
            <GridBlock
              colors = {this.props.extractedColors}
              key = {`gridblockhorizontal j${j}i${i} `}
              blockWidth = {this.state.blockWidth}
              blockHeight = {this.state.blockHeight}
              width = {this.state.blockWidth*9} 
              height = {this.state.blockHeight*9} 
              top = {this.state.blockHeight + ((this.state.blockHeight*9)*i)}
              left = {this.state.blockWidth + ((this.state.blockWidth*9)*j)}
              pulse = {(60000/this.props.tempo)}
              diCode = {this.state.diCode}
              locked = {this.state.locked}
              index = {i+j}
              />)
             
              
          }
      }
      // let i = -1
      // let snakeDivs = []
      // this.state.snake.forEach((snakePart, index) => {
      //   i++
       
      //  snakeDivs.push(<Tail
      //        key = {index}
      //       width = {this.state.blockWidth}
      //       height = {this.state.blockHeight}
      //       left = {snakePart.Xpos}
      //       top = {snakePart.Ypos}
      //       background = {this.state.colorBody[i]}
      //       animation = {`pulse ${this.state.gameLoopTimeout/1000}s infinite`}
      //       // animationDelay = {j}
      //       zIndex = {`${1}`}
  
      //         />
      //  )
      //  })
      this.setState({gridBlocks})
    }
  gameLoop() {
    // let timeoutId = setTimeout(() => {
   setTimeout(() => {
      
      if (!this.state.isGameOver) {
        this.moveSnake()
        this.handleKeyDown(this.state.diCode)
        let snakeHead = this.state.snake[0]
        this.tryToEatSnake()
        this.tryToEatApple()
        if(this.state.tempo !== this.props.tempo){
          let tempo = this.props.tempo
          // let tempoToMS = Math.floor((60000)/this.props.tempo)
    let gameLoopTimeout = ((60000/tempo))
          this.setState({
            tempo,
            gameLoopTimeout})
        }
        if(this.state.locked){
          this.handleKeyDown(16)
        }
        if(this.state.locked === false && this.state.diCode >0){
          this.handleKeyDown(this.state.diCode)
        }
        this.setState({ directionChanged: false, snakeHead })
      }
     
      this.gameLoop()
    }, this.state.gameLoopTimeout)

    // this.setState({ timeoutId })
  }

  componentWillUnmount() {
    // clearTimeout(this.state.timeoutId)
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  resetGame() {
    let width = this.state.width
    let height = this.state.height
    let blockWidth = this.state.blockWidth
    let blockHeight = this.state.blockHeight
    let apple = this.state.apple

    // snake reset
    let snake = []
    let Xpos = width / 2
    let Ypos = height / 2
    let snakeHead = { Xpos: width / 2, Ypos: height / 2 }
    snake.push(snakeHead)
    for (let i = 1; i < this.state.startSnakeSize; i++) {
      Xpos -= blockWidth
      let snakePart = { Xpos: Xpos, Ypos: Ypos }
      snake.push(snakePart)
    }

    // apple position reset
    apple.Xpos =
      Math.ceil(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
      blockWidth
    apple.Ypos =
      Math.ceil(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
      blockHeight
    while (this.isAppleOnSnake(apple.Xpos, apple.Ypos)) {
      apple.Xpos =
        Math.ceil(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
        blockWidth
      apple.Ypos =
        Math.ceil(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
        blockHeight
    }

    this.setState({
      snake,
      apple,
      direction: 'right',
      directionChanged: false,
      isGameOver: false,
   
      snakeColor: this.getRandomColor(),
      appleColor: this.getRandomColor(),
      score: 0,
      newHighScore: false,
    })
  }

  getRandomColor() {
    let hexa = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) color += hexa[Math.ceil(Math.random() * 16)]
    return color
  }

  moveSnake() {
    this.handleKeyDown(this.state.diCode)
   
    let snakeGlobal = this.state.snake.slice()
    this.tryToEatApple()
    function getDivs(){  
      let divs = document.getElementsByClassName('aiBlock')
   
      var arr = Array.prototype.slice.call( divs )
      
      let divsArr = Object.keys(divs)
      let divsVals = Object.values(divs)
      let global = []
      // if(divs[0][width] !==undefined){
      // arr.forEach((el)=>{
        for(let i = 0; i < arr.length; i++){
        
        let xpos = (Number.parseInt(arr[i].style.cssText.split(';')[2].split(' ')[2]))
        let ypos = (Number.parseInt(arr[i].style.cssText.split(';')[3].split(' ')[2]))

        // snakeGlobal.push({Xpos: xpos, Ypos: ypos})
        // if(i> 6 && global[0].Xpos === global[i].Xpos && global[0].Ypos === global[i].Ypos) return
        // if(el[style] !== undefined) snakeGlobal.push({Xpos: el[style][cssText], Ypos: el[height]})
      // }
      
      }

      // snakeGlobal= [...new Set(snakeGlobal)]
     
    }
    if(this.props.aiCount>0){
    getDivs()
    }
    let snake = this.state.snake
    let colorBody = this.state.colorBody
    let previousPartX = this.state.snake[0].Xpos
    let previousPartY = this.state.snake[0].Ypos
    let previousColor = this.state.colorBody[0]
    let tmpPartX = previousPartX
    let tmpPartY = previousPartY
    let tmpColor = previousColor
    this.moveHead()
    let i = 1, len = snake.length;
    while (i < len) {
      tmpPartX = snake[i].Xpos
      tmpPartY = snake[i].Ypos
      tmpColor = colorBody[i]
      snake[i].Xpos = previousPartX
      snake[i].Ypos = previousPartY
      colorBody[i] = previousColor
      previousPartX = tmpPartX
      previousPartY = tmpPartY
      previousColor = tmpColor
        i++
    }
    // for (let i = 1; i < snake.length; i++) {
    //   tmpPartX = snake[i].Xpos
    //   tmpPartY = snake[i].Ypos
    //   tmpColor = colorBody[i]
    //   snake[i].Xpos = previousPartX
    //   snake[i].Ypos = previousPartY
    //   colorBody[i] = previousColor
    //   previousPartX = tmpPartX
    //   previousPartY = tmpPartY
    //   previousColor = tmpColor
    // }
  //  let gameLoopTimeout = (60000/this.props.tempo)
  //  if(this.state.snake[0].Ypos % (this.state.gridWidth/2) !== 0 || this.state.snake[0].Xpos % (this.state.gridWidth) !== 0){
  //   gameLoopTimeout = gameLoopTimeout/7
  // }

  // let gridLight = this.state.gridLight
  // if(this.state.snake[0] !== undefined && this.state.snake[0].Xpos %72===0&& this.state.snake[0].Ypos%72===0){
  //   // console.log('grid',this.state.gridLight)
  //   gridLight = <LightGrid
  //     width = {this.state.width}
  //       blockWidth = {this.state.blockWidth}
  //       height = {this.state.height}
  //       left = {this.state.snake[0].Xpos - (this.state.snake[0].Xpos%72)}
  //       top = {this.state.snake[0].Ypos- (this.state.snake[0].Ypos%72)}
  //   />
  //   this.setState(gridLight)
  // }
    this.setState({ snake, colorBody, directionChanged: false, snakeGlobal})
    if(this.state.snake[0].Ypos % (this.state.gridWidth/2) !== 0 || this.state.snake[0].Xpos % (this.state.gridWidth) !== 0){
      this.handleKeyDown(this.state.diCode)
      setTimeout(() => {
        // this.tryToEatApple()
        // this.handleKeyDown(this.state.diCode)
       
        return this.moveSnake()
      }, ((this.state.gameLoopTimeout-2)/12))
    
    }
  
  }

  tryToEatApple() {
    let snake = this.state.snake
    let apple = this.state.apple
    let width = 1020
    
    let blockWidth = this.state.blockWidth
    let blockHeight = this.state.blockHeight
    let height = this.state.height - (blockHeight*3)
    let newTail = { Xpos: apple.Xpos, Ypos: apple.Ypos }
    let highScore = this.state.highScore
    let newHighScore = this.state.newHighScore
  //  snake.push(newTail)

    // if the snake's head is on an apple
    if (snake[0].Xpos === apple.Xpos && snake[0].Ypos === apple.Ypos) {
     

      // increase snake size
      snake.push(newTail)
      if(this.state.locked===true) this.colorSwap('force')
      // create another apple
      apple.Xpos =
        Math.ceil(Math.random() * ((width - blockWidth) / blockWidth )) *
        blockWidth
      apple.Ypos =
        Math.ceil(Math.random() * ((height - (blockHeight*2)) / blockHeight)) *
        blockHeight
      while (this.isAppleOnSnake(apple.Xpos, apple.Ypos) || apple.Ypos % 9!==0 || apple.Xpos % 9 !== 0) {
        
        apple.Xpos =
          Math.ceil(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
          blockWidth
        apple.Ypos =
          Math.ceil(
            Math.random() * ((height - blockHeight) / blockHeight + 1)
          ) * blockHeight
      }
      

      // increment high score if needed
      if (this.state.score === highScore) {
        highScore++
        localStorage.setItem('snakeHighScore', highScore)
        newHighScore = true
      }

      // decrease the game loop timeout
      // if (gameLoopTimeout > 25) gameLoopTimeout -= 0.5

      this.setState({
        snake,
        apple,
        score: this.state.score + 1,
        highScore,
        newHighScore,
        // gameLoopTimeout,
        
      })
    }
  }

  tryToEatSnake() {
    let snake = this.state.snake.slice()
    // let snakeGlobal = this.state.snakeGlobal.slice()
    let colorBody = this.state.colorBody
    let i = 1, len = snake.length;
    while (i < len) {
      if (snake[0].Xpos === snake[i].Xpos && snake[0].Ypos === snake[i].Ypos ){
        // console.log(colorBody[0])
      if(colorBody[0] === colorBody[i]){
        this.setState({ isGameOver: true })
    }
    }
    i++
      }
 
    //   for (let i = 1; i < snakeGlobal.length; i++) {
    //   if(this.state.length>6){
    //     if(snake[0].Xpos === snakeGlobal[i].Xpos && snake[0].Ypos === snakeGlobal[i].Ypos){
    //       this.setState({ isGameOver: true })
    //     }
    // }}
  }

  isAppleOnSnake(appleXpos, appleYpos) {
    let snake = this.state.snake
    for (let i = 0; i < snake.length; i++) {
      if (appleXpos === snake[i].Xpos && appleYpos === snake[i].Ypos)
        return true
    }
    return false
  }

  moveHead() {
    // let snapCount = React.Children.toArray(this.props.children).filter((item) => item.props.className === 'aiBlock').length;

    switch (this.state.direction) {
      case 'left':
        this.moveHeadLeft()
        break
      case 'up':
        this.moveHeadUp()
        break
      case 'right':
        this.moveHeadRight()
        break
      default:
        this.moveHeadDown()
    }
  }

  moveHeadLeft() {

    let width = this.state.width
    let blockWidth = this.state.blockWidth
    let snake = this.state.snake
    let colorBody = this.state.colorBody
    colorBody[0]=this.state.colors[this.state.index]
    colorBody.pop()
    snake[0].Xpos =
      snake[0].Xpos <= 0 ? 1080 - blockWidth : snake[0].Xpos - blockWidth
      // let leftC = {Xpos: snake[0]['Xpos']-blockWidth, Ypos: snake[0]['Ypos']}
      // if(leftC.Xpos <= 0) leftC.Xpos = width-blockWidth;
      // let rightC = {Xpos: snake[0]['Xpos']+blockWidth, Ypos: snake[0]['Ypos']}
      // let upC = {Xpos: snake[0]['Xpos'], Ypos: snake[0]['Ypos']-this.state.blockHeight}
      // let downC = {Xpos: snake[0]['Xpos'], Ypos: snake[0]['Ypos']+this.state.blockHeight}
      // snake.forEach((el) => {
      //   if(el['Ypos'] === leftC['Ypos']&& el['Xpos']=== leftC['Xpos']){ 
      //     freeleft = false}
      //     if(el['Ypos'] === upC['Ypos']&& el['Xpos']=== upC['Xpos']){
      //       freeup = false}
      //           if(el['Ypos'] === downC['Ypos']&& el['Xpos']=== downC['Xpos']){ 
      //           freedown = false}
      //   })
      this.setState({ snake, colorBody})
  }

  moveHeadUp() {

    let height = this.state.height
    let blockHeight = this.state.blockHeight
    let snake = this.state.snake
    let colorBody = this.state.colorBody
    colorBody[0]=this.state.colors[this.state.index]
    colorBody.pop()
    snake[0].Ypos =
      snake[0].Ypos <= 0 ? height - (blockHeight*2) : snake[0].Ypos - blockHeight
      // let leftC = {Xpos: snake[0]['Xpos']-blockHeight, Ypos: snake[0]['Ypos']}
      // let rightC = {Xpos: snake[0]['Xpos']+blockHeight, Ypos: snake[0]['Ypos']}
      // let upC = {Xpos: snake[0]['Xpos'], Ypos: snake[0]['Ypos']-this.state.blockHeight}
      // if(upC.Ypos <= 0) leftC.Ypos = height - blockHeight;
      // let downC = {Xpos: snake[0]['Xpos'], Ypos: snake[0]['Ypos']+this.state.blockHeight}
      // snake.forEach((el) => {
      //   if(el['Ypos'] === upC['Ypos']&& el['Xpos']=== upC['Xpos']){ 
      //     freeup = false}
      //   if(el['Ypos'] === rightC['Ypos']&& el['Xpos']=== rightC['Xpos']){ 
      //     freeright = false}
      //     if(el['Ypos'] === leftC['Ypos']&& el['Xpos']=== leftC['Xpos']){ 
      //       freeleft = false}
      
      //       if(el['Ypos'] === downC['Ypos']&& el['Xpos']=== downC['Xpos']){ 
      //       freedown = false}
      // })
    this.setState({ snake, colorBody})
  }

  moveHeadRight() {

    let width = this.state.width
    let blockWidth = this.state.blockWidth
    let snake = this.state.snake
    let colorBody = this.state.colorBody
    colorBody[0]=this.state.colors[this.state.index]
    colorBody.pop()
    snake[0].Xpos =
      snake[0].Xpos >= 1080 - blockWidth ? 0 : snake[0].Xpos + blockWidth
      // let leftC = {Xpos: snake[0]['Xpos']-blockWidth, Ypos: snake[0]['Ypos']}
      // let rightC = {Xpos: snake[0]['Xpos']+blockWidth, Ypos: snake[0]['Ypos']}
      // if(rightC.Xpos >= width - blockWidth) rightC.Xpos = 0;
      // let upC = {Xpos: snake[0]['Xpos'], Ypos: snake[0]['Ypos']-this.state.blockHeight}
      // let downC = {Xpos: snake[0]['Xpos'], Ypos: snake[0]['Ypos']+this.state.blockHeight}
      // snake.forEach((el) => {
      //   if(el['Ypos'] === rightC['Ypos']&& el['Xpos']=== rightC['Xpos']){ 
      //     freeright = false}
      //   if(el['Ypos'] === upC['Ypos']&& el['Xpos']=== upC['Xpos'] ){ 
      //     freeup = false}
      //       if(el['Ypos'] === downC['Ypos']&& el['Xpos']=== downC['Xpos']){ 
      //       freedown = false}
      //   }
      //   )
      this.setState({ snake, colorBody})
  }

  moveHeadDown() {
 
    let height = this.state.height
    let blockHeight = this.state.blockHeight
    let snake = this.state.snake
    let colorBody = this.state.colorBody
    colorBody[0]=this.state.colors[this.state.index]
    colorBody.pop()
    snake[0].Ypos =
      snake[0].Ypos >= height - (blockHeight * 2) ? 0 : snake[0].Ypos + blockHeight
      // let leftC = {Xpos: snake[0]['Xpos']-blockHeight, Ypos: snake[0]['Ypos']}
      // let rightC = {Xpos: snake[0]['Xpos']+blockHeight, Ypos: snake[0]['Ypos']}
      // let upC = {Xpos: snake[0]['Xpos'], Ypos: snake[0]['Ypos']-this.state.blockHeight}
      // let downC = {Xpos: snake[0]['Xpos'], Ypos: snake[0]['Ypos']+this.state.blockHeight}
      // if(downC.Ypos >= height - blockHeight) downC.Ypos = 0;
      // snake.forEach((el) => {
      //   if(el['Ypos'] === rightC['Ypos']&& el['Xpos']=== rightC['Xpos']){ 
      //     freeright = false}
      //   if(el['Ypos'] === upC['Ypos']&& el['Xpos']=== upC['Xpos']){ 
      //     freeup = false}
      //       if(el['Ypos'] === downC['Ypos']&& el['Xpos']=== downC['Xpos']){ 
      //       freedown = false}
      //       if(el['Ypos'] === leftC['Ypos']&& el['Xpos']=== leftC['Xpos']){ 
      //         freeleft = false}
      //   })
      this.setState({ snake, colorBody})
  }

  

  lockOn (event){
    if(event.keyCode === 16){
      if(this.state.locked  === false){
        this.setState({
          locked: true
        })
      }
      else {this.setState({locked: false})}
    }
  }

  colorSwap(event) {
    if(event.keyCode === 69 || event === 'force'){
        if(this.state.index > this.state.colors.length - 2) this.setState({index: 0})
        else this.setState({index : this.state.index + 1,
        snakeColor: this.state.colors[this.state.index]})
    }

  }

  handleKeyDown(event) {
    // console.log(this.state.directionChanged)
    if(event.keyCode){
      if(event.keyCode === 67){
        console.log(this.props.tempo, this.state.gameLoopTimeout, this.state.timeoutId)
      }
      if(this.state.diCode !== event.keyCode){
        this.setState({diCode: event.keyCode})
      }
      
    }


    // if spacebar is pressed to run a new game
    if (this.state.isGameOver && event.keyCode === 32) {
      this.resetGame()
      return
    }
    if (this.state.directionChanged) return

    if(this.state.locked){

  
  if( this.state.snake[0].Xpos > this.state.apple.Xpos && this.state.snake[0].Ypos === this.state.apple.Ypos){
    this.goLeft()
    this.setState({ directionChanged: true })
 return
  }
  if( this.state.snake[0].Ypos > this.state.apple.Ypos && this.state.snake[0].Xpos % (this.state.gridWidth/2)  === 0){
    this.goUp()
    this.setState({ directionChanged: true })
return
 
  }
  if( this.state.snake[0].Xpos < this.state.apple.Xpos && this.state.snake[0].Ypos === this.state.apple.Ypos){
    this.goRight()
    this.setState({ directionChanged: true })
  return
  }
  if( this.state.snake[0].Ypos < this.state.apple.Ypos && this.state.snake[0].Xpos % (this.state.gridWidth/2)  === 0){
  
    this.goDown()
    this.setState({ directionChanged: true })
 return
  }
  }
  // console.log(this.state.snake[0].Xpos % 46, this.state.snake[0].Ypos% 64 ===0, this.state.snake[0].Xpos, this.state.snake[0].Ypos)
// if(this.state.snake[0].Xpos % 64 === 8 && this.state.snake[0].Ypos % 64 === 8){
  
      if(this.state.diCode === 37 || this.state.diCode === 65 && this.state.snake[0].Ypos % (this.state.gridWidth/2) === 0)
        this.goLeft()
        this.setState({ directionChanged: true })
   
        if(this.state.diCode === 38 || this.state.diCode === 87 && this.state.snake[0].Xpos % (this.state.gridWidth) === 0) {
    
          this.goUp()
          this.setState({ directionChanged: true })
        }

        if(this.state.diCode === 39 || this.state.diCode === 68 && this.state.snake[0].Ypos % (this.state.gridWidth/2) === 0) {
          
          this.goRight()
          this.setState({ directionChanged: true })
        }
     
        if(this.state.diCode === 40 || this.state.diCode === 83 && this.state.snake[0].Xpos % (this.state.gridWidth) === 0){
        this.goDown()
        this.setState({ directionChanged: true })
      }
   
    

   
    
  // }
  }

  goLeft() {
    let newDirection = this.state.direction === 'right' ? 'right' : 'left'
    this.setState({ direction: newDirection })
  }

  goUp() {
    let newDirection = this.state.direction === 'down' ? 'down' : 'up'
    this.setState({ direction: newDirection })
  }

  goRight() {
    let newDirection = this.state.direction === 'left' ? 'left' : 'right'
    this.setState({ direction: newDirection })
  }

  goDown() {
    let newDirection = this.state.direction === 'up' ? 'up' : 'down'
    this.setState({ direction: newDirection })
  }

  render() {
   let snakeDivs = this.state.snakeDivs;
   let snakeArr = []
   let i = -1
   let j = 0
    this.state.snake.forEach((snakePart, index) => {
      i++
      j++
     snakeArr.push(<Tail
          //  key = {index}
          width = {this.state.blockWidth}
          height = {this.state.blockHeight}
          left = {snakePart.Xpos}
          top = {snakePart.Ypos}
          background = {this.state.colorBody[i]}
          animation = {`pulse ${this.state.gameLoopTimeout/1000}s infinite`}
          // animationDelay = {j}
          zIndex = {`${1}`}

            />
     )
    
     })
     
      i++
     
    
    let lightArr =[]
    let gridBlocks = this.state.gridBlocks
    // for (let i = 0; i <= 10; i++){
    //     gridBlocks.push(
    //     <GridBlock
    //       key = {`gridblock + ${i}`}
    //       blockWidth = {this.state.blockWidth}
    //       blockHeight = {this.state.blockHeight}
    //       width = {this.state.blockWidth*9} 
    //       height = {this.state.blockHeight*9} 
    //       top = {this.state.blockHeight + ((this.state.blockHeight*9)*i)} 
    //       left = {this.state.blockWidth} 
    //       pulse = {60000/this.props.tempo}
    //       diCode = {this.state.diCode}
    //       locked = {this.state.locked}
    //       index = {i}
    //       />)
    //       for (let j = 1; j <= 14; j++){
    //         gridBlocks.push(
    //           <GridBlock
    //             key = {`gridblockhorizontal j${j}i${i} `}
    //             blockWidth = {this.state.blockWidth}
    //             blockHeight = {this.state.blockHeight}
    //             width = {this.state.blockWidth*9} 
    //             height = {this.state.blockHeight*9} 
    //             top = {this.state.blockHeight + ((this.state.blockHeight*9)*i)}
    //             left = {this.state.blockWidth + ((this.state.blockWidth*9)*j)}
    //             pulse = {60000/this.props.tempo}
    //             diCode = {this.state.diCode}
    //             locked = {this.state.locked}
    //             index = {i+j}
    //             />)
               
                
    //         }
    //     }
       
          // left = {this.state.blockWidth + ((this.state.blockHeight*9)*i)} 
     
    let snakes = []
    let snake = this.state.snake.slice()
    let snakeGlobal = this.state.snakeGlobal.slice()
    // let light = this.state.lightCount
    // light--
    // this.setState({lightCount: light})
    // if(light <= 0) light = 3
  
    if(this.state.snake[0] !== undefined){
      // lightArr.push(this.state.gridLight)
    
      
    lightArr.push(
    // <LightGrid
    //   width = {this.state.width}
    //     blockWidth = {this.state.blockWidth}
    //     height = {this.state.height}
    //     left = {(this.state.snake[0].Xpos %64)+8}
    //     top = {this.state.snake[0].Ypos}
    // />,
    <LightGrid
    colors = {this.state.extractedColors}
    width = {this.state.width}
      blockWidth = {this.state.blockWidth}
      height = {this.state.height}
      left = {this.state.snake[0].Xpos}
      top = {this.state.snake[0].Ypos}
  />, 
)}
  if(this.state.snake[0] !== undefined && this.state.snake[0].Xpos %72===0&& this.state.snake[0].Ypos%72===0){
    // console.log('grid')
    lightArr.push(  <LightGrid
    colors = {this.state.extractedColors}
      width = {this.state.width}
        blockWidth = {this.state.blockWidth}
        height = {this.state.height}
        left = {this.state.snake[0].Xpos - (this.state.snake[0].Xpos%72)}
        top = {this.state.snake[0].Ypos- (this.state.snake[0].Ypos%72)}
    />)
  }
  
    let apple =<div> <div
    className='Apple'
    style={{
      width: this.state.blockWidth,
      height: this.state.blockHeight,
      left: this.state.apple.Xpos,
      top: this.state.apple.Ypos,
      background: 'red',
      animation: `pulse3 ${(this.state.gameLoopTimeout/1000)*8}s infinite`,
      opacity: .5
      
    }}
  />
  <div
    className='Apple'
    style={{
      width: this.state.blockWidth,
      height: this.state.blockHeight,
      left: this.state.apple.Xpos,
      top: this.state.apple.Ypos,
      background: 'red',

      animation: `pulse4 ${(this.state.gameLoopTimeout/1000)*2}s infinite`,
      // animationDelay: `.${Math.floor(this.state.gameLoopTimeout)/2}s`,
      opacity: .5
    }}
  />
    <div
    className='Apple'
    style={{
      width: this.state.blockWidth,
      height: this.state.blockHeight,
      left: this.state.apple.Xpos,
      top: this.state.apple.Ypos,
      background: 'red',
    
      animation: `pulse5 ${(this.state.gameLoopTimeout/1000)*4}s infinite`,
      // animationDelay: `.${Math.floor(this.state.gameLoopTimeout)}s`,
      opacity: .5
    }}
  />
  <div
    className='Apple'
    style={{
      width: this.state.blockWidth,
      height: this.state.blockHeight,
      left: this.state.apple.Xpos,
      top: this.state.apple.Ypos,
      background: 'red',
      animation: `pulse6 ${(this.state.gameLoopTimeout/1000)*16}s infinite`,
      opacity: .5
      
    }}
  />
  </div>
    if(this.state.width>0){
   
    for(let i = 0; i < this.props.aiCount; i++){
snakes.push(<SnakeGame1 key = {'ai'+i}
        inc = {i}
        // gameLoopTimeout = {(60000/this.props.tempo)/2}
        gameLoopTimeout = {this.state.gameLoopTimeout/1000}
        apple = {this.state.apple}
        playerSnake = {snake}
        snakeGlobal = {snake.concat(snakeGlobal)}
        // handleKeyDown = {this.handleKeyDown}
        width = {this.state.width}
        height = {this.state.height}
        gridWidth = {this.state.gridWidth}
        blockWidth= {this.state.blockWidth}
        blockHeight= {this.state.blockHeight}
        /> )}
    }
    // Game over
    if (this.state.isGameOver) {
      return (
        <GameOver
          width={this.state.width}
          height={this.state.height}
          highScore={this.state.highScore}
          newHighScore={this.state.newHighScore}
          score={this.state.score}
          pulse = {this.state.gameLoopTimeout/1000}
        />
      )
    }
// let i = -1
// width: this.state.width,
    return (
      <div
        id='GameBoard'
        style={{
          width: 1088,
          height: this.state.height,
          borderWidth: this.state.width / 50,
          backgroundImage: `url(${this.props.albumArt})`
        }}>
          
          {lightArr}
          {snakes}
          {gridBlocks}
          {/* {this.state.snakeGlobal.map((snakePart, index) => {
          i++
          
          return (
            <div>
            <div
              key={index}
              className='Block'
              style={{
                width: this.state.blockWidth,
                height: this.state.blockHeight,
                left: snakePart.Xpos,
                top: snakePart.Ypos,
                background: 'white',
                zIndex: `${i}`
              }}
            />
            
           </div>
          )
        })} */}
     {snakeDivs}
     {snakeArr}
          {/* {this.state.snake.map((snakePart, index) => {
            return (
      <Tail
           key = {index}
          width = {this.state.blockWidth}
          height = {this.state.blockHeight}
          left = {snakePart.Xpos}
          top = {snakePart.Ypos}
          // background = {this.state.colorBody[i]}
          animation = {`pulse ${this.state.tempoToMs/1000}s infinite`}
          zIndex = {`${1}`}
            />)
           })} */}
        {/* {this.state.snake.map((snakePart, index) => {
          i++
          
          return (
            <div>
            <div
              key={index}
              inc = {index}
              className='Block'
              style={{
                width: this.state.blockWidth,
                height: this.state.blockHeight,
                left: snakePart.Xpos,
                top: snakePart.Ypos,
                background: this.state.colorBody[i],
                animation: `pulse ${this.state.tempoToMs/1000}s infinite`,
                // animationDelay: index*10,
                zIndex: `${1}`,
              }}
            />
           </div>
          )
        })
        
        } */}
{/* {this.state.di.map((snakePart)=>{
  
  return(
            <div
            
            className = 'block'
            style ={{
              width: this.state.blockWidth,
              height: this.state.blockHeight,
              left: snakePart.Xpos,
              top: snakePart.Ypos,
              background: this.state.diColor,
            }}
            />
  )}
)
        } */}
       {apple}
        {/* background: this.state.appleColor */}
        <div id='Score' style={{ fontSize: this.state.width / 40 }}>
         {/* HIGH-SCORE: {this.state.highScore}&ensp;&ensp;&ensp;&ensp;SCORE:{' '} <div>LockedOn:{this.state.locked.toString()}</div> */}
         {/* global{JSON.stringify(this.state.snakeGlobal)}
         playersnake{JSON.stringify(this.state.snake)} */}
          {this.state.score}
         
          {/* {this.state.gameLoopTimeout} {60000/this.props.tempo} width {this.state.width} height {this.state.height} blockwidth {this.state.blockWidth} blockHeight {this.state.blockHeight} sidelength {this.state.sideLength} */}
        </div>
        
      </div>
    )
  }
}

class AI extends React.Component {
   render() {
    return 
   }
  }
export default App
