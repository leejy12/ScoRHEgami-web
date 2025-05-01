import { useState } from "react";
import GameLookup from "./GameLookup";
import TodayGames from "./TodayGames";
import "./App.css";
import MostRecent from "./MostRecent";

function Select() {
  const [menu, setMenu] = useState(0);

  return (
    <div>
      <button onClick={() => setMenu(0)}>Today's Games</button>
      <button onClick={() => setMenu(1)}>Most Recent</button>
      <button onClick={() => setMenu(2)}>Most Common</button>
      <button onClick={() => setMenu(3)}>Search</button>
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
        <p>2</p>
      </div>
      <div style={{ display: menu === 3 ? "block" : "none" }}>
        <GameLookup />
      </div>
    </>
  );
}

function App() {
  return (
    <>
      <h1>Welcome to my app</h1>
      <Select />
    </>
  );
}

export default App;
