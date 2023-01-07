import React from "react";
import CoinList from "./components/CoinList/CoinList";
import ExchangeHeader from "./components/ExchangeHeader/ExchangeHeader";
import AccountBalance from "./components/AccountBalance/AccountBalance";
import { uuid } from "uuidv4";
import styled from "styled-components";
import axios from "axios";

const Div = styled.div`
  text-align: center;
  background-color: #152c5c;
  color: #cccccc;
`;

const COIN_COUNT = 10;

class App extends React.Component {
  state = {
    balance: 10000,
    showBalance: true,
    coinData: [
      /*      {
        name: "Bitcoin",
        ticker: "BTC",
        balance: 0.5,
        price: 16600.59,
      },
      {
        name: "Ethereum",
        ticker: "ETH",
        balance: 1.5,
        price: 1201.48,
      },
      {
        name: "Tether",
        ticker: "USDT",
        balance: 500,
        price: 1.0,
      },
      {
        name: "Ripple",
        ticker: "XRP",
        balance: 0,
        price: 0.2,
      },
      {
        name: "BTC Cash",
        ticker: "BCH",
        balance: 0,
        price: 0.01,
      },
    */
    ],
  };
  componentDidMount = async () => {
    const response = await axios.get("https://api.coinpaprika.com/v1/coins");
    const coinIds = response.data.slice(0, COIN_COUNT).map((coin) => coin.id);
    const ticketURL = "https://api.coinpaprika.com/v1/tickers/";
    const promises = coinIds.map((id) => axios.get(ticketURL + id));
    const coinData = await Promise.all(promises);
    const coinPriceData = coinData.map(function (response) {
      const coin = response.data;
      return {
        key: coin.ide,
        name: coin.name,
        ticker: coin.symbol,
        balance: 0,
        price: coin.quotes.USD.price,
      };
    });

    this.setState({ coinData: coinPriceData });
  };

  handleBalanceVisibilityChance = () => {
    this.setState(function (oldState) {
      return {
        ...oldState,
        showBalance: !oldState.showBalance,
      };
    });
  };
  handleRefresh = (valueChangeTicker) => {
    const newCoinData = this.state.coinData.map(function ({
      ticker,
      name,
      price,
      balance,
    }) {
      let newPrice = price;
      if (valueChangeTicker === ticker) {
        const randomPercentage = 0.0995 + Math.random() * 0.01;
        newPrice = newPrice * randomPercentage;
      }
      return {
        ticker,
        name,
        price: newPrice,
        balance,
      };
    });
    this.setState({ coinData: newCoinData });
  };

  render() {
    return (
      <Div>
        <ExchangeHeader />
        <AccountBalance
          amount={this.state.balance}
          showBalance={this.state.showBalance}
          handleBalanceVisibilityChance={this.handleBalanceVisibilityChance}
        />
        <CoinList
          coinData={this.state.coinData}
          showBalance={this.state.showBalance}
          handleRefresh={this.handleRefresh}
        />
      </Div>
    );
  }
}

export default App;
