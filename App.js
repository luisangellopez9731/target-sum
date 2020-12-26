import React, {Component} from 'react';

import Game from './src/components/Game';

class App extends Component {
  state = {
    gameId: 1,
  };

  resetGame = () => {
    this.setState((prevState) => {
      return {gameId: prevState.gameId + 1};
    });
  };
  render() {
    return (
      <>
        <Game
          key={this.state.gameId}
          randomNumberCount={6}
          initialSeconds={10}
          onPlayAgain={this.resetGame}
        />
      </>
    );
  }
}

export default App;
