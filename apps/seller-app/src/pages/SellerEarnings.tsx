import React, { useState, useEffect } from 'react';
import { Spinner } from '3a-ecommerce-ui-library';
import { formatIndianCompact } from '3a-ecommerce-utils';
import { orderApi, handleApiError } from '../api/client';
import { useSellerAuthStore } from '../store/authStore';

interface MonthlyEarning {
  period: string;
  monthKey: string;
  revenue: number;
  orders: number;
  commission: number;
  payout: number;
}

interface EarningsSummary {
  totalRevenue: number;
  totalOrders: number;
  totalCommission: number;
  totalPayout: number;
  commissionRate: number;
}

export const SellerEarnings: React.FC = () => {
  const { user } = useSellerAuthStore();
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyEarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!user?.id) {
        setError('Seller ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await orderApi.getSellerEarnings(user.id);
        const { summary: summaryData, monthlyEarnings: monthlyData } = response.data.data;

        setSummary(summaryData);
        setMonthlyEarnings(monthlyData || []);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [user?.id]);

  return (
    <div className="max-w-7xl mx-auto px-8 py-4">
      <h1 className="ml-12 lg:ml-0 text-4xl font-bold text-gray-900 mb-8">Sales & Earnings</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatIndianCompact(summary?.totalRevenue || 0)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summary?.totalOrders || 0}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-medium">
                Commission ({((summary?.commissionRate || 0.1) * 100).toFixed(0)}%)
              </p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {formatIndianCompact(summary?.totalCommission || 0)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-medium">Payout</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {formatIndianCompact(summary?.totalPayout || 0)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payout
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyEarnings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No earnings data available yet. Start selling to see your earnings!
                    </td>
                  </tr>
                ) : (
                  monthlyEarnings.map((earning) => (
                    <tr key={earning.monthKey}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {earning.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatIndianCompact(earning.revenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {earning.orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                        {formatIndianCompact(earning.commission)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatIndianCompact(earning.payout)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
