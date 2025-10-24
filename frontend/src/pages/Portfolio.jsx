import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import usePortfolioStore from '../store/portfolioStore';
import { formatCurrency, formatPercentage, getChangeColor } from '../utils/formatters';

function Portfolio() {
  const { holdings, dematAccount, fetchHoldings } = usePortfolioStore();

  useEffect(() => {
    fetchHoldings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Portfolio</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Invested Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(dematAccount?.totalInvestedValue || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Current Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(dematAccount?.totalCurrentValue || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total P&L</p>
          <p className={`text-2xl font-bold mt-1 ${getChangeColor(dematAccount?.totalProfitLoss || 0)}`}>
            {formatCurrency(dematAccount?.totalProfitLoss || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">P&L %</p>
          <p className={`text-2xl font-bold mt-1 ${getChangeColor(dematAccount?.totalProfitLossPercentage || 0)}`}>
            {formatPercentage(dematAccount?.totalProfitLossPercentage || 0)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Holdings</h2>
        </div>
        {holdings && holdings.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invested</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">P&L</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {holdings.map((holding) => (
                <tr key={holding.symbol} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{holding.symbol}</div>
                    <div className="text-sm text-gray-500">{holding.companyName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{holding.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(holding.averagePrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(holding.currentPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(holding.investedValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(holding.currentValue)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getChangeColor(holding.profitLoss)}`}>
                    <div>{formatCurrency(holding.profitLoss)}</div>
                    <div className="text-xs">{formatPercentage(holding.profitLossPercentage)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link to={`/stock/${holding.symbol}`} className="text-blue-600 hover:text-blue-900">
                      Trade
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            No holdings yet. Start trading to build your portfolio!
          </div>
        )}
      </div>
    </div>
  );
}

export default Portfolio;
