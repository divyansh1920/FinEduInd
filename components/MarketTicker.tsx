import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const INITIAL_DATA = [
  { symbol: "NIFTY 50", price: 32420.50 },
  { symbol: "SENSEX", price: 105140.20 },
  { symbol: "BANK NIFTY", price: 61400.10 },
  { symbol: "NIFTY IT", price: 52850.00 },
  { symbol: "GOLD", price: 90200 },
  { symbol: "USD/INR", price: 88.95 },
  { symbol: "RELIANCE", price: 3880.50 },
  { symbol: "HDFC BANK", price: 2150.20 },
];

const MarketTicker: React.FC = () => {
  const [tickerData, setTickerData] = useState(INITIAL_DATA);

  return (
    <div className="bg-slate-950 text-white h-10 flex items-center overflow-hidden border-b border-slate-900 relative z-50">
      <div className="flex w-[200%] animate-marquee hover:[animation-play-state:paused]">
        {[...tickerData, ...tickerData, ...tickerData].map((item, index) => {
           const change = (Math.random() - 0.5) * 1.5;
           const isUp = change >= 0;
           return (
            <div key={index} className="flex items-center mx-6 text-xs font-medium tracking-wide">
              <span className="text-slate-400 mr-2 font-bold">{item.symbol}</span>
              <span className="mr-2">{item.price.toLocaleString('en-IN')}</span>
              <span className={`flex items-center ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(change).toFixed(2)}%
              </span>
            </div>
           );
        })}
      </div>
    </div>
  );
};

export default MarketTicker;