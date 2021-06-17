import React from 'react'
import './SnakeGame.css'

class LightGrid extends React.PureComponent{

    render() {
        return(
            
                
                  <div>
                 <div
                     key = {`assist1${this.props.keynum}`}
                     className='assist'
                     style={{
                       position: 'absolute',
                       zIndex: '-1',
                       width: this.props.blockWidth,
                       height: this.props.height,
                       left: this.props.left,
                       top: 0,
                       background: this.props.colors[4],
                      //  animation: `fadeOut 5s infinite`
                       
                     }}
                   />
                   <div
                     key = {`assist2${this.props.keynum}`}
                     className='assist'
                     style={{
                       position: 'absolute',
                       zIndex: '-1',
                       width: 1080,
                       height: this.props.blockWidth,
                       left: 0,
                       top: this.props.top,
                       background: this.props.colors[4],
                      //  animation: `fadeOut 3s`
                     }}
                   />
                   </div>
                   
        )
    }
}

export default LightGrid

