/* global chrome */ 

import { useState, useEffect } from "react";

import "./App.css";

const getHours = (seconds: number) => Math.floor(seconds / 60 / 60).toString().padStart(2, '0');
const getMinutes = (seconds: number) => Math.floor(seconds / 60 % 60).toString().padStart(2, '0');
const getSeconds = (seconds: number) => Math.floor(seconds % 60).toString().padStart(2, '0');

export default function App() {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    chrome.storage.sync.get(function (result) {
      const startDate = new Date(result["wt-start"]);
      const endDate = result["wt-end"] ? new Date(result["wt-end"]) : new Date();
      
      setSecondsElapsed(Math.abs(endDate.valueOf() - startDate.valueOf()) / 1000);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed(previous => previous + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [setSecondsElapsed]);
  
  return (
    <div className="App">
      <div className="App__section">
        <div className="App__tile">
            {getHours(secondsElapsed)}
        </div>

        <span className="App__label">
          Hours
        </span>
      </div>

      <div className="App__section">
        <div className="App__tile">
            {getMinutes(secondsElapsed)}
        </div>

        <span className="App__label">
          Minutes
        </span>
      </div>

      <div className="App__section">
        <div className="App__tile">
            {getSeconds(secondsElapsed)}
        </div>

        <span className="App__label">
          Seconds
        </span>
      </div>
    </div>
  );
}