import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// import designs
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';



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
    const change = (Math.random() * 0.05 + 0.01) * (Math.random() < 0.5 ? -1 : 1);
    const newPrice = basePrice + change;
    return Math.max(0.1, newPrice);
};

const getRandomData = (initialData, bearish, bullish) => {
    let newBidPrice = initialData[initialData.length - 1].bidPrice;
    let newAskPrice = initialData[initialData.length - 1].askPrice;
    let newBearish = bearish;
    let newBullish = bullish;

    const newData = initialData.map((entry, index) => {
        if (index > 0) {
            if (newBearish > 0) {
                newBidPrice = getRandomPrice(newBidPrice);
                newBearish--;
            } else if (newBullish > 0) {
                newAskPrice = getRandomPrice(newAskPrice);
                newBullish--;
            } else {
                if (Math.random() < 0.5) {
                    newBidPrice = getRandomPrice(newBidPrice);
                    newBearish = 2;
                } else {
                    newAskPrice = getRandomPrice(newAskPrice);
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

    const canvasRef = useRef(null);


    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map((entry) => entry.name),
                    datasets: [
                        {
                            label: 'Bid Price',
                            data: data.map((entry) => entry.bidPrice),
                            backgroundColor: 'rgba(0, 150, 136, 0.2)',
                            borderColor: 'rgba(0, 150, 136, 1)',
                            borderWidth: 2,
                            pointRadius: 0,
                        },
                        {
                            label: 'Ask Price',
                            data: data.map((entry) => entry.askPrice),
                            backgroundColor: 'rgba(255, 193, 7, 0.2)',
                            borderColor: 'rgba(255, 193, 7, 1)',
                            borderWidth: 2,
                            pointRadius: 0,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    animation: {
                        duration: 5000,
                        easing: "linear"
                    },
                    scales: {
                        x: {
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 10,
                                maxRotation: 0,
                                minRotation: 0,
                            },
                        },
                    },
                },
            });

            const intervalId = setInterval(() => {
                const { newData, newBearish, newBullish } = getRandomData(data, bearish, bullish);
                setData(newData);
                setBearish(newBearish);
                setBullish(newBullish);

                chart.data.labels = newData.map((entry) => entry.name);
                chart.data.datasets[0].data = newData.map((entry) => entry.bidPrice);
                chart.data.datasets[1].data = newData.map((entry) => entry.askPrice);

                chart.update();
            }, 1000);

            return () => {
                clearInterval(intervalId);
                chart.destroy();
            };
        }
    }, [canvasRef, data, bearish, bullish]);



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
    };

    return (
        <Container maxWidth="md">
            <Box mt={3}>
                <Typography variant="h4" align="center" gutterBottom>
                    Mustermann AG Stock Price
                </Typography>
                <canvas id="stockChart" ref={canvasRef} width="800" height="400" style={{ border: '1px solid black' }} />
            </Box>
            <Box mt={3}>
                <Typography variant="h5" gutterBottom>
                    Game Information
                </Typography>
                <Typography variant="body1">
                    Starting balance: {balance.toFixed(2)} €
                    <br />
                    Current number of shares: {shares}
                    <br />
                    Current commission: {commission.toFixed(2)} €
                    <br />
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={() => buyStocks(10)}>
                        Buy 10 shares for {data[0].bidPrice.toFixed(2)} € each
                    </Button>
                    <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={() => sellStocks(10)}>
                        Sell 10 shares for {data[0].askPrice.toFixed(2)} € each
                    </Button>
                </Box>
                <Box sx={{ mt: 3 }}>
                    {gameRunning ? (
                        <>
                            <Button variant="contained" color="primary" onClick={() => buyStocks(10)}>
                                Buy 10 shares for {data[0].bidPrice.toFixed(2)} € each
                            </Button>
                            <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={() => sellStocks(10)}>
                                Sell 10 shares for {data[0].askPrice.toFixed(2)} € each
                            </Button>
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


