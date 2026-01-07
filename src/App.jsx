import { useState } from "react";
import countries from "./data/countries";
import "./App.css";

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeChoices(answer) {
  const others = shuffle(
    countries.filter(c => c.code !== answer.code)
  ).slice(0, 3);

  return shuffle([answer, others[0], others[1], others[2]]);
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [quiz, setQuiz] = useState(shuffle(countries).slice(0, 20));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [choices, setChoices] = useState(makeChoices(quiz[0]));

  const current = quiz[index];

  function start() {
    const newQuiz = shuffle(countries).slice(0, 20);
    setQuiz(newQuiz);
    setIndex(0);
    setScore(0);
    setChoices(makeChoices(newQuiz[0]));
    setAnswered(false);
    setResult(null);
    setMessage("");
    setStarted(true);
  }

  function answer(name) {
    if (answered) return;

    if (name === current.name) {
      setScore(score + 1);
      setResult("ok");
      setMessage("正解😊");
    } else {
      setResult("ng");
      setMessage(`不正解😢正解は「${current.name}」`);
    }

    setAnswered(true);
  }

  function next() {
    const nextIndex = index + 1;
    if (nextIndex === quiz.length) {
      setIndex(nextIndex);
      return;
    }

    setIndex(nextIndex);
    setChoices(makeChoices(quiz[nextIndex]));
    setAnswered(false);
    setResult(null);
    setMessage("");
  }

  function retry() {
    setStarted(false);
  }

  if (!started) {
    return (
      <div className="screen">
        <div className="card">
          <h1>🌍国旗クイズ🌎</h1>
          <p>国旗を見て国名を選ぼう！（全20問）</p>
          <button className="start" onClick={start}>
            スタート ▶
          </button>
        </div>
      </div>
    );
  }

  if (index >= quiz.length) {
    return (
      <div className="screen">
        <div className="card">
          <h1>結果🎉</h1>
          <p>{score} / {quiz.length} 正解</p>
          <button onClick={retry} className="retry">
            再挑戦
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="card">
        <h1>国旗クイズ（{index + 1} / 20）</h1>

        <div className="flag-wrapper">
          <img src={current.flag} alt="flag" className="flag" />

          {result === "ok" && <div className="mark ok">〇</div>}
          {result === "ng" && <div className="mark ng">×</div>}
        </div>

        <div className="choices">
          {choices.map(c => (
            <button
              key={c.code}
              onClick={() => answer(c.name)}
              disabled={answered}
            >
              {c.name}
            </button>
          ))}
        </div>

        <p className="message">{message}</p>

        {answered && (
          <button className="next" onClick={next}>
            {index === quiz.length - 1 && "結果発表 ▶"}
            {index !== quiz.length - 1 && "次の問題へ ▶"}
          </button>
        )}
      </div>
    </div>
  );
}
