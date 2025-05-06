import { useState } from "react";
import TodayGames from "./TodayGames";
import MostRecent from "./MostRecent";
import GameLookup from "./GameLookup";
import "./App.css";

function Select() {
  const [menu, setMenu] = useState(0);

  return (
    <div>
      <button onClick={() => setMenu(0)}>Today's Games</button>
      <button onClick={() => setMenu(1)}>Most Recent</button>
      <button onClick={() => setMenu(2)}>Search</button>
      <Main menu={menu} />
    </div>
  );
}

type MainProps = {
  menu: number;
};

function Main({ menu }: MainProps) {
  return (
    <>
      <div style={{ display: menu === 0 ? "block" : "none" }}>
        <TodayGames />
      </div>
      <div style={{ display: menu === 1 ? "block" : "none" }}>
        <MostRecent />
      </div>
      <div style={{ display: menu === 2 ? "block" : "none" }}>
        <GameLookup />
      </div>
    </>
  );
}

function App() {
  return (
    <>
      <h1>MLB ScoRHEgami</h1>
      <Select />
    </>
  );
}

export default App;
