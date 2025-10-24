import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useMarketStore from '../store/marketStore';
import { formatCurrency, formatPercentage, getChangeColor } from '../utils/formatters';

function Watchlist() {
  const { watchlist, fetchWatchlist, removeFromWatchlist } = useMarketStore();

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (symbol) => {
    try {
      await removeFromWatchlist(symbol);
      toast.success('Removed from watchlist');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Watchlist</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {watchlist && watchlist.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {watchlist.map((item) => (
                <tr key={item.symbol} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.symbol}</div>
                    <div className="text-sm text-gray-500">{item.companyName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.marketData ? formatCurrency(item.marketData.currentPrice) : '-'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.marketData ? getChangeColor(item.marketData.changePercent) : ''}`}>
                    {item.marketData ? formatPercentage(item.marketData.changePercent) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.marketData?.volume?.toLocaleString() || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                    <Link to={`/stock/${item.symbol}`} className="text-blue-600 hover:text-blue-900">
                      View
                    </Link>
                    <button
                      onClick={() => handleRemove(item.symbol)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            Your watchlist is empty. Add stocks to track them here!
          </div>
        )}
      </div>
    </div>
  );
}

export default Watchlist;
