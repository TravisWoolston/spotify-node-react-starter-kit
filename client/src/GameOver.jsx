import React from 'react'

class GameOver extends React.Component {
  render(){
  return (
    <div
      id='GameOver'
      style={{
        // width: this.props.width,
        // height: this.props.height,
        borderWidth: this.props.width / 50,
        animation: `pulse2 ${this.props.pulse}s infinite`,
        color: 'white',
        fontSize: '40px'
      }}>Try Again?</div>
     
  )
      }
}

export default GameOver
