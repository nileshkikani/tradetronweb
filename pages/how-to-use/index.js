import React from 'react';
import { Typography, Box } from '@mui/material';
import Image from 'next/image';


const HowToUse = () => {
    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h2" gutterBottom>
                What is TradeOnAir?
            </Typography>
            <Typography variant="body1" paragraph>
                TradeOnAir is an automated multi-leg trading tool that simplifies the creation and execution of options strategies.
                It allows traders to add multiple option contracts and set specific entry and exit conditions based on price or time for each strategy.
            </Typography>
            <Typography variant="body1" paragraph>
                This tool uses the combined Last Traded Price (LTP) of all the contracts in a strategy, known as Strategy LTP, to trigger trades.
                Once the predefined conditions are met, the orders are automatically sent to the exchange, reducing the need for manual monitoring and quick decision-making.
            </Typography>
            <Typography variant="h2" gutterBottom>
                How Does Strategy Bot Work?
            </Typography>
            <Typography variant="h4" sx={{ paddingTop: '10px' }}>
                Let&apos;s break it down with a couple of examples:
            </Typography>
            <Typography variant="h4" sx={{ paddingTop: '10px' }}>
                Example 1: Buy Orders
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • 1 lot of Nifty 25000 CE (Call Option) with an LTP of 100
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • 1 lot of Nifty 25000 PE (Put Option) with an LTP of 50
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                The combined Strategy LTP becomes -150 (100 + 50 = 150). Since it's a combination of buying both calls and puts.
            </Typography>
            <Typography variant="h4" sx={{ paddingTop: '10px' }}>
                You set the below conditions:
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • Entry condition: When the Strategy LTP hits -100
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • Exit condition: Book profit of 75 points, and Book loss of 50 points
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                Once the Strategy LTP reaches -100, the orders are sent to the exchange, and the strategy enters the market. After entry, if the Strategy LTP drops by 50 points (Strategy LTP = -50) or rises by 75 points (Strategy LTP = -175), the bot will automatically execute either a stop-loss or a book-profit order.
            </Typography>

            <Typography variant="h4" sx={{ paddingTop: '20px' }}>
                Example 2: Sell Orders
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                In a similar way, for sell orders:
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • The user adds 1 lot of Nifty 25000 CE (LTP 100) and 1 lot of Nifty 25000 PE (LTP 50)
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • The combined Strategy LTP becomes 150.
            </Typography>
            <Typography variant="h4" sx={{ paddingTop: '10px' }}>
                You set the below conditions:
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • Entry condition: Trigger at 200
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • Exit condition: Book profit of 100 points, and Book Loss of 50 points.
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                Once the Strategy LTP reaches 200, the orders are sent to the exchange, and the strategy enters the market. After entry, if the Strategy LTP drops by 100 points (Strategy LTP = 100) or rises by 50 points (Strategy LTP = 250), the bot will automatically execute either a stop-loss or a book-profit order.
            </Typography>
            <Typography variant="h2" sx={{ paddingTop: '10px' }}>
                Why Use Strategy Bot?
            </Typography>
            <Typography variant="h4" sx={{ paddingTop: '20px', fontWeight: 'bold' }}>
                1. Automated Entry and Exit Execution
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                Strategy Bot allows traders to automate the process of entering and exiting strategies by setting predefined conditions. This helps traders avoid missing key moments in the market and reduces the need for manual intervention, freeing them up to focus on other opportunities.
            </Typography>
            <Typography variant="h4" sx={{ paddingTop: '20px', fontWeight: 'bold' }}>
                2. Risk Management
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                With Strategy Bot, traders can easily manage risk by setting book profit and stop-loss conditions based on the points from the average entry or the profit and loss levels they can tolerate. This ensures that traders don't miss out on profits or incur unexpected losses. Additionally, traders can set a global exit for all open strategies, allowing them to exit when their overall Strategy Bot profit and loss (PnL) meets the desired thresholds.
            </Typography>
            <Typography variant="h4" sx={{ paddingTop: '20px', fontWeight: 'bold' }}>
                3. Strategy LTP-Based Execution
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                The combined Strategy LTP drives the execution, which simplifies strategy management. Instead of setting entry or exit prices for each individual leg of the options contracts, traders can rely on the Strategy LTP to trigger the execution of orders. This makes it easier to manage multiple-leg strategies.
            </Typography>
            <Typography variant="h2" sx={{ paddingTop: '10px' }}>
                How to use Strategy Bot?
            </Typography>
            <Typography variant="h4" sx={{ paddingTop: '20px', fontWeight: 'bold' }}>
                1. Creating Strategies
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • Login to TradeOnAir
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • Navigate to the Option Wizard
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • Click on Create Own strategy
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • Create positions and click on add to add legs
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • Add all required fields like entry time , days and exit time
            </Typography>
            <Box sx={{ paddingTop: '30px' }}>
                <Image
                    src="/static/images/how-to-use/create-own-strategy.png"
                    alt="Create Your Own Strategy"
                    width={900}
                    height={500}
                    style={{ width: '100%', maxWidth: '800px', height: 'auto', display: 'block' }}
                />
            </Box>
            <Typography variant="h4" sx={{ paddingTop: '30px', fontWeight: 'bold' }}>
                2. Monitor Existing Positions:
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • Navigate to Deployed page
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • Select your Strategy and date
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • You can see your positions there
            </Typography>
            <Box sx={{ paddingTop: '30px' }}>
                <Image
                    src="/static/images/how-to-use/positions.png"
                    alt="Create Your Own Strategy"
                    width={900}
                    height={500}
                    style={{ width: '100%', maxWidth: '800px', height: 'auto', display: 'block' }}
                />
            </Box>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • Click on symbol to see perticular symbol wise orders that created again
            </Typography>
            <Box sx={{ paddingTop: '30px' }}>
                <Image
                    src="/static/images/how-to-use/modal.png"
                    alt="Create Your Own Strategy"
                    width={900}
                    height={500}
                    style={{ width: '100%', maxWidth: '800px', height: 'auto', display: 'block' }}
                />
            </Box>
            <Typography variant="h4" sx={{ paddingTop: '30px', fontWeight: 'bold' }}>
                3. Status of all your starategies:
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • Here you can set your strategy status Active and Deactive, and also can Delete your strategy
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • when you Deactive strategy all your active orders of that strategy will be closed immediately
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • You can also Permanently Delete your strategies from here
            </Typography>
            <Box sx={{ paddingTop: '30px' }}>
                <Image
                    src="/static/images/how-to-use/my-strategies.png"
                    alt="Create Your Own Strategy"
                    width={900}
                    height={500}
                    style={{ width: '100%', maxWidth: '800px', height: 'auto', display: 'block' }}
                />
            </Box>
            <Typography variant="h4" sx={{ paddingTop: '30px', fontWeight: 'bold' }}>
                4. Add Broker:
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • You can add your broker credentials here to place order in your trading account and trade in live market
            </Typography>
            <Typography variant="body1" sx={{ paddingTop: '10px' }}>
                • Your Broker credentials are full secured and encrypted in transist
            </Typography>
        </Box>
    )
}

export default HowToUse