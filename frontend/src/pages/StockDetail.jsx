import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useMarketStore from '../store/marketStore';
import usePortfolioStore from '../store/portfolioStore';
import { formatCurrency, formatPercentage, getChangeColor } from '../utils/formatters';

function StockDetail() {
  const { symbol } = useParams();
  const { selectedStock, fetchStockBySymbol } = useMarketStore();
  const { buyStock, sellStock, dematAccount } = usePortfolioStore();
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('BUY');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStockBySymbol(symbol);
  }, [symbol]);

  const handleOrder = async () => {
    if (quantity <= 0) {
      toast.error('Please enter valid quantity');
      return;
    }

    setLoading(true);
    try {
      if (orderType === 'BUY') {
        await buyStock({ symbol, quantity });
        toast.success(`Successfully bought ${quantity} shares of ${symbol}`);
      } else {
        await sellStock({ symbol, quantity });
        toast.success(`Successfully sold ${quantity} shares of ${symbol}`);
      }
      setQuantity(1);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedStock) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>;
  }

  const totalAmount = selectedStock.currentPrice * quantity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="border-b pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{selectedStock.companyName}</h1>
          <p className="text-lg text-gray-600 mt-1">{selectedStock.symbol}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-8">
              <p className="text-4xl font-bold text-gray-900">{formatCurrency(selectedStock.currentPrice)}</p>
              <p className={`text-lg mt-2 ${getChangeColor(selectedStock.changePercent)}`}>
                {formatCurrency(selectedStock.change)} ({formatPercentage(selectedStock.changePercent)})
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-sm text-gray-600">Open</p>
                <p className="text-lg font-semibold">{formatCurrency(selectedStock.openPrice)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Previous Close</p>
                <p className="text-lg font-semibold">{formatCurrency(selectedStock.previousClose)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Day High</p>
                <p className="text-lg font-semibold">{formatCurrency(selectedStock.dayHigh)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Day Low</p>
                <p className="text-lg font-semibold">{formatCurrency(selectedStock.dayLow)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">52W High</p>
                <p className="text-lg font-semibold">{formatCurrency(selectedStock.weekHigh52)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">52W Low</p>
                <p className="text-lg font-semibold">{formatCurrency(selectedStock.weekLow52)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Place Order</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setOrderType('BUY')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium ${
                    orderType === 'BUY'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setOrderType('SELL')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium ${
                    orderType === 'SELL'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  SELL
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-6 p-4 bg-white rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Price per share:</span>
                <span className="font-semibold">{formatCurrency(selectedStock.currentPrice)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-semibold">{quantity}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-bold text-lg">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Available Balance: {formatCurrency(dematAccount?.cashBalance || 0)}
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md font-semibold text-white ${
                orderType === 'BUY'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              } disabled:opacity-50`}
            >
              {loading ? 'Processing...' : `${orderType} ${quantity} Shares`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockDetail;
