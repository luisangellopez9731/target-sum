import React, {Component} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import RandomNumber from './RandomNumber';
import shuffle from 'lodash.shuffle';

class Game extends Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
  };
  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  };
  gameStatus = 'PLAYING';
  randomNumbers = Array.from({length: this.props.randomNumberCount}).map(
    () => 1 + Math.floor(10 * Math.random()),
  );

  targetValue = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, current) => acc + current, 0);

  shuffledRandomNumbers = shuffle(this.randomNumbers);

  selectNumber = (index) => {
    this.setState((prevState) => ({
      selectedIds: [...prevState.selectedIds, index],
    }));
  };
  
  isNumberSelected = (index) => this.state.selectedIds.indexOf(index) != -1;

  calcGameStatus = (nextState) => {
    const sumSelected = nextState.selectedIds.reduce(
      (acc, current) => acc + this.shuffledRandomNumbers[current],
      0,
    );
    if (nextState.remainingSeconds === 0) {
      return 'LOST';
    }
    return sumSelected < this.targetValue
      ? 'PLAYING'
      : sumSelected === this.targetValue
      ? 'WON'
      : 'LOST';
  };

  componentWillUpdate(nextProps, nextState) {
    if (
      nextState.selectedIds !== this.state.selectedIds ||
      nextState.remainingSeconds === 0
    ) {
      this.gameStatus = this.calcGameStatus(nextState);
      if (this.gameStatus !== 'PLAYING') {
        clearInterval(this.intervalId);
      }
    }
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(
        (prevState) => {
          return {
            remainingSeconds: prevState.remainingSeconds - 1,
          };
        },
        () => {
          if (this.state.remainingSeconds === 0) {
            clearInterval(this.intervalId);
          }
        },
      );
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
          {this.targetValue}
        </Text>
        <View style={styles.randomNumbersContainer}>
          {this.shuffledRandomNumbers.map((random, i) => (
            <RandomNumber
              key={i}
              number={random}
              isDisabled={this.isNumberSelected(i) || gameStatus !== 'PLAYING'}
              onPress={this.selectNumber}
              id={i}
            />
          ))}
        </View>
        {this.gameStatus !== 'PLAYING' && (
          <Button title="Play Again" onPress={this.props.onPlayAgain} />
        )}
        <Text>{this.state.remainingSeconds}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 30,
  },
  target: {
    fontSize: 40,
    backgroundColor: '#aaa',
    textAlign: 'center',
  },
  randomNumbersContainer: {
    flex: 1,
    marginTop: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  STATUS_PLAYING: {},
  STATUS_WON: {
    backgroundColor: 'green',
  },
  STATUS_LOST: {
    backgroundColor: 'red',
  },
});

export default Game;
