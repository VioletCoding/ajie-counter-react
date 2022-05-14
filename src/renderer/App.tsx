import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import { useState } from 'react';

const Hello = () => {
  const [initCounterNumber, setInitCounterNumber] = useState(0);
  const [counter, setCounter] = useState(0);
  const [pause, setPause] = useState(false);
  const [onTop, setOnTop] = useState(false);

  const clickStartBtn = () => {
    setPause(false);
  };

  const clickPauseBtn = () => {
    setPause(true);
  };

  const submitInitCounter = () => {
    setCounter(initCounterNumber);
  };

  const onShortcutActive = () => {
    if (!pause) {
      setCounter(counter + 1);
    }
  };

  const resetCounter = () => {
    setCounter(initCounterNumber);
  };

  const setAlwaysOnTop = () => {
    setOnTop(!onTop);
    window.electron.ipcRenderer.sendMessage('set-always-on-top', [onTop]);
  };

  window.electron.ipcRenderer.on('save-shortcut-detected', () => {
    onShortcutActive();
  });

  return (
    <div className="wrapper">
      <div className="left">
        <button type="button" onClick={clickStartBtn}>
          开始
        </button>
        <button type="button" onClick={clickPauseBtn}>
          暂停
        </button>
        <input
          className="init-counter-input"
          type="number"
          placeholder="从多少开始计数"
          min={0}
          value={initCounterNumber}
          onChange={(val) => setInitCounterNumber(Number(val.target.value))}
        />
      </div>
      <div className="center">
        <p className="counter-line">计数：{counter}</p>
      </div>
      <div className="right">
        <button type="button" onClick={submitInitCounter}>
          设置
        </button>
        <button type="button" onClick={resetCounter}>
          重置
        </button>
        <button type="button" onClick={setAlwaysOnTop}>
          {onTop ? '置顶' : '不置顶'}
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
