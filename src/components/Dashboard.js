import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// import designs based on mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField'

const initialData = [
    { name: '5', bidPrice: 100, askPrice: 99 },
    { name: '10', bidPrice: 100.5, askPrice: 99.5 },
    { name: '15', bidPrice: 101, askPrice: 100 },
    { name: '20', bidPrice: 101.5, askPrice: 100.5 },
    { name: '25', bidPrice: 101, askPrice: 100 },
    { name: '30', bidPrice: 100.5, askPrice: 99.5 },
    { name: '35', bidPrice: 100, askPrice: 99 },
];

const getRandomPrice = (basePrice) => {
    const change = (Math.random() * 0.1 + 0.01) * (Math.random() < 0.5 ? -1 : 1);
    const newPrice = basePrice + change;
    return Math.max(0.1, newPrice);
};

const getRandomData = (initialData, bearish, bullish) => {
    let newBidPrice = initialData[initialData.length - 1].bidPrice;
    let newAskPrice = initialData[initialData.length - 1].askPrice;

    let newBearish = bearish > 0 ? bearish - 1 : Math.random() < 0.6 ? 2 : 0; // changed the probability to 0.6
    let newBullish = bullish > 0 ? bullish - 1 : Math.random() < 0.6 ? 2 : 0; // changed the probability to 0.6

    const newData = initialData.map((entry, index) => {
        if (index > 0) {
            if (newBearish > 0) {
                newBidPrice = getRandomPrice(newBidPrice);
            } else if (newBullish > 0) {
                newAskPrice = getRandomPrice(newAskPrice);
            } else {
                const offset = (Math.random() * 0.05) * (Math.random() < 0.5 ? -1 : 1);
                if (Math.random() < 0.5) {
                    newBidPrice = getRandomPrice(newBidPrice + offset);
                    newBearish = 2;
                } else {
                    newAskPrice = getRandomPrice(newAskPrice - offset);
                    newBullish = 2;
                }
            }
            return {
                ...entry,
                bidPrice: Number(newBidPrice.toFixed(2)),
                askPrice: Number(newAskPrice.toFixed(2)),
            };
        }
        return entry;
    });
    return { newData, newBearish, newBullish };
};


const getCommission = (orderValue, isBuy) => {
    const baseCommission = 4.95;
    const percentageCommission = orderValue * 0.0025;
    let commission = baseCommission + percentageCommission;

    if (commission < 9.99) {
        commission = 9.99;
    } else if (commission > 59.99) {
        commission = 59.99;
    }

    if (!isBuy) {
        commission = Math.min(commission, 0.5 * orderValue);
    }

    return commission.toFixed(2);
};






