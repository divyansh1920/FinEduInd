export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: string;
  content: Section[];
}

export interface Section {
  title: string;
  body: string; // Markdown-like text
  example?: string;
  proTip?: string; // New field for engaging content
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum ViewState {
  HOME = 'HOME',
  MODULE = 'MODULE',
  TOOLS = 'TOOLS',
  AI_TUTOR = 'AI_TUTOR',
  LEGACY_VAULT = 'LEGACY_VAULT',
  SIMULATOR = 'SIMULATOR',
  REMINDERS = 'REMINDERS' // New View
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// New Types for Legacy Vault
export type AssetType = 'Bank Account' | 'Insurance' | 'Mutual Fund' | 'Stock Broker' | 'Real Estate' | 'PF/PPF';

export interface Asset {
  id: string;
  type: AssetType;
  institutionName: string; // e.g., HDFC Bank, LIC
  accountNumber: string; // Masked in UI usually
  nomineeName: string;
  estimatedValue?: number;
  notes?: string;
}

// Simulator Types
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  previousClose: number;
  sector: string;
  dayHigh: number;
  dayLow: number;
  volume: number;
  priceHistory: number[]; // For sparklines
}

export interface Holding {
  symbol: string;
  quantity: number;
  averagePrice: number;
  type: 'DELIVERY' | 'INTRADAY'; // Added product type
}

export interface Order {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT' | 'SL';
  product: 'DELIVERY' | 'INTRADAY';
  quantity: number;
  price: number; // Limit Price or Execution Price
  triggerPrice?: number; // For SL
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED' | 'TRIGGERED';
  date: string;
}

export interface Transaction {
  id: string;
  date: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  orderType?: 'MARKET' | 'LIMIT' | 'SL';
  product: 'DELIVERY' | 'INTRADAY';
  quantity: number;
  price: number;
  total: number;
}

// Reminder Types
export type ReminderCategory = 'Insurance' | 'SIP/Investment' | 'Tax' | 'EMI' | 'Bill' | 'Subscription' | 'Other';

export interface Reminder {
  id: string;
  title: string; // e.g., "Health Insurance Premium"
  date: string; // YYYY-MM-DD
  amount: number;
  category: ReminderCategory;
  recurring: 'One-time' | 'Monthly' | 'Yearly';
  notes?: string;
  completed?: boolean;
}