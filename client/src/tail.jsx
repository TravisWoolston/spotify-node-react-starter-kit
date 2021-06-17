import React from 'react'
import './SnakeGame.css'

class Tail extends React.Component{

    render(){
        // console.log(this.props)
        return (
            <div 
            className = 'tail'
            key = {this.props.key}
            style = {{
                width : this.props.width,
                height : this.props.height,
                left : this.props.left,
                top : this.props.top,
                background: this.props.background,
                // animation : this.props.animation,
                // animationDelay: `${this.props.index}s`,
                zIndex : `10000`
            }}
            />
        )
    }
}


export default Tail;