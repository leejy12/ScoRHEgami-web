import { useState } from "react";
import TodayGames from "./TodayGames";
import MostRecent from "./MostRecent";
import GameLookup from "./GameLookup";
import "./App.css";

function Select() {
  const [menu, setMenu] = useState(0);

  return (
    <div>
      <div className="nav-buttons">
        <button onClick={() => setMenu(0)}>Today's Games</button>
        <button onClick={() => setMenu(1)}>Most Recent</button>
        <button onClick={() => setMenu(2)}>Search</button>
      </div>
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
      <h2>What is ScoRHEgami?</h2>
      <p>
        ScoRHEgami project was inspired by{" "}
        <a href="https://nflscorigami.com">Scorigami</a>, which tracks unique
        score combinations in NFL games. While the NFL typically sees a handful
        of unique game scores each season, baseball presents a different
        challenge.
      </p>
      <p>
        With over 200,000 MLB games played, unique final scores have become
        extremely rare. ScoRHEgami takes a different approach by tracking unique
        combinations of <strong>R</strong>uns, <strong>H</strong>its, and{" "}
        <strong>E</strong>rrors (RHE) in MLB games.
      </p>
      <p>
        This project maintains a database of MLB games dating back to the 1901
        season, when complete box scores began being consistently recorded by
        Baseball Reference. When a game ends with a combination of runs, hits,
        and errors never before seen in MLB history, we call it a "ScoRHEgami"
        and announce it on our{" "}
        <a href="https://x.com/MLB_ScoRHEgami">Twitter/X account</a>.
      </p>

      <h2>Navigation Options</h2>
      <ul>
        <li>
          <strong>Today's Games</strong>: View the most recent game day's
          results and discover which games were ScoRHEgamis{" "}
        </li>
        <li>
          <strong>Most Recent</strong>: Browse through the latest games that
          were ScoRHEgamis{" "}
        </li>
        <li>
          <strong>Search</strong>: Look up specific RHE combinations to find out
          if they've occurred before and view all historical games that match
          your criteria.
        </li>
      </ul>

      <h2>Project Information</h2>
      <ul>
        <li>
          Source code for the{" "}
          <a href="https://github.com/leejy12/ScoRHEgami-web">frontend</a> (this
          website) and{" "}
          <a href="https://github.com/leejy12/ScoRHEgami">backend</a> (API and
          the Twitter Bot) is available on GitHub.
        </li>
        <li>
          Follow <a href="https://x.com/MLB_ScoRHEgami">@MLB_ScoRHEgami</a> on X
          (formerly Twitter) for real-time ScoRHEgami alerts.
        </li>
        <li>
          The backend system analyzes completed games, identifies new
          ScoRHEgamis, and automatically tweets updates.
        </li>
      </ul>
      <h2>Acknowledgements</h2>
      <ul>
        <li>
          Historical data provided by{" "}
          <a href="https://www.baseball-reference.com">Baseball Reference</a>.
        </li>
        <li>
          Real-time data provided by{" "}
          <a href="https://www.balldontlie.io/">Balldontlie API</a>.
        </li>
        <li>
          Concept inspired by Jon Bois' Scorigami and{" "}
          <a href="https://nflscorigami.com/">nflscorigami.com</a>.
        </li>
      </ul>
      <p>
        Created by Junyoung Lee. (
        <a href="https://github.com/leejy12">GitHub</a>,{" "}
        <a href="https://x.com/leejy31415">X</a>)
      </p>
      <footer>
        <div>
          <p>© {new Date().getFullYear()} Junyoung Lee</p>
        </div>
      </footer>
    </>
  );
}

export default App;
