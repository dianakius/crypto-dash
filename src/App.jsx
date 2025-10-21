import { useState, useEffect } from "react";
import Coincard from "./components/CoinCard";
const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          `${API_URL}&order=market_cap_desc&per_page=10&page=1&sparkline=false`
        );
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        console.log(data);
        setCoins(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  return (
    <div>
      <h1 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img
          src="public/favicon.ico"
          alt="Rocket Icon"
          width={20}
          height={20}
        />
        Crypto Dash
      </h1>
      {!loading && !error && (
        <main className="grid">
          {coins.map((coin) => (
            <Coincard key={coin.id} coin={coin} />
          ))}
        </main>
      )}
    </div>
  );
};

export default App;
