import { Module, QuizQuestion } from './types';

export const MODULES: Module[] = [
  {
    id: 'equity-101',
    title: 'Equity Market Mastery',
    description: 'A complete guide to understanding stocks. From the NSE/BSE ecosystem to advanced valuation metrics like PE, PB, and ROE.',
    icon: 'TrendingUp',
    difficulty: 'Beginner',
    duration: '45 mins',
    content: [
      {
        title: 'The Indian Stock Market Ecosystem',
        body: 'The stock market is a marketplace where ownership in businesses is bought and sold. In India, this ecosystem consists of key players:\n\n• **Exchanges (The Mall)**: India has two major exchanges. **NSE** (National Stock Exchange), which is the largest by volume, and **BSE** (Bombay Stock Exchange), which is Asia\'s oldest.\n• **SEBI (The Police)**: The Securities and Exchange Board of India regulates the market to protect investors.\n• **Depositories (The Vault)**: NSDL and CDSL hold your shares electronically (Demat format).\n• **Brokers (The Gateway)**: Platforms like Zerodha, Groww, or Angel One that allow you to interact with the exchanges.',
        example: 'Think of NSE/BSE as Amazon (the marketplace). Brokers are the app you use to order. NSDL/CDSL is the digital locker where your purchased goods are stored safely.',
        proTip: 'Always ensure your broker is SEBI-registered. Never transfer money to a personal bank account for trading.'
      },
      {
        title: 'Fundamental Analysis: The Pillars',
        body: 'Fundamental Analysis means checking if a business is healthy before buying it. You must look at:\n\n• **Revenue (Top Line)**: The total money a company generates from sales.\n• **Net Profit (Bottom Line)**: What is left after paying all expenses, taxes, and interest.\n• **EPS (Earnings Per Share)**: Net Profit divided by the total number of shares. This tells you how much profit each share has earned.',
        example: 'If Company A makes ₹100 Crores profit and has 10 Crore shares, its EPS is ₹10. If the share price is ₹200, you are paying ₹20 for every ₹1 of earning.',
        proTip: 'Look for companies with consistent Revenue and Profit growth (>15% annually) for the last 5 years.'
      },
      {
        title: 'Valuation Ratios (Is it Cheap?)',
        body: 'Just because a stock price is ₹50 doesn\'t mean it is cheap. You need Valuation Ratios:\n\n• **P/E Ratio (Price to Earnings)**: Price / EPS. A P/E of 25 means you are paying ₹25 to own ₹1 of the company\'s earnings. Lower is generally better, but compare it with industry peers.\n• **P/B Ratio (Price to Book)**: Price / Book Value. Useful for Banking and Finance stocks.\n• **ROE (Return on Equity)**: Net Income / Shareholders\' Equity. It measures how efficiently the company uses your money. Look for ROE > 15%.',
        example: 'HDFC Bank usually trades at a P/E of 20-25. If it drops to a P/E of 15 during a crash, it is considered "undervalued".',
        proTip: 'Never buy a stock solely on Low P/E. A low P/E could also mean the company is in trouble (Value Trap).'
      },
      {
        title: 'Corporate Actions',
        body: 'Events that affect shareholders:\n\n• **Dividend**: The company shares a portion of its profit with you directly into your bank account.\n• **Bonus Issue**: Free shares given to existing shareholders (e.g., 1:1 Bonus means 1 free share for every 1 held).\n• **Stock Split**: Breaking one share into smaller pieces to increase liquidity. (e.g., A ₹5000 share splits into 10 shares of ₹500).\n• **Buyback**: The company buys its own shares from the market, reducing supply and boosting EPS.',
        example: 'Infosys is famous for its history of Bonuses and Buybacks, creating massive wealth for long-term holders beyond just price appreciation.'
      }
    ]
  },
  {
    id: 'technical-analysis',
    title: 'Technical Analysis Blueprint',
    description: 'Master the art of reading charts. Learn Candlesticks, Patterns, Indicators (RSI, MACD) and Price Action.',
    icon: 'Activity',
    difficulty: 'Intermediate',
    duration: '50 mins',
    content: [
      {
        title: 'The Philosophy of Price',
        body: 'Technical Analysis (TA) assumes that **History Repeats Itself** and that **Price Discounts Everything**. You don\'t look at news; you look at the chart.\n\nCharts are usually viewed in different Timeframes:\n• **Intraday**: 5-min or 15-min charts.\n• **Swing Trading**: Daily or Weekly charts.\n• **Investing**: Monthly charts.',
        proTip: 'Always analyze from a higher timeframe to a lower one. If the Monthly trend is UP, don\'t short sell on a 5-min chart.'
      },
      {
        title: 'Candlestick Mastery',
        body: 'Candlesticks reveal the battle between Buyers (Bulls) and Sellers (Bears).\n\n• **Doji**: A cross shape where Open = Close. Signals indecision and potential reversal.\n• **Hammer**: A small body with a long lower wick. Bullish signal found at bottoms.\n• **Engulfing Pattern**: When a green candle completely "eats" the previous red candle. Strong Bullish signal.\n• **Marubozu**: A solid candle with no wicks. Shows pure dominance.',
        example: 'A Hammer formed at a strong Support level (like Nifty 24,000) is a high-probability buying opportunity.'
      },
      {
        title: 'Chart Patterns',
        body: 'Prices move in recognizable shapes:\n\n• **Head & Shoulders**: A reversal pattern indicating a trend change from Up to Down.\n• **Double Bottom (W pattern)**: Bullish reversal. Shows price refused to go lower twice.\n• **Flag & Pennant**: Continuation patterns. Price rallies, pauses (flag), and then rallies again.',
        example: 'If a stock breaks out of a "Cup and Handle" pattern with high volume, it often indicates a massive long-term rally.'
      },
      {
        title: 'Critical Indicators',
        body: 'Mathematical tools to confirm trades:\n\n• **RSI (Relative Strength Index)**: Measures speed. RSI > 70 is Overbought (Careful), RSI < 30 is Oversold (Opportunity).\n• **MACD**: Trend-following momentum indicator.\n• **Moving Averages (SMA/EMA)**: Smooths out price data. The **200-Day Moving Average (DMA)** is the holy grail of long-term trends.',
        proTip: 'If price is above 200 DMA, buy the dips. If price is below 200 DMA, sell the rips.'
      }
    ]
  },
  {
    id: 'mutual-funds',
    title: 'Mutual Funds: The Wealth Engine',
    description: 'Decode Direct vs Regular plans, Expense Ratios, and how to choose the right fund for your goals.',
    icon: 'PieChart',
    difficulty: 'Intermediate',
    duration: '35 mins',
    content: [
      {
        title: 'How Mutual Funds Work',
        body: 'A Mutual Fund pools money from thousands of investors to buy a basket of stocks or bonds. \n\n• **AMC (Asset Management Company)**: The company managing the money (e.g., SBI MF, HDFC MF).\n• **NAV (Net Asset Value)**: The price of one unit of the fund.\n• **AUM (Assets Under Management)**: Total money managed by the fund.\n\nUnlike stocks, you don\'t own the shares directly; you own units of the fund.',
        example: 'If you invest ₹5000 in a fund with NAV ₹50, you get 100 units. If NAV goes to ₹60, your value becomes ₹6000.'
      },
      {
        title: 'Types of Funds Explained',
        body: '• **Equity Funds**: Invest in stocks. High Risk, High Return. (Large Cap, Mid Cap, Small Cap, Flexi Cap).\n• **Debt Funds**: Invest in bonds/Government securities. Low Risk, Stable Return. Better than FD.\n• **Hybrid Funds**: Mix of Equity and Debt for balanced growth.\n• **ELSS (Tax Saving)**: Equity funds with a 3-year lock-in that save tax under Section 80C.',
        proTip: 'For most beginners, a **Flexi Cap Fund** is ideal as the manager can switch between large and small companies based on market conditions.'
      },
      {
        title: 'Active vs. Passive (Index) Funds',
        body: '• **Active Funds**: A fund manager tries to beat the market. Higher fees (**Expense Ratio > 1%**).\n• **Index Funds (Passive)**: They simply copy the Nifty 50 or Sensex. No human bias. Very low fees (**Expense Ratio < 0.2%**).\n\nStatistically, 70% of active large-cap funds **fail to beat the Index** over a 10-year period.',
        example: 'Warren Buffett famously won a $1 Million bet that a simple S&P 500 Index Fund would beat a group of high-fee Hedge Funds over 10 years.'
      },
      {
        title: 'Direct vs Regular Plans',
        body: 'Every Mutual Fund has two versions:\n\n1. **Regular Plan**: Sold by agents/banks. Contains a hidden commission (approx 1%).\n2. **Direct Plan**: Bought directly from the AMC apps. Zero commission.\n\nOver 20 years, that 1% difference can eat up **20-30% of your final wealth** due to compounding.',
        proTip: 'Always check if the fund name has "Direct" in it. If not, switch immediately.'
      }
    ]
  },
  {
    id: 'personal-finance',
    title: 'Personal Finance & Insurance',
    description: 'The art of managing money. Insurance, Emergency Funds, and the 50-30-20 Rule.',
    icon: 'Wallet',
    difficulty: 'Beginner',
    duration: '30 mins',
    content: [
      {
        title: 'The Foundation of Wealth',
        body: 'Before investing, secure your foundation:\n\n1. **Emergency Fund**: Keep 6-12 months of expenses in a Liquid Fund or Sweep-in FD. This prevents you from selling stocks during a crash if you lose your job.\n2. **Health Insurance**: Corporate cover is NOT enough. Buy a personal Floater Policy of at least ₹10 Lakhs + Super Top-up.\n3. **Term Life Insurance**: If you have dependents, buy a Term Plan (Pure Risk Cover) of 20x your annual income.',
        example: 'A Term Plan costs ₹15k/year for ₹1 Crore cover. An Endowment/LIC plan costs ₹50k for just ₹5 Lakh cover. Always buy Term.',
        proTip: 'Never mix Insurance with Investment. ULIPs and Endowment plans usually give poor returns (5-6%) and low cover.'
      },
      {
        title: 'The 50-30-20 Rule',
        body: 'The golden rule of budgeting:\n\n• **50% Needs**: Rent, EMI, Groceries, Utilities.\n• **30% Wants**: Travel, Gadgets, Dining Out.\n• **20% Savings**: SIPs, PPF, Goal Investments.\n\nIf you can increase Savings to 30% or 40%, you can achieve FIRE (Financial Independence) much faster.',
        example: 'Salary ₹50k? Needs: ₹25k, Wants: ₹15k, Invest: ₹10k. Automate the investment to deduct on Salary Day.'
      },
      {
        title: 'Debt Management & Credit Score',
        body: '• **Good Debt**: Home Loan (creates an asset, saves tax).\n• **Bad Debt**: Credit Card EMI, Personal Loan (high interest > 12%).\n\nYour **CIBIL Score** matters. A score > 750 gets you cheaper loans. To improve it, never miss an EMI and keep Credit Utilization Ratio below 30%.',
        proTip: 'If you have credit card debt, use the **Avalanche Method**: Pay off the card with the highest interest rate first.'
      }
    ]
  },
  {
    id: 'debt-market',
    title: 'The Bond Market (Fixed Income)',
    description: 'Understanding Bonds, G-Secs, and why FDs are losing value against inflation.',
    icon: 'Shield',
    difficulty: 'Advanced',
    duration: '35 mins',
    content: [
      {
        title: 'What is a Bond?',
        body: 'A Bond is a loan you give to a government or company. In return, they pay you interest.\n\n• **Face Value**: The principal amount.\n• **Coupon Rate**: The interest rate paid.\n• **Maturity**: When you get your principal back.\n• **Yield**: The effective return based on market price.',
        example: 'If you buy a GOI Bond, you are lending to the Government of India. It is practically risk-free (Sovereign Guarantee).'
      },
      {
        title: 'Corporate Bonds & Credit Ratings',
        body: 'Companies issue bonds to raise money. They are rated by agencies (CRISIL, ICRA):\n\n• **AAA**: Safest (HDFC, Bajaj Finance).\n• **AA**: Moderate Safety.\n• **D**: Default (Junk Bonds).\n\nLower rated bonds offer higher interest to compensate for the risk.',
        proTip: 'Retail investors should stick to AAA rated Corporate Bonds or G-Secs. Avoid high-yield "junk" bonds.'
      },
      {
        title: 'Interest Rates vs Bond Prices',
        body: 'This is the most critical concept in Debt markets: **Bond Prices and Interest Rates move in OPPOSITE directions**.\n\nIf RBI hikes interest rates, existing bonds with lower coupons become less attractive, so their price falls. If RBI cuts rates, bond prices rise.',
        example: 'In a falling interest rate cycle, Gilt Funds (which hold long-term govt bonds) can give double-digit returns due to price appreciation.'
      }
    ]
  },
  {
    id: 'tax-planning',
    title: 'Tax Planning for Investors',
    description: 'Old vs New Regime, Capital Gains Rules (LTCG/STCG), and Tax Harvesting strategies.',
    icon: 'Landmark',
    difficulty: 'Advanced',
    duration: '40 mins',
    content: [
      {
        title: 'Income Tax Regimes (FY 2025-26)',
        body: '• **Old Regime**: High tax rates but allows deductions (80C, 80D, HRA, Home Loan Interest).\n• **New Regime**: Lower tax rates but NO deductions (except Std Deduction & NPS employer contrib).\n\nGenerally, if your total deductions are < ₹3.75 Lakhs, the New Regime is better.',
        proTip: 'The New Regime is default now. You must explicitly choose Old Regime if you want to claim HRA.'
      },
      {
        title: 'Capital Gains Taxation',
        body: 'How your investments are taxed:\n\n**Equity (Stocks/MFs):**\n• **STCG (< 1 year)**: 20% Tax.\n• **LTCG (> 1 year)**: 12.5% Tax (on gains above ₹1.25 Lakh).\n\n**Debt/Gold/International:**\n• Taxed at your **Slab Rate** (STCG & LTCG rules have changed recently).',
        example: 'If you sell shares after 15 months with a profit of ₹2 Lakhs. First ₹1.25 Lakh is tax-free. You pay 12.5% on the remaining ₹75,000.'
      },
      {
        title: 'Tax Saving Instruments (Old Regime)',
        body: '• **Section 80C (Limit ₹1.5L)**: PPF, EPF, ELSS Mutual Funds, LIC Premium, Principal of Home Loan.\n• **Section 80D**: Health Insurance Premium (₹25k for self, ₹50k for senior parents).\n• **Section 80CCD(1B)**: NPS Tier 1 contribution (Additional ₹50k deduction).',
        proTip: 'ELSS has the lowest lock-in (3 years) and highest potential returns among all 80C options.'
      },
      {
        title: 'Tax Harvesting',
        body: 'A strategy to reduce LTCG tax. Since ₹1.25 Lakh LTCG is tax-free every year, you can sell your winners to book ₹1.25 Lakh profit and buy them back immediately. This resets your buying price to a higher level, reducing future tax liability.',
        example: 'Buying price ₹100, Current ₹150. Profit ₹50. Sell and Buy back at ₹150. New Cost Basis is ₹150. You used your tax-free limit smarty.'
      }
    ]
  },
  {
    id: 'derivatives',
    title: 'Derivatives (F&O) & Risk',
    description: 'Understanding Futures & Options, Hedging, Open Interest, and why 90% of traders lose money.',
    icon: 'Zap',
    difficulty: 'Expert',
    duration: '50 mins',
    content: [
      {
        title: 'Futures & Options Basics',
        body: 'Derivatives derive their value from an underlying asset (Stock/Index).\n\n• **Futures**: A contract to buy/sell at a fixed price in the future. You are obligated to fulfill it.\n• **Options**: You have the RIGHT but not the OBLIGATION to buy/sell.\n  - **Call (CE)**: View is Bullish.\n  - **Put (PE)**: View is Bearish.',
        example: 'Buying a Nifty Call Option allows you to profit if Nifty goes up, with limited risk (premium paid) but unlimited profit potential.'
      },
      {
        title: 'Buying vs Selling Options',
        body: '• **Option Buying**: Low Capital (₹5-10k). Probability of winning is low (33%). Time Decay (Theta) works against you.\n• **Option Selling (Writing)**: High Capital (₹1L+). Probability of winning is high (66%). Time Decay works in your favor.',
        proTip: 'Most retail traders buy options hoping for a jackpot. Institutions sell options to eat the premium.'
      },
      {
        title: 'Open Interest (OI) Decoding',
        body: 'OI represents the number of active contracts.\n\n• **High Call OI**: Resistance. Sellers don\'t want price to go above this.\n• **High Put OI**: Support. Sellers don\'t want price to go below this.\n• **PCR (Put Call Ratio)**: PCR > 1.2 is Bullish (Put writers dominating). PCR < 0.7 is Bearish.',
        example: 'If Nifty is at 24,000 and 24,500 Call has massive OI, it is likely Nifty will struggle to cross 24,500 expiry.'
      },
      {
        title: 'The Risk of Leverage',
        body: 'F&O provides massive leverage. A 1% move in Nifty can wipe out 50% of your Option capital.\n\nSEBI study shows **9 out of 10 individual traders in F&O incur net losses**. Use F&O for **Hedging** your portfolio, not for gambling.',
        proTip: 'Stop Loss is mandatory in F&O. One bad trade without SL can wipe out your entire trading account.'
      }
    ]
  }
];

