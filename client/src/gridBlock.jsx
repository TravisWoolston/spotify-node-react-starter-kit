import React from 'react'
import './SnakeGame.css'
import arrow from './images/whitearrow.png'
import lock from './images/lock.png'
import Palette from 'react-palette'
class GridBlock extends React.PureComponent{

    render(){
      let colors='blue'
      if(this.props.colors !== undefined){
        colors = this.props.colors[0]
      }

      let degree = 0;
      let image = arrow
        if (this.props.locked){
          image = lock
        }
        else {
        if(this.props.diCode === 65) degree = 180 
        else if(this.props.diCode === 87) degree = 270
        // if(this.props.diCode === 68)
        else if(this.props.diCode === 83) degree = 90
        }
        return (
            
           <div
           
          className = 'grid'
          style = {{
          width : this.props.width -this.props.blockWidth,
          height : this.props.height - this.props.blockHeight,
          top : this.props.top ,
          left : this.props.left ,
          animation: `${this.props.pulse/250}s ease ${this.props.index/10}s infinite normal none running pulse2`,
           
          backgroundColor: this.props.colors[3],
        //   border: `${8}px solid rgb(255, 255, 255, .5)`,
        // animationName: 'colorShift',
        // animationDuration: `${this.props.pulse/10}s`,
        // animationIterationCount: 'infinite',
        // animationDirection: 'alternate',
          }}
          >
            <img src={image}
            alt = 'arrow'
              style = {{
                width : this.props.width - (this.props.blockWidth*2),
                height : this.props.height - (this.props.blockHeight*2),
                padding: '5px',
                transform: `rotate(${degree}deg)`
              }}
            />
   
            {/* {this.props.index} */}
            </div>
          
        )
    }
}

export default GridBlock