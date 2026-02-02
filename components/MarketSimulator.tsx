import React, { useState, useEffect, useMemo } from 'react';
import { Stock, Holding, Transaction, Order } from '../types';
import { 
  TrendingUp, TrendingDown, DollarSign, Briefcase, Activity, 
  Plus, Minus, X, RefreshCw, AlertCircle, LayoutList, 
  Search, ChevronDown, ChevronUp, Filter, BarChart3, Clock, Zap
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#6366f1'];

// --- Comprehensive Stock List (Nifty 50 + Major Midcaps) ---
const MARKET_STOCKS: Omit<Stock, 'priceHistory' | 'dayHigh' | 'dayLow' | 'volume'>[] = [
  // Banking
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 2150.20, previousClose: 2160.00, sector: 'Banking' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', price: 1340.50, previousClose: 1325.00, sector: 'Banking' },
  { symbol: 'SBIN', name: 'State Bank of India', price: 960.40, previousClose: 955.00, sector: 'Banking' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1980.00, previousClose: 1995.00, sector: 'Banking' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd', price: 1420.10, previousClose: 1410.00, sector: 'Banking' },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank', price: 1650.00, previousClose: 1640.00, sector: 'Banking' },
  { symbol: 'PNB', name: 'Punjab National Bank', price: 145.00, previousClose: 142.00, sector: 'Banking' },
  { symbol: 'BANKBARODA', name: 'Bank of Baroda', price: 290.00, previousClose: 288.00, sector: 'Banking' },
  
  // Finance
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 8850.00, previousClose: 8900.00, sector: 'Finance' },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', price: 1850.30, previousClose: 1840.00, sector: 'Finance' },
  { symbol: 'JIOFIN', name: 'Jio Financial Svcs', price: 380.00, previousClose: 375.00, sector: 'Finance' },
  { symbol: 'CHOLAFIN', name: 'Cholamandalam Inv', price: 1450.00, previousClose: 1440.00, sector: 'Finance' },
  
  // IT Services
  { symbol: 'TCS', name: 'Tata Consultancy Svcs', price: 4620.00, previousClose: 4580.00, sector: 'IT' },
  { symbol: 'INFY', name: 'Infosys Ltd', price: 1780.75, previousClose: 1765.00, sector: 'IT' },
  { symbol: 'HCLTECH', name: 'HCL Technologies', price: 1650.00, previousClose: 1640.00, sector: 'IT' },
  { symbol: 'WIPRO', name: 'Wipro Ltd', price: 580.20, previousClose: 575.00, sector: 'IT' },
  { symbol: 'TECHM', name: 'Tech Mahindra', price: 1450.50, previousClose: 1460.00, sector: 'IT' },
  { symbol: 'LTIM', name: 'LTIMindtree', price: 5400.00, previousClose: 5350.00, sector: 'IT' },
  { symbol: 'PERSISTENT', name: 'Persistent Systems', price: 8200.00, previousClose: 8100.00, sector: 'IT' },

  // Energy & Oil
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 3880.50, previousClose: 3850.00, sector: 'Energy' },
  { symbol: 'ONGC', name: 'ONGC', price: 340.20, previousClose: 335.00, sector: 'Energy' },
  { symbol: 'POWERGRID', name: 'Power Grid Corp', price: 390.00, previousClose: 385.00, sector: 'Energy' },
  { symbol: 'NTPC', name: 'NTPC Ltd', price: 410.50, previousClose: 405.00, sector: 'Energy' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', price: 3450.00, previousClose: 3400.00, sector: 'Energy' },
  { symbol: 'ADANIGREEN', name: 'Adani Green Energy', price: 2100.00, previousClose: 2050.00, sector: 'Energy' },
  { symbol: 'BPCL', name: 'BPCL', price: 680.00, previousClose: 675.00, sector: 'Energy' },
  { symbol: 'IOC', name: 'Indian Oil Corp', price: 190.00, previousClose: 188.00, sector: 'Energy' },

  // Auto
  { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 1280.30, previousClose: 1270.00, sector: 'Auto' },
  { symbol: 'M&M', name: 'Mahindra & Mahindra', price: 2450.00, previousClose: 2420.00, sector: 'Auto' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', price: 13500.00, previousClose: 13400.00, sector: 'Auto' },
  { symbol: 'EICHERMOT', name: 'Eicher Motors', price: 4900.00, previousClose: 4850.00, sector: 'Auto' },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto', price: 9200.00, previousClose: 9150.00, sector: 'Auto' },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp', price: 5600.00, previousClose: 5550.00, sector: 'Auto' },
  { symbol: 'TVSMOTOR', name: 'TVS Motor Company', price: 2500.00, previousClose: 2480.00, sector: 'Auto' },

  // FMCG
  { symbol: 'ITC', name: 'ITC Limited', price: 585.60, previousClose: 582.00, sector: 'FMCG' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2850.00, previousClose: 2860.00, sector: 'FMCG' },
  { symbol: 'NESTLEIND', name: 'Nestle India', price: 26500.00, previousClose: 26400.00, sector: 'FMCG' },
  { symbol: 'BRITANNIA', name: 'Britannia Ind', price: 5200.00, previousClose: 5150.00, sector: 'FMCG' },
  { symbol: 'TATACONSUM', name: 'Tata Consumer', price: 1250.00, previousClose: 1240.00, sector: 'FMCG' },
  { symbol: 'VARUNBEV', name: 'Varun Beverages', price: 1600.00, previousClose: 1580.00, sector: 'FMCG' },

  // Consumer
  { symbol: 'TITAN', name: 'Titan Company', price: 3950.00, previousClose: 3920.00, sector: 'Consumer' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', price: 3200.00, previousClose: 3210.00, sector: 'Consumer' },
  { symbol: 'TRENT', name: 'Trent Ltd', price: 6200.00, previousClose: 6100.00, sector: 'Consumer' },
  { symbol: 'DMART', name: 'Avenue Supermarts', price: 4800.00, previousClose: 4750.00, sector: 'Consumer' },

  // Metals
  { symbol: 'TATASTEEL', name: 'Tata Steel', price: 185.50, previousClose: 182.00, sector: 'Metals' },
  { symbol: 'JSWSTEEL', name: 'JSW Steel', price: 980.00, previousClose: 970.00, sector: 'Metals' },
  { symbol: 'HINDALCO', name: 'Hindalco', price: 720.00, previousClose: 710.00, sector: 'Metals' },
  { symbol: 'COALINDIA', name: 'Coal India', price: 520.00, previousClose: 515.00, sector: 'Metals' },
  { symbol: 'VEDL', name: 'Vedanta Ltd', price: 450.00, previousClose: 440.00, sector: 'Metals' },

  // Pharma
  { symbol: 'SUNPHARMA', name: 'Sun Pharma', price: 1850.00, previousClose: 1840.00, sector: 'Pharma' },
  { symbol: 'CIPLA', name: 'Cipla Ltd', price: 1620.00, previousClose: 1610.00, sector: 'Pharma' },
  { symbol: 'DRREDDY', name: 'Dr. Reddys Labs', price: 6800.00, previousClose: 6750.00, sector: 'Pharma' },
  { symbol: 'DIVISLAB', name: 'Divis Laboratories', price: 4100.00, previousClose: 4050.00, sector: 'Pharma' },

  // Infra & Others
  { symbol: 'LT', name: 'Larsen & Toubro', price: 4100.00, previousClose: 4050.00, sector: 'Infra' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1450.00, previousClose: 1440.00, sector: 'Telecom' },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', price: 11200.00, previousClose: 11100.00, sector: 'Cement' },
  { symbol: 'ZOMATO', name: 'Zomato Ltd', price: 280.50, previousClose: 275.00, sector: 'Tech' },
  { symbol: 'HAL', name: 'Hindustan Aeronautics', price: 4500.00, previousClose: 4450.00, sector: 'Defence' },
  { symbol: 'BEL', name: 'Bharat Electronics', price: 320.00, previousClose: 315.00, sector: 'Defence' },
];

const SECTORS = ['All', 'Banking', 'Finance', 'IT', 'Energy', 'Auto', 'FMCG', 'Consumer', 'Metals', 'Pharma', 'Infra', 'Defence', 'Tech'];

const MarketSimulator: React.FC = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'MARKET' | 'PORTFOLIO' | 'ORDERS' | 'OPEN_ORDERS'>('MARKET');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [cash, setCash] = useState<number>(1000000); // 10 Lakh starting capital
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // UI State
  const [expandedStock, setExpandedStock] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState('All');
  
  // Trade Modal State
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string | null>(null);
  const selectedStock = stocks.find(s => s.symbol === selectedStockSymbol) || null;

  const [tradeQuantity, setTradeQuantity] = useState<string>('1');
  const [tradeMode, setTradeMode] = useState<'BUY' | 'SELL'>('BUY');
  const [productType, setProductType] = useState<'DELIVERY' | 'INTRADAY'>('DELIVERY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'SL'>('MARKET');
  const [limitPrice, setLimitPrice] = useState<string>('');
  const [triggerPrice, setTriggerPrice] = useState<string>('');
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{msg: string, type: 'success'|'error'|'warning'} | null>(null);

  // --- Initialization ---
  useEffect(() => {
    // Load persisted data
    const savedCash = localStorage.getItem('sim_cash');
    const savedHoldings = localStorage.getItem('sim_holdings');
    const savedTransactions = localStorage.getItem('sim_transactions');
    const savedOrders = localStorage.getItem('sim_orders');
    
    if (savedCash) setCash(parseFloat(savedCash));
    if (savedHoldings) setHoldings(JSON.parse(savedHoldings));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    // Initialize stocks
    const initializedStocks = MARKET_STOCKS.map(stock => {
      const startPrice = stock.price;
      const history = [];
      let current = startPrice;
      for(let i=0; i<20; i++) {
          current = current * (1 + (Math.random() - 0.5) * 0.015);
          history.push(current);
      }
      history[19] = startPrice;

      return {
        ...stock,
        dayHigh: startPrice * 1.01,
        dayLow: startPrice * 0.99,
        volume: Math.floor(Math.random() * 5000000) + 100000,
        priceHistory: history
      };
    });
    setStocks(initializedStocks);
  }, []);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('sim_cash', cash.toString());
    localStorage.setItem('sim_holdings', JSON.stringify(holdings));
    localStorage.setItem('sim_transactions', JSON.stringify(transactions));
    localStorage.setItem('sim_orders', JSON.stringify(orders));
  }, [cash, holdings, transactions, orders]);

  // --- Live Market Simulation Engine ---
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(currentStocks => 
        currentStocks.map(stock => {
          // Optimized for 600ms updates
          const volatility = stock.price < 500 ? 0.004 : 0.0012; 
          const changePercent = (Math.random() - 0.5) * volatility;
          let newPrice = stock.price * (1 + changePercent);
          newPrice = Math.max(0.1, newPrice);
          const newHigh = Math.max(stock.dayHigh, newPrice);
          const newLow = Math.min(stock.dayLow, newPrice);
          // Smoother volume increments
          const volIncrement = Math.floor(Math.random() * 500);
          const newHistory = [...stock.priceHistory.slice(1), newPrice];
          return { ...stock, price: newPrice, dayHigh: newHigh, dayLow: newLow, volume: stock.volume + volIncrement, priceHistory: newHistory };
        })
      );
    }, 600); 

    return () => clearInterval(interval);
  }, []);

  // --- Order Matching Engine (Improved) ---
  useEffect(() => {
    if (orders.length === 0) return;

    let stateChanged = false;
    const newOrders = [...orders];

    newOrders.forEach((order, index) => {
        if (order.status === 'EXECUTED' || order.status === 'CANCELLED') return;

        const stock = stocks.find(s => s.symbol === order.symbol);
        if(!stock) return;

        let currentStatus = order.status;
        
        // 1. Check Trigger for PENDING SL Orders
        if (currentStatus === 'PENDING' && order.orderType === 'SL') {
            const triggerHit = (order.type === 'BUY' && stock.price >= (order.triggerPrice || 0)) ||
                               (order.type === 'SELL' && stock.price <= (order.triggerPrice || 0));
            
            if (triggerHit) {
                currentStatus = 'TRIGGERED';
                newOrders[index] = { ...order, status: 'TRIGGERED' };
                stateChanged = true;
                setNotification({ msg: `Stop Loss Triggered for ${order.symbol}`, type: 'warning' });
            }
        }

        // 2. Check Execution for LIMIT or TRIGGERED SL Orders
        if (
            (currentStatus === 'PENDING' && order.orderType === 'LIMIT') ||
            (currentStatus === 'TRIGGERED')
        ) {
             let canExecute = false;
             if (order.type === 'BUY' && stock.price <= order.price) canExecute = true;
             if (order.type === 'SELL' && stock.price >= order.price) canExecute = true;

             if (canExecute) {
                 processTradeExecution({...order, price: stock.price}); // Execute at current market price (best available)
                 newOrders[index] = { ...order, status: 'EXECUTED' };
                 stateChanged = true;
                 setNotification({ msg: `Order Executed for ${order.symbol}`, type: 'success' });
             }
        }
    });

    if (stateChanged) {
        setOrders(newOrders);
        setTimeout(() => setNotification(null), 3000);
    }

  }, [stocks]);

  // --- Calculations & Logic (Memoized) ---
  
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 2
  }).format(val);

  const formatVolume = (vol: number) => {
      if(vol >= 10000000) return (vol/10000000).toFixed(2) + ' Cr';
      if(vol >= 100000) return (vol/100000).toFixed(2) + ' L';
      return vol.toLocaleString();
  }

  const portfolioValue = useMemo(() => {
    return holdings.reduce((total, holding) => {
      const stock = stocks.find(s => s.symbol === holding.symbol);
      if (!stock) return total;
      if (holding.quantity > 0) return total + (stock.price * holding.quantity);
      return total;
    }, 0);
  }, [holdings, stocks]);

  const unrealizedPnL = useMemo(() => {
      return holdings.reduce((total, holding) => {
          const stock = stocks.find(s => s.symbol === holding.symbol);
          if(!stock) return total;
          const currentVal = stock.price * Math.abs(holding.quantity);
          const investedVal = holding.averagePrice * Math.abs(holding.quantity);
          if(holding.quantity > 0) return total + (currentVal - investedVal);
          else return total + (investedVal - currentVal);
      }, 0);
  }, [holdings, stocks]);

  const sectorAllocation = useMemo(() => {
    const allocation: {[key: string]: number} = {};
    
    holdings.forEach(h => {
        const stock = stocks.find(s => s.symbol === h.symbol);
        if (stock) {
            const value = stock.price * Math.abs(h.quantity);
            const sector = stock.sector || 'Other';
            allocation[sector] = (allocation[sector] || 0) + value;
        }
    });

    return Object.keys(allocation).map(sector => ({
        name: sector,
        value: allocation[sector]
    })).sort((a, b) => b.value - a.value);
  }, [holdings, stocks]);

  // Core Trade Execution Logic (Used by Manual and Auto)
  const processTradeExecution = (order: Order | {symbol: string, type: 'BUY'|'SELL', product: 'DELIVERY'|'INTRADAY', quantity: number, price: number}) => {
      const { symbol, type, product, quantity, price } = order;
      const orderValue = price * quantity;
      const marginRequired = product === 'INTRADAY' ? orderValue * 0.2 : orderValue;
      const estimatedCharges = orderValue * 0.001;

      if (type === 'BUY') {
          // Check for Short Cover
          setHoldings(prev => {
              const existingShort = prev.find(h => h.symbol === symbol && h.type === product && h.quantity < 0);
              if (existingShort) {
                  const shortQty = Math.abs(existingShort.quantity);
                  // Covering
                  const portion = Math.min(quantity, shortQty);
                  
                  return prev.map(h => (h.symbol === symbol && h.type === product) 
                      ? { ...h, quantity: h.quantity + quantity } 
                      : h).filter(h => h.quantity !== 0);
              } else {
                  // Fresh Buy
                  const existing = prev.find(h => h.symbol === symbol && h.type === product);
                  if (existing) {
                      const totalQty = existing.quantity + quantity;
                      const totalCostBasis = (existing.quantity * existing.averagePrice) + orderValue;
                      return prev.map(h => (h.symbol === symbol && h.type === product)
                          ? { ...h, quantity: totalQty, averagePrice: totalCostBasis / totalQty }
                          : h
                      );
                  } else {
                      return [...prev, { symbol, quantity, averagePrice: price, type: product }];
                  }
              }
          });

          // Cash Update Logic (Simplified for Simulator)
          setCash(prev => prev - marginRequired - estimatedCharges);

      } else {
          // SELL
          setHoldings(prev => {
             const existing = prev.find(h => h.symbol === symbol && h.type === product);
             if (existing && existing.quantity > 0) {
                 // Closing Long
                 return prev.map(h => (h.symbol === symbol && h.type === product)
                    ? { ...h, quantity: existing.quantity - quantity } 
                    : h).filter(h => h.quantity !== 0);
             } else {
                 // Short Selling
                 const existingShort = prev.find(h => h.symbol === symbol && h.type === product && h.quantity < 0);
                 if (existingShort) {
                     const currentAbsQty = Math.abs(existingShort.quantity);
                     const newAbsQty = currentAbsQty + quantity;
                     const totalValue = (currentAbsQty * existingShort.averagePrice) + orderValue;
                     const newAvg = totalValue / newAbsQty;
                     return prev.map(h => h === existingShort ? { ...h, quantity: -(newAbsQty), averagePrice: newAvg } : h);
                 } else {
                     return [...prev, { symbol, quantity: -quantity, averagePrice: price, type: 'INTRADAY' }];
                 }
             }
          });

          setCash(prev => {
              // Cash back logic
              if (product === 'DELIVERY') return prev + orderValue - estimatedCharges;
              else return prev - marginRequired - estimatedCharges; // Shorting logic
          });
      }

      // Record Transaction
      const newTx: Transaction = {
          id: Date.now().toString() + Math.random(),
          date: new Date().toLocaleString(),
          symbol, type, product, quantity, price,
          total: orderValue,
          orderType: (order as Order).orderType || 'MARKET'
      };
      setTransactions(prev => [newTx, ...prev]);
  };

  const getOrderValidationMessage = () => {
    if (!selectedStock) return null;
    if (orderType === 'MARKET') return null;
    
    const cmp = selectedStock.price;
    const limit = parseFloat(limitPrice);
    const trigger = parseFloat(triggerPrice);
    
    if (orderType === 'LIMIT' && limit > 0) {
        if (tradeMode === 'BUY' && limit > cmp) return { type: 'warning', msg: 'Limit > CMP. Executes immediately like Market Order.' };
        if (tradeMode === 'SELL' && limit < cmp) return { type: 'warning', msg: 'Limit < CMP. Executes immediately like Market Order.' };
    }
    
    if (orderType === 'SL' && trigger > 0) {
        if (tradeMode === 'SELL') {
             if (trigger > cmp) return { type: 'error', msg: 'Sell SL Trigger usually below CMP.' };
        }
        if (tradeMode === 'BUY') {
             if (trigger < cmp) return { type: 'error', msg: 'Buy SL Trigger usually above CMP.' };
        }
    }
    return null;
  };


  // --- User Interactions ---

  const handleManualTrade = () => {
    if (!selectedStock) return;
    
    const qty = parseInt(tradeQuantity);
    const limit = parseFloat(limitPrice);
    const trigger = parseFloat(triggerPrice);

    if (isNaN(qty) || qty <= 0) {
      setNotification({ msg: 'Invalid Quantity', type: 'error' });
      return;
    }

    if (orderType === 'LIMIT' && (isNaN(limit) || limit <= 0)) {
        setNotification({ msg: 'Invalid Limit Price', type: 'error' });
        return;
    }
    if (orderType === 'SL' && (isNaN(trigger) || trigger <= 0)) {
        setNotification({ msg: 'Invalid Trigger Price', type: 'error' });
        return;
    }

    // If Market Order -> Execute Immediately
    if (orderType === 'MARKET') {
        const orderValue = selectedStock.price * qty;
        const marginRequired = productType === 'INTRADAY' ? orderValue * 0.2 : orderValue;
        const estimatedCharges = orderValue * 0.001;
        
        if (tradeMode === 'BUY' && cash < (marginRequired + estimatedCharges)) {
             setNotification({ msg: 'Insufficient Funds for Trade', type: 'error' });
             return;
        }

        processTradeExecution({
            symbol: selectedStock.symbol,
            type: tradeMode,
            product: productType,
            quantity: qty,
            price: selectedStock.price
        });
        setNotification({ msg: 'Order Executed Successfully', type: 'success' });
    } else {
        // Place Pending Order
        const estimatedPrice = orderType === 'LIMIT' ? limit : (parseFloat(limitPrice) || selectedStock.price);
        const orderValue = estimatedPrice * qty;
        const marginRequired = productType === 'INTRADAY' ? orderValue * 0.2 : orderValue;
        
        if (tradeMode === 'BUY' && cash < marginRequired) {
             setNotification({ msg: 'Insufficient Funds to Place Order', type: 'error' });
             return;
        }

        const newOrder: Order = {
            id: Date.now().toString(),
            symbol: selectedStock.symbol,
            type: tradeMode,
            orderType: orderType,
            product: productType,
            quantity: qty,
            price: orderType === 'LIMIT' ? limit : (parseFloat(limitPrice) || selectedStock.price),
            triggerPrice: orderType === 'SL' ? trigger : undefined,
            status: 'PENDING',
            date: new Date().toLocaleString()
        };
        setOrders(prev => [newOrder, ...prev]);
        setNotification({ msg: `${orderType} Order Placed`, type: 'success' });
    }
    
    setTimeout(() => {
        setNotification(null);
        setSelectedStockSymbol(null);
        setTradeQuantity('1');
        setLimitPrice('');
        setTriggerPrice('');
        setOrderType('MARKET');
    }, 1500);
  };

  const cancelOrder = (id: string) => {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'CANCELLED' } : o));
      setNotification({ msg: 'Order Cancelled', type: 'success' });
      setTimeout(() => setNotification(null), 2000);
  };

  const resetSimulator = () => {
      if(window.confirm("RESET PORTFOLIO?\n\nThis will delete all your trades, holdings, orders and reset your cash to ₹10,0,000.\n\nAre you sure?")) {
          setCash(1000000);
          setHoldings([]);
          setTransactions([]);
          setOrders([]);
          setExpandedStock(null);
          
          localStorage.removeItem('sim_cash');
          localStorage.removeItem('sim_holdings');
          localStorage.removeItem('sim_transactions');
          localStorage.removeItem('sim_orders');
          
          setNotification({ msg: 'Account Reset Successful', type: 'success' });
          setTimeout(() => setNotification(null), 3000);
      }
  }

  // Filter stocks (Memoized)
  const filteredStocks = useMemo(() => stocks.filter(s => {
      const matchesSearch = s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === 'All' || s.sector === selectedSector;
      return matchesSearch && matchesSector;
  }), [stocks, searchQuery, selectedSector]);

  const validation = getOrderValidationMessage();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in pb-24 min-h-screen">
      
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-[Poppins] flex items-center gap-2">
            <Activity className="h-8 w-8 text-indigo-600" /> Market Simulator
          </h1>
          <p className="text-slate-500 mt-1">Real-time trading simulation with Limit/SL orders & margin.</p>
        </div>
        <button onClick={resetSimulator} className="bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm">
             <RefreshCw className="h-4 w-4" /> Reset Portfolio
        </button>
      </div>

      {/* Portfolio Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full transition-transform group-hover:scale-150"></div>
           <p className="text-slate-400 text-xs font-bold uppercase tracking-wider relative z-10">Net Worth</p>
           <p className="text-3xl font-bold font-[Poppins] mt-2 relative z-10">{formatCurrency(cash + portfolioValue + unrealizedPnL)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
               <DollarSign className="h-3 w-3"/> Available Margin
           </p>
           <p className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(cash)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
               <Briefcase className="h-3 w-3"/> Holdings Value
           </p>
           <p className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(portfolioValue)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
               <TrendingUp className="h-3 w-3"/> Unrealized P&L
           </p>
           <div className={`text-2xl font-bold mt-2 ${unrealizedPnL >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {unrealizedPnL >= 0 ? '+' : ''}{formatCurrency(unrealizedPnL)}
           </div>
        </div>
      </div>

      {/* 2. Main Navigation Tabs */}
      <div className="flex border-b border-slate-200 mb-6 space-x-6 overflow-x-auto">
        <button onClick={() => setActiveTab('MARKET')} className={`pb-3 text-sm font-bold tracking-wide transition-colors whitespace-nowrap ${activeTab === 'MARKET' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
            MARKET WATCH
        </button>
        <button onClick={() => setActiveTab('PORTFOLIO')} className={`pb-3 text-sm font-bold tracking-wide transition-colors whitespace-nowrap ${activeTab === 'PORTFOLIO' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
            POSITIONS ({holdings.length})
        </button>
        <button onClick={() => setActiveTab('OPEN_ORDERS')} className={`pb-3 text-sm font-bold tracking-wide transition-colors whitespace-nowrap ${activeTab === 'OPEN_ORDERS' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
            OPEN ORDERS ({orders.filter(o => o.status === 'PENDING' || o.status === 'TRIGGERED').length})
        </button>
        <button onClick={() => setActiveTab('ORDERS')} className={`pb-3 text-sm font-bold tracking-wide transition-colors whitespace-nowrap ${activeTab === 'ORDERS' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
            HISTORY
        </button>
      </div>

      {/* 3. Content Area */}
      
      {/* VIEW: MARKET WATCH */}
      {activeTab === 'MARKET' && (
        <div className="animate-fade-in">
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search stocks by Name or Symbol..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <select 
                        value={selectedSector}
                        onChange={(e) => setSelectedSector(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                    >
                        {SECTORS.map(s => <option key={s} value={s}>{s} Sector</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                                <th className="p-4 w-10"></th>
                                <th className="p-4 font-semibold">Stock</th>
                                <th className="p-4 font-semibold text-right">Price</th>
                                <th className="p-4 font-semibold text-right">Change %</th>
                                <th className="p-4 font-semibold text-right hidden sm:table-cell">Vol</th>
                                <th className="p-4 font-semibold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStocks.map((stock) => {
                                const change = stock.price - stock.previousClose;
                                const changePercent = (change / stock.previousClose) * 100;
                                const isPositive = change >= 0;
                                const isExpanded = expandedStock === stock.symbol;

                                return (
                                    <React.Fragment key={stock.symbol}>
                                    <tr 
                                        onClick={() => setExpandedStock(isExpanded ? null : stock.symbol)}
                                        className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50' : ''}`}
                                    >
                                        <td className="p-4 text-slate-400">
                                            {isExpanded ? <ChevronUp className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900">{stock.symbol}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-2">
                                                {stock.name} 
                                                <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 text-[10px] font-bold uppercase">{stock.sector}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-mono font-bold text-slate-700">
                                            {formatCurrency(stock.price)}
                                        </td>
                                        <td className={`p-4 text-right font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                                            <div className="flex items-center justify-end gap-1">
                                                {isPositive ? <TrendingUp className="h-3 w-3"/> : <TrendingDown className="h-3 w-3"/>}
                                                {Math.abs(changePercent).toFixed(2)}%
                                            </div>
                                        </td>
                                        <td className="p-4 text-right hidden sm:table-cell text-sm text-slate-500">
                                            {formatVolume(stock.volume)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setSelectedStockSymbol(stock.symbol); setTradeMode('BUY'); setTradeQuantity('1'); setProductType('DELIVERY'); }}
                                                className="px-5 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md"
                                            >
                                                TRADE
                                            </button>
                                        </td>
                                    </tr>
                                    
                                    {/* EXPANDED ROW DETAIL */}
                                    {isExpanded && (
                                        <tr className="bg-slate-50/50 border-b border-slate-200">
                                            <td colSpan={6} className="p-0">
                                                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                                                    {/* Detail Grid */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                                                            <p className="text-xs text-slate-500 uppercase">Day High</p>
                                                            <p className="font-bold text-emerald-600">{formatCurrency(stock.dayHigh)}</p>
                                                        </div>
                                                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                                                            <p className="text-xs text-slate-500 uppercase">Day Low</p>
                                                            <p className="font-bold text-rose-600">{formatCurrency(stock.dayLow)}</p>
                                                        </div>
                                                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                                                            <p className="text-xs text-slate-500 uppercase">Prev Close</p>
                                                            <p className="font-bold text-slate-700">{formatCurrency(stock.previousClose)}</p>
                                                        </div>
                                                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                                                            <p className="text-xs text-slate-500 uppercase">Volume</p>
                                                            <p className="font-bold text-slate-700">{formatVolume(stock.volume)}</p>
                                                        </div>
                                                    </div>

                                                    {/* Interactive Chart */}
                                                    <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-slate-200 h-48 relative">
                                                        <p className="absolute top-2 left-4 text-xs font-bold text-slate-400 flex items-center gap-1">
                                                            <BarChart3 className="h-3 w-3"/> Price Trend (Last 20 Ticks)
                                                        </p>
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <AreaChart data={stock.priceHistory.map((p, i) => ({index: i, price: p}))}>
                                                                <defs>
                                                                    <linearGradient id={`grad-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                                                    </linearGradient>
                                                                </defs>
                                                                <Tooltip 
                                                                    contentStyle={{backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none'}}
                                                                    formatter={(val: number) => [formatCurrency(val), 'Price']}
                                                                    labelStyle={{display: 'none'}}
                                                                />
                                                                <Area 
                                                                    type="monotone" 
                                                                    dataKey="price" 
                                                                    stroke="#6366f1" 
                                                                    strokeWidth={2} 
                                                                    fill={`url(#grad-${stock.symbol})`} 
                                                                    animationDuration={300}
                                                                />
                                                                <YAxis domain={['auto', 'auto']} hide />
                                                            </AreaChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}

      {/* VIEW: PORTFOLIO */}
      {activeTab === 'PORTFOLIO' && (
        <div className="animate-fade-in">
             {holdings.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
                    <div className="bg-slate-50 p-4 rounded-full mb-4 inline-block">
                        <Briefcase className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700">Empty Portfolio</h3>
                    <p className="text-slate-400 mt-2 mb-6">You haven't taken any positions yet.</p>
                    <button onClick={() => setActiveTab('MARKET')} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm">
                        Go to Market Watch
                    </button>
                </div>
             ) : (
                <div className="space-y-8">
                    {/* Allocation Chart */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Activity className="h-5 w-5 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Portfolio Allocation</h3>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sectorAllocation}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {sectorAllocation.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(val: number) => formatCurrency(val)}
                                        contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                        itemStyle={{color: '#1e293b', fontWeight: 'bold'}}
                                    />
                                    <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {holdings.map((holding, idx) => {
                            const stock = stocks.find(s => s.symbol === holding.symbol);
                            const currentPrice = stock ? stock.price : holding.averagePrice;
                            
                            const isShort = holding.quantity < 0;
                            const absQty = Math.abs(holding.quantity);
                            
                            // Calculation for P&L
                            let pnl = 0;
                            let invested = 0;
                            
                            if (isShort) {
                                invested = holding.averagePrice * absQty;
                                const currentValue = currentPrice * absQty;
                                pnl = invested - currentValue;
                            } else {
                                invested = holding.averagePrice * absQty;
                                const currentValue = currentPrice * absQty;
                                pnl = currentValue - invested;
                            }

                            const pnlPercent = (pnl / invested) * 100;
                            const isProfit = pnl >= 0;

                            return (
                                <div key={`${holding.symbol}-${idx}`} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                    {isShort && (
                                        <div className="absolute top-0 right-0 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg">SHORT</div>
                                    )}
                                    
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-10 rounded-full ${isProfit ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900">{holding.symbol}</h3>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${holding.type === 'INTRADAY' ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                                                    {holding.type}
                                                </span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => { if(stock){ setSelectedStockSymbol(stock.symbol); setTradeMode(isShort ? 'BUY' : 'SELL'); setProductType(holding.type); setTradeQuantity(absQty.toString()); } }}
                                            className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${isShort ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'}`}
                                        >
                                            {isShort ? 'EXIT (BUY)' : 'EXIT (SELL)'}
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                        <div>
                                            <p className="text-slate-400 text-xs">Qty</p>
                                            <p className={`font-bold ${isShort ? 'text-orange-600' : 'text-slate-700'}`}>{holding.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-400 text-xs">Avg Price</p>
                                            <p className="font-bold text-slate-700">{formatCurrency(holding.averagePrice)}</p>
                                        </div>
                                    </div>

                                    <div className={`flex justify-between items-center pt-4 border-t border-slate-100`}>
                                        <div className="text-xs text-slate-500 font-bold uppercase">Net P&L</div>
                                        <div className={`font-bold font-mono text-lg ${isProfit ? 'text-emerald-600' : 'text-rose-500'}`}>
                                            {isProfit ? '+' : ''}{formatCurrency(pnl)} <span className="text-sm">({pnlPercent.toFixed(2)}%)</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
             )}
        </div>
      )}

      {/* VIEW: OPEN ORDERS */}
      {activeTab === 'OPEN_ORDERS' && (
          <div className="animate-fade-in bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             {orders.filter(o => o.status === 'PENDING' || o.status === 'TRIGGERED').length === 0 ? (
                 <div className="p-12 text-center text-slate-400">
                     <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                     <p>No open orders.</p>
                 </div>
             ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                                <th className="p-4">Time</th>
                                <th className="p-4">Symbol</th>
                                <th className="p-4">Side</th>
                                <th className="p-4">Type</th>
                                <th className="p-4 text-right">Price / Trigger</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.filter(o => o.status === 'PENDING' || o.status === 'TRIGGERED').map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50">
                                    <td className="p-4 text-xs text-slate-500 font-mono">{order.date.split(',')[1]}</td>
                                    <td className="p-4 font-bold text-slate-800">{order.symbol}</td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${order.type === 'BUY' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {order.type}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded border ${order.status === 'TRIGGERED' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'text-slate-600 border-slate-200'}`}>
                                            {order.status === 'TRIGGERED' ? 'TRIGGERED' : order.orderType}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right text-sm font-mono">
                                        {order.orderType === 'LIMIT' ? formatCurrency(order.price) : 
                                         order.orderType === 'SL' ? (
                                             <div className="flex flex-col items-end">
                                                 <span>Trig: {formatCurrency(order.triggerPrice || 0)}</span>
                                                 <span className="text-xs text-slate-400">Lmt: {formatCurrency(order.price)}</span>
                                             </div>
                                         ) : 'MKT'}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => cancelOrder(order.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             )}
          </div>
      )}

      {/* VIEW: ORDER HISTORY */}
      {activeTab === 'ORDERS' && (
          <div className="animate-fade-in bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             {transactions.length === 0 ? (
                 <div className="p-12 text-center text-slate-400">
                     <LayoutList className="h-10 w-10 mx-auto mb-2 opacity-50" />
                     <p>No transaction history found.</p>
                 </div>
             ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                                <th className="p-4">Time</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4 text-right">Qty</th>
                                <th className="p-4 text-right">Price</th>
                                <th className="p-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50">
                                    <td className="p-4 text-xs text-slate-500 font-mono">{tx.date}</td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${tx.type === 'BUY' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {tx.type}
                                        </span>
                                        <span className="ml-2 text-[10px] text-slate-400 border border-slate-200 px-1 rounded">{tx.product}</span>
                                    </td>
                                    <td className="p-4 font-bold text-slate-800">{tx.symbol}</td>
                                    <td className="p-4 text-right text-sm">{tx.quantity}</td>
                                    <td className="p-4 text-right text-sm">{formatCurrency(tx.price)}</td>
                                    <td className="p-4 text-right font-bold text-sm text-slate-700">{formatCurrency(tx.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             )}
          </div>
      )}

      {/* TRADE MODAL */}
      {selectedStock && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">{selectedStock.symbol}</h3>
                        <p className="text-sm text-slate-500 font-mono">{formatCurrency(selectedStock.price)} <span className="text-emerald-500 text-xs ml-2">● Live</span></p>
                    </div>
                    <button onClick={() => setSelectedStockSymbol(null)} className="text-slate-400 hover:text-slate-600"><X className="h-6 w-6" /></button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    
                    {/* Buy/Sell Toggle */}
                    <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
                        <button 
                            onClick={() => setTradeMode('BUY')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tradeMode === 'BUY' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            BUY
                        </button>
                        <button 
                             onClick={() => setTradeMode('SELL')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tradeMode === 'SELL' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            SELL
                        </button>
                    </div>

                    {/* Order Type Tabs */}
                    <div className="flex border-b border-slate-200 mb-6">
                         <button onClick={() => setOrderType('MARKET')} className={`flex-1 pb-2 text-xs font-bold uppercase ${orderType === 'MARKET' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}>Market</button>
                         <button onClick={() => setOrderType('LIMIT')} className={`flex-1 pb-2 text-xs font-bold uppercase ${orderType === 'LIMIT' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}>Limit</button>
                         <button onClick={() => setOrderType('SL')} className={`flex-1 pb-2 text-xs font-bold uppercase ${orderType === 'SL' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}>SL</button>
                    </div>

                    {/* Validation Message */}
                    {validation && (
                        <div className={`text-xs p-3 rounded-lg mb-4 flex items-start gap-2 ${validation.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>
                            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{validation.msg}</span>
                        </div>
                    )}

                    {/* Quantity Input */}
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Quantity</label>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setTradeQuantity(Math.max(1, parseInt(tradeQuantity) - 1).toString())}
                                className="h-10 w-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <input 
                                type="number" 
                                value={tradeQuantity}
                                onChange={(e) => setTradeQuantity(e.target.value)}
                                className="flex-1 h-10 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-lg text-slate-800 focus:outline-none focus:border-indigo-500"
                            />
                            <button 
                                onClick={() => setTradeQuantity((parseInt(tradeQuantity) + 1).toString())}
                                className="h-10 w-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Conditional Inputs for Limit / SL */}
                    {orderType === 'LIMIT' && (
                        <div className="mb-4 animate-fade-in">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Limit Price</label>
                            <input 
                                type="number"
                                placeholder={selectedStock.price.toFixed(2)}
                                value={limitPrice}
                                onChange={(e) => setLimitPrice(e.target.value)}
                                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    )}

                    {orderType === 'SL' && (
                        <div className="mb-4 animate-fade-in space-y-3">
                            <div className="bg-indigo-50 p-3 rounded-lg text-xs text-indigo-700 border border-indigo-100 mb-2">
                                <p className="font-bold mb-1">Stop-Limit Order</p>
                                <p>Order triggers when price hits <strong>Trigger Price</strong>. Then a Limit Order is placed at <strong>Limit Price</strong>.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Trigger Price</label>
                                    <input 
                                        type="number"
                                        placeholder="Activation Price"
                                        value={triggerPrice}
                                        onChange={(e) => setTriggerPrice(e.target.value)}
                                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Limit Price</label>
                                    <input 
                                        type="number"
                                        placeholder="Execution Price"
                                        value={limitPrice}
                                        onChange={(e) => setLimitPrice(e.target.value)}
                                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Product Toggle (Intraday/Delivery) */}
                    <div className="flex gap-4 mb-6">
                        <label className="flex-1 cursor-pointer">
                            <input type="radio" className="peer sr-only" name="product" checked={productType === 'DELIVERY'} onChange={() => setProductType('DELIVERY')} />
                            <div className="p-3 rounded-xl border-2 border-slate-100 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 transition-all text-center h-full">
                                <span className="block text-xs font-bold text-slate-500 peer-checked:text-indigo-700 uppercase">Delivery</span>
                                <span className="text-[10px] text-slate-400">CNC (0x Leverage)</span>
                            </div>
                        </label>
                        <label className="flex-1 cursor-pointer">
                            <input type="radio" className="peer sr-only" name="product" checked={productType === 'INTRADAY'} onChange={() => setProductType('INTRADAY')} />
                            <div className="p-3 rounded-xl border-2 border-slate-100 peer-checked:border-purple-500 peer-checked:bg-purple-50 transition-all text-center h-full">
                                <span className="block text-xs font-bold text-slate-500 peer-checked:text-purple-700 uppercase">Intraday</span>
                                <span className="text-[10px] text-purple-500 font-bold">MIS (5x Leverage)</span>
                            </div>
                        </label>
                    </div>

                    {/* Order Summary */}
                    {(() => {
                        const qty = parseInt(tradeQuantity) || 0;
                        const executionPrice = orderType === 'MARKET' ? selectedStock.price : (parseFloat(limitPrice) || 0);
                        const totalValue = executionPrice * qty;
                        const requiredMargin = productType === 'INTRADAY' ? totalValue * 0.2 : totalValue;
                        const estimatedCharges = totalValue * 0.001; // 0.1% flat
                        const finalRequired = requiredMargin + estimatedCharges;
                        const canAfford = tradeMode === 'BUY' ? cash >= finalRequired : true; 

                        return (
                            <div className={`bg-slate-50 p-4 rounded-xl mb-6 space-y-2 border ${!canAfford && tradeMode === 'BUY' ? 'border-red-200 bg-red-50' : 'border-slate-100'}`}>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Order Value</span>
                                    <span className="font-bold text-slate-800">{formatCurrency(totalValue)}</span>
                                </div>
                                {productType === 'INTRADAY' && (
                                    <div className="flex justify-between text-sm text-purple-600 font-bold bg-purple-50 p-1.5 rounded-lg">
                                        <span className="flex items-center gap-1"><Zap className="h-3 w-3"/> Margin (20%)</span>
                                        <span>{formatCurrency(requiredMargin)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Est. Charges (0.1%)</span>
                                    <span>{formatCurrency(estimatedCharges)}</span>
                                </div>
                                
                                <div className="border-t border-slate-200/50 my-2 pt-2 flex justify-between text-sm">
                                    <span className="font-bold text-slate-700">Net Payable</span>
                                    <span className="font-bold text-slate-900">{formatCurrency(finalRequired)}</span>
                                </div>

                                <div className="flex justify-between text-xs pt-1">
                                    <span className="text-slate-500">Available Cash</span>
                                    <span className={`${!canAfford && tradeMode === 'BUY' ? 'text-red-600 font-bold' : 'text-slate-700 font-medium'}`}>
                                        {formatCurrency(cash)}
                                    </span>
                                </div>
                                
                                {canAfford && tradeMode === 'BUY' && (
                                     <div className="flex justify-between text-xs pt-1 text-emerald-600 font-medium">
                                        <span>Balance After Trade</span>
                                        <span>{formatCurrency(cash - finalRequired)}</span>
                                     </div>
                                )}

                                {!canAfford && tradeMode === 'BUY' && (
                                    <div className="flex items-center gap-2 text-xs text-red-600 font-bold mt-2">
                                        <AlertCircle className="h-3 w-3" /> Insufficient Funds
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {/* Submit Button */}
                    <button 
                        onClick={handleManualTrade}
                        disabled={(() => {
                             const qty = parseInt(tradeQuantity) || 0;
                             const executionPrice = orderType === 'MARKET' ? selectedStock.price : (parseFloat(limitPrice) || 0);
                             const totalValue = executionPrice * qty;
                             const requiredMargin = productType === 'INTRADAY' ? totalValue * 0.2 : totalValue;
                             const finalRequired = requiredMargin + (totalValue * 0.001);
                             return tradeMode === 'BUY' && cash < finalRequired;
                        })()}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 
                        ${tradeMode === 'BUY' 
                            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed' 
                            : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed'}`}
                    >
                        {orderType === 'MARKET' ? `CONFIRM ${tradeMode}` : `PLACE ${orderType} ORDER`}
                    </button>
                    
                    {notification && (
                        <div className={`mt-4 p-3 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2 animate-pulse ${notification.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {notification.type === 'error' ? <AlertCircle className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                            {notification.msg}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default MarketSimulator;