export const GENERAL_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "You want to invest in Gold but want regular income from it. What should you choose?",
    options: ["Physical Jewellery", "Digital Gold Apps", "Sovereign Gold Bond (SGB)", "Gold ETF"],
    correctAnswer: 2,
    explanation: "SGBs are the only instrument that pays an additional 2.5% annual interest on top of the gold price appreciation."
  },
  {
    id: 2,
    question: "Which mutual fund plan gives higher returns over the long term?",
    options: ["Regular Plan", "Direct Plan", "Dividend Plan", "Fixed Plan"],
    correctAnswer: 1,
    explanation: "Direct Plans do not have distributor commissions, meaning the expense ratio is lower, leading to significantly higher returns over time."
  },
  {
    id: 3,
    question: "What is the lock-in period for ELSS Tax Saving Mutual Funds?",
    options: ["5 Years", "15 Years", "3 Years", "Until Retirement"],
    correctAnswer: 2,
    explanation: "ELSS has a 3-year lock-in, which is the shortest among all Section 80C tax-saving instruments (PPF is 15 years, FDs are 5 years)."
  },
  {
    id: 4,
    question: "Fundamental Analysis primarily involves studying:",
    options: ["Price Charts", "Moving Averages", "Balance Sheets & P&L", "Volume Patterns"],
    correctAnswer: 2,
    explanation: "Fundamental analysis looks at the business health (Balance Sheet, Profits) rather than just the stock price movement."
  },
  {
    id: 5,
    question: "According to the 50-30-20 rule, what percentage of income should go to Needs?",
    options: ["20%", "30%", "50%", "100%"],
    correctAnswer: 2,
    explanation: "50% is allocated for essential Needs like rent, food, and bills."
  },
  {
    id: 6,
    question: "A 'Hammer' candlestick pattern at the bottom of a downtrend usually indicates:",
    options: ["Market will fall further", "Potential Reversal to Upside", "No change", "Market is closed"],
    correctAnswer: 1,
    explanation: "A Hammer shows that buyers (Bulls) have stepped in and rejected lower prices, signaling a potential move up."
  },
  {
    id: 7,
    question: "If the RBI increases interest rates, what usually happens to existing Bond prices?",
    options: ["They Increase", "They Decrease", "Stay Same", "Become Zero"],
    correctAnswer: 1,
    explanation: "Bond prices are inversely related to interest rates. If rates go up, existing lower-coupon bonds become less attractive, so their price falls."
  },
  {
    id: 8,
    question: "What does a P/E Ratio of 20 signify?",
    options: ["Stock is 20% profit", "You pay ₹20 for ₹1 of earnings", "Stock will grow 20%", "Dividend is 20%"],
    correctAnswer: 1,
    explanation: "Price-to-Earnings ratio tells you how much you are paying for every rupee of earnings the company makes."
  }
];