import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [baseUnit, setBaseUnit] = useState("btc");
  const [quoteUnit, setQuoteUnit] = useState("inr");
  const [cryptoData, setCryptoData] = useState({
    buyPrice: 0,
    sellPrice: 0,
    lastPrice: 0,
    difference: 0,
    savings: 0,
  });

  const fetchData = async (baseUnit = "btc", quoteUnit = "inr") => {
    try {
      const response = await fetch(
        `/api/tickers?base_unit=${baseUnit}&quote_unit=${quoteUnit}`
      );
      const data = await response.json();

      const buyPrice = parseFloat(data.buy);
      const sellPrice = parseFloat(data.sell);
      const lastPrice = parseFloat(data.last);
      const avgNetPrice = (buyPrice + sellPrice) / 2;
      const difference = ((lastPrice - avgNetPrice) / avgNetPrice) * 100;
      const savings = lastPrice - buyPrice;

      setCryptoData({
        buyPrice,
        sellPrice,
        lastPrice,
        difference,
        savings,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(baseUnit, quoteUnit);
    const interval = setInterval(() => {
      fetchData(baseUnit, quoteUnit);
    }, 45000);

    return () => clearInterval(interval);
  }, [baseUnit, quoteUnit]);

  return (
    <div className=" m-0 p-0 text-white">
      <div className="top flex justify-between items-center text-[#83c8ca] px-[10px] py-[20px]">
        <div className="top-left">
          <h1 className="text-center mx-[20px] my-[0px] text-4xl">HODLININFO</h1>
        </div>
        <div className="top-middle flex-1 flex justify-around">
          <div className="middle-bars">
            <select
              className="px-[10px] py-[5px] text-[16px] rounded-md mx-[5px] cursor-pointer bg-[#68c3c0] text-white"
              id="left"
              value={quoteUnit}
              onChange={(e) => setQuoteUnit(e.target.value)}
            >
              <option value="inr">INR</option>
            </select>

            <select
              className="px-[10px] py-[5px] text-[16px] rounded-md mx-[5px] cursor-pointer bg-[#68c3c0] text-white"
              id="middle"
              value={baseUnit}
              onChange={(e) => setBaseUnit(e.target.value)}
            >
              <option value="btc">BTC</option>
              <option value="usdt">USDT</option>
              <option value="eth">ETH</option>
            </select>

            <button
              className="px-[10px] py-[5px] text-[16px] rounded-md mx-[5px] cursor-pointer bg-[#68c3c0] text-white"
              id="buy-btn"
            >
              BUY BTC
            </button>
          </div>
        </div>
        <div className="top-right flex items-center">
          <button
            className="px-[10px] py-[5px] text-[16px] rounded-md cursor-pointer bg-[#68c3c0] text-white"
            id="tele-btn"
          >
            Connect Telegram
          </button>
          <button
            id="dark-mode-toggle"
            className="px-[10px] py-[5px] text-[16px] rounded-md mx-[5px] cursor-pointer bg-[#68c3c0] text-white"
            onClick={() => document.body.classList.toggle("dark-mode")}
          >
            Dark Mode
          </button>
        </div>
      </div>

      <div className="middle-part w-[80%] m-auto overflow-hidden">
        <div className="detail">Best Price to Trade:</div>
        <div className="detail-account flex justify-between items-center text-[#83c8ca] px-[10px] py-[20px]">
          <div id="detail-show" className="mt-[2%]">
            <h2>0.14 %</h2>
            <p>5 min</p>
          </div>
          <div className="mt-[2%]" id="detail-show">
            <h2>9.71 %</h2>
            <p>5 min</p>
          </div>

          <h1 className="text-center mb-[20px] text-[80px]" id="detail-price">
            ₹ {cryptoData.buyPrice.toFixed(2)}
          </h1>

          <div className="mt-[2%]" id="detail-show">
            <h2>0.53 %</h2>
            <p>5 min</p>
          </div>
          <div className="mt-[2%]" id="detail-show">
            <h2>10.57 %</h2>
            <p>5 min</p>
          </div>
        </div>

        <p id="best-price" className="text-center text-[18px] mb-[30px]">
          Average BTC/INR net price including commission
        </p>

        <table className="w-[100%] border-collapse mb-[20px] text-[24px]">
          <thead>
            <tr className="p-[10px] text-center text-[30px] ">
              <th>#</th>
              <th>Platform</th>
              <th>Last Traded Price</th>
              <th>Buy / Sell Price</th>
              <th>Difference</th>
              <th>Savings</th>
            </tr>
          </thead>
          <tbody>
            <tr className="p-[10px] text-center bg-slate-900 rounded-md" id="crypto">
              <td>1</td>
              <td id="crypto-platform">WazirX</td>
              <td id="crypto-last">₹ {cryptoData.lastPrice.toFixed(2)}</td>
              <td id="crypto-buy-sell">
                ₹ {cryptoData.buyPrice.toFixed(2)} / ₹{" "}
                {cryptoData.sellPrice.toFixed(2)}
              </td>
              <td
                id="crypto-difference"
                className={cryptoData.difference >= 0 ? "green-colour" : "red-colour"}
              >
                {cryptoData.difference.toFixed(2)}%
              </td>
              <td
                id="crypto-savings"
                className={cryptoData.savings >= 0 ? "green-colour" : "red-colour"}
              >
                ₹ {cryptoData.savings.toFixed(2)}
              </td>
            </tr>
            <tr className="p-[10px] text-center bg-slate-900 rounded-md">
              <td>2</td>
              <td>Bitbns</td>
              <td>₹ 4994605</td>
              <td>₹ 4925166 / ₹ 4994651</td>
              <td className="red-colour">-9.09%</td>
              <td className="red-colour">₹ 499394</td>
            </tr>
            <tr className="p-[10px] text-center bg-slate-900 rounded-md">
              <td>3</td>
              <td>Colodax</td>
              <td>₹ 5574852</td>
              <td>₹ 5524229 / ₹ 6138033</td>
              <td className="green-colour">1.47%</td>
              <td className="green-colour">₹ 80852</td>
            </tr>
            <tr className="p-[10px] text-center bg-slate-900 rounded-md">
              <td>4</td>
              <td>Zebpay</td>
              <td>₹ 5684399</td>
              <td>₹ 5684499 / ₹ 5684399</td>
              <td className="green-colour">3.47%</td>
              <td className="green-colour">₹ 190398</td>
            </tr>
            
            <tr className="p-[10px] text-center bg-slate-900 rounded-md ">
              
              <td>5</td>
              <td>CoinDCX</td>
              <td>₹ 5655046</td>
              <td>₹ 5650195 / ₹ 5674000</td>
              <td className="green-colour">2.93%</td>
              <td className="green-colour">₹ 161046</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