const Dashboard = () => {
    const [data, setData] = useState(initialData);
    const [balance, setBalance] = useState(50000);
    const [shares, setShares] = useState(0);
    const [commissions, setCommissions] = useState([]);
    const [bearish, setBearish] = useState(0);
    const [bullish, setBullish] = useState(0);
    const [gameRunning, setGameRunning] = useState(false);
    const [currentBid, setCurrentBid] = useState(initialData[0].bidPrice);
    const [currentAsk, setCurrentAsk] = useState(initialData[0].askPrice);
    const [gameDuration, setGameDuration] = useState(10 * 60); // 10 minutes
    const [gameOver, setGameOver] = useState(false);
    const [numSharesToBuy, setNumSharesToBuy] = useState(0);
    const [numSharesToSell, setNumSharesToSell] = useState(0);
    const [buyPrice, setBuyPrice] = useState(null);




    // Function to decrement game duration every secand and end game when time is up
    // initialize before first use in useEffect hook
    const tick = () => {
        setGameDuration(prevDuration => prevDuration - 1);
        if (gameDuration === 0) {
            endGame();
        }
    };

    // using hook to set an interval to 1 second
    useEffect(() => {
        let intervalId
        if (gameRunning) {
            intervalId = setInterval(() => {
                const { newData, newBearish, newBullish } = getRandomData(data, bearish, bullish);
                setData(newData);
                setBearish(newBearish);
                setBullish(newBullish);
                setCurrentBid(newData[newData.length - 1].bidPrice);
                setCurrentAsk(newData[newData.length - 1].askPrice);

            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [data, bearish, bullish, gameRunning]);

    // Using the useEffect hook to call tick function every second
    useEffect(() => {
        const timerId = setTimeout(() => {
            tick();
        }, 1000);
        return () => {
            clearTimeout(timerId);
        };
    }, [gameDuration, tick]);

    // function to buy shares based on the input value for number of shares
    const buyStocks = () => {
        const orderValue = numSharesToBuy * currentBid;
        const commission = Number(getCommission(orderValue, true));
        const newBalance = balance - orderValue - commission;
        setBalance(newBalance);
        setShares(shares + numSharesToBuy);
        setBuyPrice(currentBid); // set buy price to current bid price
        setCommissions([...commissions, { shares: numSharesToBuy, price: currentBid, commission: commission }]);
    };


    // function to sell shares based on input value for shares
    const sellStocks = (numShares) => {
        const sharesToSell = Math.min(numShares, shares);
        const orderValue = sharesToSell * data[0].askPrice;
        const commission = Number(getCommission(orderValue, false));
        const newBalance = balance + orderValue - commission;
        setBalance(newBalance);
        setShares(shares - sharesToSell);
        setCommissions([...commissions, { shares: sharesToSell, price: data[0].askPrice, commission }]);
        setNumSharesToSell(0);
    };



    const buyButton = (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
                type="number"
                label="Number of Shares"
                value={numSharesToBuy}
                onChange={(event) => setNumSharesToBuy(event.target.value)}
                inputProps={{ min: 0 }} // add min prop to disallow negative values
                margin="normal"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={buyStocks}
                disabled={numSharesToBuy <= 0 || balance < numSharesToBuy * currentBid}     // disable button if number of shares is below 0 or higher than the current balance
                margin="normal"
            >
                Buy {numSharesToBuy} shares for {currentBid.toFixed(2)} € each
            </Button>
        </Box>
    );


    // function for sell button with condition, if no stocks bought, don't show button
    const sellButton = shares > 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
                type="number"
                label="Number of Shares"
                value={numSharesToSell}
                onChange={(event) => setNumSharesToSell(event.target.value)}
                inputProps={{ min: 0, max: shares }} // add min and max props to disallow negative values and values greater than owned shares
                margin='normal'
            />
            <Button
                variant="contained"
                color="primary"
                onClick={() => sellStocks(numSharesToSell)}
                disabled={numSharesToSell <= 0}     //disable if number of shares is below or equal 0
                margin='normal'
            >
                Sell {numSharesToSell === shares ? 'all' : numSharesToSell} shares for {data[0].askPrice.toFixed(2)} € each
            </Button>
        </Box>
    ) : null;


    // function to display the current market situation
    const marketSituation = () => {
        if (bearish > 0 && bullish > 0) {
            return 'Neutral';
        } else if (bearish > 0) {
            return 'Bearish';
        } else if (bullish > 0) {
            return 'Bullish';
        } else {
            return '';
        }
    }



    // Function to reset game to have a clean new initialization
    const resetGame = () => {
        setData(initialData);
        setBalance(50000);
        setShares(0);
        setCommissions(0);
        setBearish(0);
        setBullish(0);
        setGameRunning(false);
        setGameOver(false);
        setGameDuration(10 * 60); // reset game duration to 10 minutes
    };


    const startGame = () => {
        resetGame();
        setGameRunning(true);
    };

    const endGame = () => {
        const profitLoss = (shares * data[0].askPrice - commissions.reduce((acc, c) => acc + c.commission, 0)).toFixed(2);
        alert(`Game over! Your profit/loss: ${profitLoss} €`);
        setGameRunning(false);
        setGameOver(true);
    };




    return (
        <Container maxWidth="md">
            <Box mt={3}>
                <Typography variant="h4" align="center" gutterBottom>
                    Mustermann AG Stock Price
                </Typography>
                <Plot
                    data={[
                        {
                            x: data.map(entry => entry.name),
                            y: data.map(entry => entry.bidPrice),
                            type: 'scatter',
                            mode: 'lines+markers',
                            name: 'Bid Price',
                            marker: { color: '#00a152' },
                            line: { shape: 'spline' }
                        },
                        {
                            x: data.map(entry => entry.name),
                            y: data.map(entry => entry.askPrice),
                            type: 'scatter',
                            mode: 'lines+markers',
                            name: 'Ask Price',
                            marker: { color: '#ffbe3d' },
                            line: { shape: 'spline' }
                        },
                    ]}
                    layout={{
                        width: 800,
                        height: 400,
                        title: 'Stock Price',
                        xaxis: { title: 'Time (s)' },
                        yaxis: { title: 'Price (€)' }
                    }}
                    config={{
                        animation: { frames: { duration: 1000 / 30 } }
                    }}
                />
            </Box>
            <Box mt={3}>
                <Typography variant="h5" gutterBottom>
                    Game Information
                </Typography>
                <Typography variant='h6'>
                    <br />
                    Market situation {marketSituation()}
                    <br />
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                            Starting balance: {balance.toFixed(2)} €
                            <br />
                            Current number of shares: {shares.toString()}
                            <br />
                            {commissions.length > 0 && (
                                <>
                                    Commissions paid:
                                    <ul>
                                        {commissions.map((c, index) => (
                                            <li key={index}>
                                                {c.shares} shares bought for {c.price.toFixed(2)} € each, commission: {c.commission.toFixed(2)} €
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                            Current bid price: {currentBid.toFixed(2)} €
                            <br />
                            Current ask price: {currentAsk.toFixed(2)} €
                        </Typography>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 3 }}>
                    {gameRunning ? (
                        <>
                            {buyButton}
                            {sellButton}
                            <Button variant="contained" color="secondary" sx={{ ml: 2 }} onClick={endGame}>
                                End game
                            </Button>
                        </>
                    ) : (
                        <Button variant="contained" color="primary" onClick={startGame}>
                            Start game
                        </Button>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default Dashboard;