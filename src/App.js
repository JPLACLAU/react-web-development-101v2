import React, { useEffect, useState } from "react";
import CoinList from "./components/CoinList/CoinList";
import ExchangeHeader from "./components/ExchangeHeader/ExchangeHeader";
import AccountBalance from "./components/AccountBalance/AccountBalance";
import styled from "styled-components";
import axios from "axios";
//import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/flatly/bootstrap.min.css";
import "@fortawesome/fontawesome-free/js/all";

const Div = styled.div`
  text-align: center;
  background-color: #152c5c;
  color: #cccccc;
`;

const COIN_COUNT = 10;
const formatPrice = (price) => parseFloat(Number(price).toFixed(4));

function App(props) {
  const [balance, setBalance] = useState(10000);
  const [showBalance, setShowBalance] = useState(true);
  const [coinData, setCoinData] = useState([]);

  const componentDidMount = async () => {
    const response = await axios.get("https://api.coinpaprika.com/v1/coins");
    const coinIds = response.data.slice(0, COIN_COUNT).map((coin) => coin.id);
    const ticketURL = "https://api.coinpaprika.com/v1/tickers/";
    const promises = coinIds.map((id) => axios.get(ticketURL + id));
    const coinData = await Promise.all(promises);
    const coinPriceData = coinData.map(function (response) {
      const coin = response.data;
      return {
        key: coin.id,
        name: coin.name,
        ticker: coin.symbol,
        balance: 0,
        price: formatPrice(coin.quotes.USD.price),
      };
    });

    setCoinData(coinPriceData);
  };

  useEffect(function () {
    if (coinData.length === 0) {
      // component did mount
      componentDidMount();
    }
  });

  const handleBalanceVisibilityChance = () => {
    setShowBalance((oldValue) => !oldValue);
  };

  const handleBrrr = () => {
    setBalance((oldBalance) => oldBalance + 1000);
  };

  const handleBuy = (valueChangeKey) => {
    const newCoinData = coinData.map((values) => {
      let newValues = { ...values };
      if (valueChangeKey === values.key) {
        if (balance < newValues.price) {
          alert("You dont have enough balance");
        } else {
          newValues.balance += 1;
          setBalance((balance) => formatPrice((balance -= newValues.price)));
        }
      }
      return newValues;
    });
    setCoinData(newCoinData);
  };

  const handleSell = (valueChangeKey) => {
    const newCoinData = coinData.map((values) => {
      let newValues = { ...values };
      if (valueChangeKey === values.key) {
        if (newValues.balance <= 0) {
          alert("You dont have enough balance");
        } else {
          newValues.balance -= 1;
          setBalance((balance) => formatPrice((balance += newValues.price)));
        }
      }
      return newValues;
    });
    setCoinData(newCoinData);
  };

  const handleRefresh = async (valueChangeId) => {
    const ticketURL = `https://api.coinpaprika.com/v1/tickers/${valueChangeId}/`;
    const response = await axios.get(ticketURL);
    const newPrice = formatPrice(response.data.quotes.USD.price);
    const newCoinData = coinData.map(function (values) {
      let newValues = { ...values };
      if (valueChangeId === values.key) {
        newValues.price = newPrice;
      }
      return newValues;
    });
    setCoinData(newCoinData);
  };

  return (
    <Div>
      <ExchangeHeader />
      <AccountBalance
        amount={balance}
        showBalance={showBalance}
        handleBalanceVisibilityChance={handleBalanceVisibilityChance}
        handleBrrr={handleBrrr}
      />
      <CoinList
        coinData={coinData}
        showBalance={showBalance}
        handleBuy={handleBuy}
        handleSell={handleSell}
        handleRefresh={handleRefresh}
      />
    </Div>
  );
}

export default App;
