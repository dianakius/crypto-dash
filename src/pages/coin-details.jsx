import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_COIN_API_URL;

const CoinDetailsPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        
        if (res.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a few minutes and try again.");
        }
        
        if (!res.ok) {
          throw new Error(`Failed to fetch coin data (${res.status})`);
        }
        
        const data = await res.json();
        console.log(data);
        setCoin(data);
      } catch (err) {
        console.error("Fetch error:", err);
        if (err.name === "TypeError" && err.message.includes("fetch")) {
          setError("Network error. Please check your connection or try again later.");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoin();
  }, [id]);

  return (
    <div className="coin-details-container">
      <Link to="/">Back To Home</Link>

      <h1 className="coin-details-title">
        {coin
          ? `${coin.name} (${coin.symbol?.toUpperCase?.()})`
          : "Coin Details"}
      </h1>

      {loading && <p>Loading...</p>}
      {error && (
        <div className="error">
          <p>{error}</p>
          <p>Try refreshing the page in a few minutes.</p>
        </div>
      )}

      {!loading && !error && coin && (
        <>
          <img
            src={coin.image?.large || coin.image?.small}
            alt={coin.name}
            className="coin-details-image"
          />

          {coin.description?.en && (
            <p>{coin.description.en.split(". ")[0] + "."}</p>
          )}

          <div className="coin-details-info">
            {coin.market_cap_rank && <h3>Rank: #{coin.market_cap_rank}</h3>}
            
            {coin.market_data?.current_price?.usd && (
              <h3>
                Current Price: $
                {coin.market_data.current_price.usd.toLocaleString()}
              </h3>
            )}
            
            {coin.market_data?.market_cap?.usd && (
              <h4>
                Market Cap: ${coin.market_data.market_cap.usd.toLocaleString()}
              </h4>
            )}
            
            {coin.market_data?.high_24h?.usd && (
              <h4>24h High: ${coin.market_data.high_24h.usd.toLocaleString()}</h4>
            )}
            
            {coin.market_data?.low_24h?.usd && (
              <h4>24h Low: ${coin.market_data.low_24h.usd.toLocaleString()}</h4>
            )}
            
            {coin.market_data?.price_change_24h && (
              <h4>
                24h Price Change: ${coin.market_data.price_change_24h.toFixed(2)}{" "}
                ({coin.market_data.price_change_percentage_24h?.toFixed(2) || "0"}%)
              </h4>
            )}
            
            {coin.market_data?.circulating_supply && (
              <h4>
                Circulating Supply:{" "}
                {coin.market_data.circulating_supply.toLocaleString()}
              </h4>
            )}
            
            <h4>
              Total Supply:{" "}
              {coin.market_data?.total_supply?.toLocaleString() || "N/A"}
            </h4>
          </div>
        </>
      )}

      {!loading && !error && !coin && <p>No data found!</p>}
    </div>
  );
};

export default CoinDetailsPage;