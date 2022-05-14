import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import React, { useState, useEffect } from 'react';
import { SET_ALWAYS_ON_TOP, SAVE_SHORTCUT_DETECTED } from '../main/channel';

const sendMessage = (c: string, ...args: unknown[]) => {
  window.electron.ipcRenderer.sendMessage(c, args);
};

const Index = () => {
  const [initCounterNumber, setInitCounterNumber] = useState(0);
  const [counter, setCounter] = useState(0);
  const [counting, setCounting] = useState(true);
  const [onTop, setOnTop] = useState(false);

  useEffect(() => {
    sendMessage(SET_ALWAYS_ON_TOP, onTop);
  }, [onTop]);

  const onShortcutActive = () => {
    // FIXME 不知道为什么，每次点击暂停后，再次触发快捷键，总会先+1，下一次才会真正暂停。
    if (counting) {
      setCounter(counter + 1);
    }
  };

  window.electron.ipcRenderer.on(SAVE_SHORTCUT_DETECTED, () => {
    onShortcutActive();
  });

  const setAlwaysOnTop = () => {
    setOnTop(!onTop);
    sendMessage(SET_ALWAYS_ON_TOP, onTop);
  };

  const switchCounting = () => {
    setCounting(!counting);
  };

  const submitInitCounter = () => {
    setCounter(initCounterNumber);
  };

  const onEnterKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event && event.key === 'Enter') {
      submitInitCounter();
    }
  };

  const resetCounter = () => {
    setCounter(initCounterNumber);
  };

  return (
    <div className="wrapper">
      <div className="left">
        <button type="button" onClick={switchCounting}>
          {counting ? '点击暂停' : '点击开始'}
        </button>
        <input
          className="init-counter-input"
          type="number"
          placeholder="从多少开始计数"
          min={0}
          value={initCounterNumber}
          onBlur={submitInitCounter}
          onKeyUp={(e) => onEnterKeyUp(e)}
          onChange={(val) => setInitCounterNumber(Number(val.target.value))}
        />
      </div>
      <div className="center">
        <p className="counter-line">计数：{counter}</p>
      </div>
      <div className="right">
        <button type="button" onClick={resetCounter}>
          点击重置
        </button>
        <button type="button" onClick={setAlwaysOnTop}>
          {onTop ? '取消置顶' : '点击置顶'}
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </Router>
  );
}
