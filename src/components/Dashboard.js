import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// import designs based on mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

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

    const newBearish = bearish > 0 ? bearish - 1 : Math.random() < 0.6 ? 2 : 0; // changed the probability to 0.6
    const newBullish = bullish > 0 ? bullish - 1 : Math.random() < 0.6 ? 2 : 0; // changed the probability to 0.6

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


const getCommission = (orderValue) => {
    const baseCommission = 4.95;
    const percentageCommission = orderValue * 0.0025;
    const commission = Math.max(9.99, Math.min(59.99, baseCommission + percentageCommission));
    return commission.toFixed(2);
};

const Dashboard = () => {
    const [data, setData] = useState(initialData);
    const [balance, setBalance] = useState(50000);
    const [shares, setShares] = useState(0);
    const [commission, setCommission] = useState(0);
    const [bearish, setBearish] = useState(0);
    const [bullish, setBullish] = useState(0);
    const [gameRunning, setGameRunning] = useState(false);
    const [currentBid, setCurrentBid] = useState(initialData[0].bidPrice);
    const [currentAsk, setCurrentAsk] = useState(initialData[0].askPrice);

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

    const buyStocks = (numShares) => {
        const orderValue = numShares * data[0].bidPrice;
        const newBalance = balance - orderValue - Number(getCommission(orderValue));
        setBalance(newBalance);
        setShares(shares + numShares);
        setCommission(commission + Number(getCommission(orderValue)));
    };

    const sellStocks = (numShares) => {
        const orderValue = numShares * data[0].askPrice;
        const newBalance = balance + orderValue - Number(getCommission(orderValue));
        setBalance(newBalance);
        setShares(shares - numShares);
        setCommission(commission + Number(getCommission(orderValue)));
    };

    const sellButton = shares > 0 ? (
        <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={() => sellStocks(10)} disabled={shares <= 0}>
            Sell 10 shares for {data[0].askPrice.toFixed(2)} € each
        </Button>
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

    const startGame = () => {
        setData(initialData);
        setBalance(50000);
        setShares(0);
        setCommission(0);
        setBearish(0);
        setBullish(0);
        setGameRunning(true);
    };

    const endGame = () => {
        const profitLoss = (shares * data[0].askPrice - commission - 50000).toFixed(2);
        alert(`Game over! Your profit/loss: ${profitLoss} €`);
        setGameRunning(false);
    };

    return (
        <Container maxWidth="md">
            <Box mt={3}>
                <Typography variant="h4" align="center" gutterBottom>
                    Mustermann AG Stock Price
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                        <XAxis dataKey="name" domain={['dataMin', 'dataMax']} />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="bidPrice" stroke="#00a152" connectNulls activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="askPrice" stroke="#ffbe3d" connectNulls activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
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
                            Current number of shares: {shares}
                            <br />
                            Current commission: {commission.toFixed(2)} €
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
                            <Button variant="contained" color="primary" onClick={() => buyStocks(10)}>
                                Buy 10 shares for {data[0].bidPrice.toFixed(2)} € each
                            </Button>
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