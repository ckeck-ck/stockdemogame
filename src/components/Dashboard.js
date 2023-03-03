import React, { useState, useEffect, useRef, useCallback } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Input,
  Button,
} from "@mui/material";

function Dashboard() {
  // state hooks to manage game data
  const [stockData, setStockData] = useState([{ time: 0, price: 100 }]);
  const [spread, setSpread] = useState(1);
  const [gameMoney, setGameMoney] = useState(50000);
  const [stockHoldings, setStockHoldings] = useState(0);
  const [currentTrend, setCurrentTrend] = useState("Neutral");
  const [profitLoss, setProfitLoss] = useState(0);
  const [askPrice, setAskPrice] = useState(0);
  const [bidPrice, setBidPrice] = useState(0);
  const [timer, setTimer] = useState(null);

  // state hooks to manage game time
  const [gameTime, setGameTime] = useState(10 * 60);
  const [gameOver, setGameOver] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [initialPrice, setInitialPrice] = useState(100);
  const [initialAskPrice, setInitialAskPrice] = useState(100);
  const [initialBidPrice, setInitialBidPrice] = useState(99);
  const [initialTrend, setInitialTrend] = useState("Neutral");
  const [sellOrder, setSellOrder] = useState(0);
  const [buyOrder, setBuyOrder] = useState(0);
  const [finalProfitLoss, setFinalProfitLoss] = useState(0);


  // input refs
  const buyInputRef = useRef(null);
  const sellInputRef = useRef(null);

  // chart ref
  const chartRef = useRef(null);

  // options for Highcharts chart
  const chartOptions = {
    chart: {
      type: "line",
      height: 200,
      zoomType: "x",
    },
    title: {
      text: null,
    },
    xAxis: {
      title: {
        text: "Zeit (Minuten)",
      },
      min: 0,
      max: 10,
      tickInterval: 1,
      labels: {
        formatter: function () {
          return this.value + "min";
        },
      },
    },
    yAxis: {
      title: {
        text: "Preis",
      },
      labels: {
        formatter: function () {
          return "€" + this.value.toFixed(2);
        },
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      formatter: function () {
        return (
          "Time: " +
          this.x +
          "m<br>" +
          "Bid Price: €" +
          this.points[0].y.toFixed(2) +
          "<br>" +
          "Ask Price: €" +
          this.points[1].y.toFixed(2)
        );
      },
      shared: true,
    },
    series: [
      {
        name: "Briefkurs",
        data: stockData.map((d) => [d.time / 60, d.price]),
        color: "#00bfff",
      },
      {
        name: "Geldkurs",
        data: stockData.map((d) => [d.time / 60, d.askPrice]),
        color: "#000000",
      },
    ],
    exporting: {
      buttons: {
        zoom: {
          text: "Reset Zoom",
          onclick: function () {
            this.zoomOut();
          },
        },
      },
    },
  };



  const handlePriceChange = useCallback((newPrice) => {
    setStockData((prevData) => [...prevData, { time: prevData.length, price: newPrice, askPrice: newPrice + spread },]);

    // update bid and ask prices
    setBidPrice(newPrice);
    setAskPrice(newPrice + spread);

    // check if price has increased or decreased three times in a row
    const lastThreePrices = stockData.slice(-3).map(data => data.price);
    const currentPrice = lastThreePrices[2];
    const previousPrice = lastThreePrices[1];
    const priceBeforeThat = lastThreePrices[0];
    if (currentPrice < previousPrice && previousPrice < priceBeforeThat) {
      setCurrentTrend("Bärenmarkt");
    } else if (currentPrice > previousPrice && previousPrice > priceBeforeThat) {
      setCurrentTrend("Bullenmarkt");
    } else {
      setCurrentTrend("Neutral");
    }
  }, [spread, stockData])


  useEffect(() => {
    if (!gameRunning) {
      setBidPrice(initialBidPrice);
      setAskPrice(initialAskPrice);
      setCurrentTrend(initialTrend);
      return;
    }
    const interval = setInterval(() => {
      // generate random price change
      const randomChange = Math.random() * (0.05 - 0.01) + 0.01;
      const direction = Math.random() < 0.5 ? -1 : 1;
      const newPrice =
        stockData[stockData.length - 1].price + randomChange * direction;

      // calculate ask price based on spread
      const askPrice = newPrice + spread;

      // update current trend
      if (newPrice > stockData[stockData.length - 1].price) {
        setCurrentTrend("Bullenmarkt");
      } else if (newPrice < stockData[stockData.length - 1].price) {
        setCurrentTrend("Bärenmarkt");
      } else {
        setCurrentTrend("Neutral");
      }

      // update bid and ask prices
      setBidPrice(newPrice - spread);
      setAskPrice(askPrice);

      // add new data point to time series
      setStockData((prevData) => [...prevData, { time: prevData.length, price: newPrice, askPrice: askPrice },]);

      // update game time and end game if time is up
      setGameTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          setGameOver(true);
          setGameRunning(false);
          setTimer(null);
          return 0;
        }
        return prevTime - 1;
      });

      // update profit/loss
      handlePriceChange(newPrice - spread);

    }, 1000);

    // stop game after 10 minutes
    setTimeout(() => {
      clearInterval(interval);
      setGameOver(true);
      setGameRunning(false);
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [stockData, spread, timer, gameRunning, initialBidPrice, initialAskPrice, initialTrend, handlePriceChange,]);



  // update of prices when data is updated:
  useEffect(() => {
    if (stockData.length > 0) {
      const lastPrice = stockData[stockData.length - 1].price;
      setBidPrice(lastPrice);
      setAskPrice(lastPrice + spread);
    }
  }, [stockData, spread]);




  // function to start game, setting timer and stock data to initial values.
  const handleStartGame = () => {
    if (!gameRunning) {
      setGameOver(false);
      setGameTime(10 * 60);
      setStockData([{ time: 0, price: initialBidPrice, askPrice: initialAskPrice }]);
      setGameMoney(50000);
      setStockHoldings(0);
      setProfitLoss(0);
      setGameRunning(true);
      setTimer(
        setInterval(() => {
          // generate random price change
          const randomChange = Math.random() * (0.05 - 0.01) + 0.01;
          const direction = Math.random() < 0.5 ? -1 : 1;
          const newPrice =
            stockData[stockData.length - 1].price + randomChange * direction;
          // calculate ask price based on spread
          const askPrice = newPrice + spread;

          // update current trend
          if (newPrice > stockData[stockData.length - 1].price) {
            setCurrentTrend("Bullenmarkt");
          } else if (newPrice < stockData[stockData.length - 1].price) {
            setCurrentTrend("Bärenmarkt");
          } else {
            setCurrentTrend("Neutral");
          }

          // add new data point to time series
          setStockData((prevData) => [...prevData, { time: prevData.length, price: newPrice, askPrice: askPrice },]);

          // update game time and end game if time is up
          setGameTime((prevTime) => {
            if (prevTime <= 0) {
              clearInterval(timer);
              setGameOver(true);
              setGameRunning(false);
              setTimer(null);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000));

      // stop game after 10 minutes
      setTimeout(() => {
        clearInterval(timer);
        setGameOver(true);
        setGameRunning(false);
      }, 10 * 60 * 1000);
    }
  };

  // Reset game data and stop timer
  const handleStopGame = () => {
    clearInterval(timer);
    setGameOver(true);
    setGameRunning(false);
    setTimer(null);
    setGameTime(10 * 60);
    setStockData([{ time: 0, price: 100 }]);
    setGameMoney(50000);
    setStockHoldings(0);
    const totalCost = stockData[0].price * stockHoldings;
    const currentValue = (bidPrice - spread) * stockHoldings;
    const profitLoss = currentValue - totalCost;
    setProfitLoss(profitLoss);
    setBidPrice(initialBidPrice);
    setAskPrice(initialAskPrice);
    setCurrentTrend(initialTrend);
  };



  // Buy stocks and update game data
  const handleBuy = (e) => {
    e.preventDefault();
    const numShares = parseInt(buyInputRef.current.value, 10);
    const orderValue = stockData[stockData.length - 1].price * numShares;
    const commission = Math.max(
      9.99,
      Math.min(59.99, 0.0025 * orderValue + 4.95)
    );
    const totalCost = orderValue + commission;
    if (totalCost <= gameMoney) {
      setStockHoldings((prevHoldings) => prevHoldings + numShares);
      setGameMoney((prevMoney) => prevMoney - totalCost);
    }
  };

  // update buyOrder when buyInputRef changes
  useEffect(() => {
    if (buyInputRef.current) {
      const numShares = parseInt(buyInputRef.current.value, 10);
      if (numShares <= 0) {
        return;
      }
      const orderValue = stockData[stockData.length - 1].price * numShares;
      const commission = Math.max(
        9.99,
        Math.min(59.99, 0.0025 * orderValue + 4.95)
      );
      const totalCost = orderValue + commission;
      setBuyOrder(totalCost);
    }
  }, [stockData]);

  // Sell stocks and update game data
  const handleSell = (e) => {
    e.preventDefault();
    const numShares = parseInt(sellInputRef.current.value, 10);
    if (numShares <= 0) {
      return;
    }
    const orderValue = stockData[stockData.length - 1].price * numShares;
    const commission = Math.max(
      9.99,
      Math.min(59.99, 0.0025 * orderValue + 4.95)
    );
    const totalProceeds = orderValue - commission;
    if (numShares <= stockHoldings) {
      setStockHoldings((prevHoldings) => prevHoldings - numShares);
      setGameMoney((prevMoney) => prevMoney + totalProceeds);
      setSellOrder(0);
    }
  };

  const handleSellInputChange = (e) => {
    const numShares = parseInt(e.target.value, 10);
    const orderValue = stockData[stockData.length - 1].price * numShares;
    const commission = Math.max(
      9.99,
      Math.min(59.99, 0.0025 * orderValue + 4.95)
    );
    const totalProceeds = orderValue - commission;
    setSellOrder(totalProceeds);
  };





  return (
    <Container maxWidth="md">
      <Box mt={3}>
        <Typography variant="h4" align="center" >
          Mustermann AG Aktien Preis
        </Typography>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartRef} />
      </Box>
      <Box mt={3}>
        <Typography variant="h6" align="center">Verbleibende Zeit</Typography>
        <Typography align="center">{`${Math.floor(gameTime / 60).toString().padStart(2, "0")}:${(gameTime % 60).toString().padStart(2, "0")}`}</Typography>
        <Divider />
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper style={{ display: "block" }}>
            <Typography variant="h6">Kontostand</Typography>
            <Typography>€{gameMoney.toFixed(2)}</Typography>
            <Typography variant="h6">Depot</Typography>
            <Typography>{stockHoldings} Aktien</Typography>
            <Divider />
            <Typography variant="h6">Aktuelle Preise</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography>Geldkurs:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">€{bidPrice.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Briefkurs:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">€{askPrice.toFixed(2)}</Typography>
              </Grid>
            </Grid>
            <Divider />
            <Divider />
            <Typography variant="h6">Aktuelle Marktsituation</Typography>
            <Typography>{currentTrend}</Typography>
            <Divider />
            {gameRunning ? (
              <>
                <Typography variant="h6">Gewinn/Verlust</Typography>
                <Typography style={{ color: gameMoney < 50000 ? "red" : "green" }}>
                  €{(stockHoldings * (bidPrice - spread) - gameMoney).toFixed(2)}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6">Abschliessender Gewinn / Verlust</Typography>
                <Typography>€{finalProfitLoss.toFixed(2)}</Typography>
              </>
            )}


          </Paper>
        </Grid>
        <br />
        <Grid item xs={12} md={8}>
          <Paper>
            <form onSubmit={handleBuy}>
              <FormControl fullWidth>
                <InputLabel htmlFor="buy-input">Kaufen</InputLabel>
                <Input id="buy-input" type="number" inputProps={{ min: "0" }} max={Math.floor(gameMoney / stockData[stockData.length - 1].price)} inputRef={buyInputRef} />
              </FormControl>
              <Button type="submit" variant="contained" color="primary" fullWidth>Kaufe Aktien für: {buyOrder.toFixed(2)}€</Button>
            </form>
          </Paper>
          <Paper>
            <form onSubmit={handleSell}>
              <FormControl fullWidth>
                <InputLabel htmlFor="sell-input">Verkaufen</InputLabel>
                <Input
                  id="sell-input"
                  type="number"
                  inputProps={{ min: "0" }}
                  max={stockHoldings}
                  inputRef={sellInputRef}
                  onChange={handleSellInputChange}
                />
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Aktien verkaufen für: {sellOrder.toFixed(2)}€
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
      <Paper>
        <Button type="button" variant="contained" color="primary" onClick={handleStartGame} fullWidth>Spiel starten</Button>
        <Button type="button" variant="contained" color="secondary" onClick={handleStopGame} fullWidth>Spiel beenden</Button>
      </Paper>
      {gameOver && <Typography variant="h3" align="center">Game Over</Typography>}
    </Container>
  );
}

export default Dashboard;


