import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import usePortfolioStore from '../store/portfolioStore';
import useMarketStore from '../store/marketStore';
import socketService from '../services/socket';
import { formatCurrency, formatPercentage, getChangeColor } from '../utils/formatters';

function Dashboard() {
  const { dematAccount, fetchDematAccount, fetchHoldings } = usePortfolioStore();
  const { topGainers, topLosers, fetchTopMovers, updateStockPrice } = useMarketStore();

  useEffect(() => {
    fetchDematAccount();
    fetchHoldings();
    fetchTopMovers();

    // Connect to socket for real-time updates
    socketService.connect();
    socketService.onMarketUpdate((updates) => {
      updateStockPrice(updates);
      fetchHoldings();
    });

    return () => {
      socketService.offMarketUpdate();
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(dematAccount?.portfolioValue || 0)}
              </p>
            </div>
            <Wallet className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cash Balance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(dematAccount?.cashBalance || 0)}
              </p>
            </div>
            <Wallet className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total P&L</p>
              <p className={`text-2xl font-bold mt-1 ${getChangeColor(dematAccount?.totalProfitLoss || 0)}`}>
                {formatCurrency(dematAccount?.totalProfitLoss || 0)}
              </p>
              <p className={`text-sm ${getChangeColor(dematAccount?.totalProfitLossPercentage || 0)}`}>
                {formatPercentage(dematAccount?.totalProfitLossPercentage || 0)}
              </p>
            </div>
            {parseFloat(dematAccount?.totalProfitLoss || 0) >= 0 ? (
              <TrendingUp className="h-12 w-12 text-green-600" />
            ) : (
              <TrendingDown className="h-12 w-12 text-red-600" />
            )}
          </div>
        </div>
      </div>

      {/* Market Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              Top Gainers
            </h2>
          </div>
          <div className="p-6">
            {topGainers.length > 0 ? (
              <div className="space-y-4">
                {topGainers.map((stock) => (
                  <Link
                    key={stock.symbol}
                    to={`/stock/${stock.symbol}`}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{stock.symbol}</p>
                      <p className="text-sm text-gray-600">{stock.companyName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(stock.currentPrice)}</p>
                      <p className="text-sm text-green-600">{formatPercentage(stock.changePercent)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
          <div className="px-6 pb-6">
            <Link
              to="/market"
              className="flex items-center justify-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Stocks
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Top Losers */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
              Top Losers
            </h2>
          </div>
          <div className="p-6">
            {topLosers.length > 0 ? (
              <div className="space-y-4">
                {topLosers.map((stock) => (
                  <Link
                    key={stock.symbol}
                    to={`/stock/${stock.symbol}`}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{stock.symbol}</p>
                      <p className="text-sm text-gray-600">{stock.companyName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(stock.currentPrice)}</p>
                      <p className="text-sm text-red-600">{formatPercentage(stock.changePercent)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
          <div className="px-6 pb-6">
            <Link
              to="/portfolio"
              className="flex items-center justify-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View Portfolio
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
