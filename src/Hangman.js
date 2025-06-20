import React, { Component } from "react";
import { randomWord } from "./words"; 
import "./Hangman.css";
import img0 from "./0.jpg";
import img1 from "./1.jpg";
import img2 from "./2.jpg";
import img3 from "./3.jpg";
import img4 from "./4.jpg";
import img5 from "./5.jpg";
import img6 from "./6.jpg";

class Hangman extends Component {
 
  static defaultProps = {
    maxWrong: 6,
    images: [img0, img1, img2, img3, img4, img5, img6]
  };

  constructor(props) {
    super(props);
    this.state = { nWrong: 0, 
      guessed: new Set(), 
      answer: randomWord() 
    };
    this.handleGuess = this.handleGuess.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }


  guessedWord() {
    return this.state.answer
      .split("")
      .map(ltr => (this.state.guessed.has(ltr) ? ltr : "_"));
  }


  handleGuess(evt) {
    let ltr = evt.target.value;
    this.setState(st => ({
      guessed: new Set (st.guessed).add(ltr),
      nWrong: st.nWrong + (st.answer.includes(ltr) ? 0 : 1)
    }));
  }

  isGameOver() {
    return this.state.nWrong >= this.props.maxWrong;
  }

  generateButtons() {
    return "abcdefghijklmnopqrstuvwxyz".split("").map(ltr => (
      <button
        key={ltr}
        value={ltr}
        onClick={this.handleGuess}
        disabled={
          this.state.guessed.has(ltr) || 
          this.isGameOver() ||
          this.guessedWord().join("") === this.state.answer
        }
      >
        {ltr}
      </button>
    ));
  }


  resetGame() {
    this.setState (st => ({
      nWrong: 0,
      guessed: new Set(),
      answer: randomWord()
    }))
  }

  handleReset() {
    this.resetGame();
  }


  /** Keyboard support 
  */
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  handleKeyPress = (evt) => {
    const key = evt.key.toLowerCase();

    if (!/^[a-z]$/.test(key)) return

    if (
      this.state.nWrong >= this.props.maxWrong ||
      this.guessedWord().join("") === this.state.answer
    ) return;

    if (!this.state.guessed.has(key)) {
      this.handleGuess({ target: { value: key } });
    }
  }



  render() {
    const isWinner = this.guessedWord().join("") === this.state.answer;
    return (
      <div className='Hangman'>
        <h1>Vjesalica</h1>

        <img src={this.props.images[this.state.nWrong]} 
        alt={`${this.state.nWrong} wrong guesses of ${this.props.maxWrong}`}
        />

        <p className="guess-message" >Preostalo pokusaja: {this.state.nWrong} / {this.props.maxWrong} </p>

        <p className='Hangman-word'>
          {this.isGameOver() ? this.state.answer : this.guessedWord()}</p>
          {isWinner && (
            <p className="win-message">You Win!</p>
          )}

        <p className='Hangman-btns'>{this.generateButtons()}</p>

        <div>
          <button className="resetBtn" onClick={this.handleReset} >Reset</button>
        </div>
      </div>
    );
  }
}

export default Hangman;
