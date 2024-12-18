import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const EarningStatistics = () => {
  const [period, setPeriod] = useState('daily');
  const [earningsData, setEarningsData] = useState([]);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/earnings-report/?period=${period}`);
        
        // Set total earnings data for cards
        setDailyTotal(response.data.daily_total?.total_amount || 0);
        setWeeklyTotal(response.data.weekly_total?.total_amount || 0);
        setMonthlyTotal(response.data.monthly_total?.total_amount || 0);
        
        // Set chart data
        setEarningsData(response.data.earnings || []);
      } catch (error) {
        console.error("Error fetching earnings data:", error);
        setError("Failed to fetch earnings data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, [period]);

  const chartData = {
    labels: earningsData.map(entry => entry.day || entry.week || entry.month),
    datasets: [
      {
        label: `Total Earnings (${period.charAt(0).toUpperCase() + period.slice(1)})`,
        data: earningsData.map(entry => entry.total_amount),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">
        Earning Statistics
      </h1>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setPeriod("daily")}
          className={`px-4 py-2 rounded-md ${
            period === "daily" ? "bg-rose-700 text-white" : "bg-gray-200"
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setPeriod("weekly")}
          className={`px-4 py-2 rounded-md ${
            period === "weekly" ? "bg-rose-700 text-white" : "bg-gray-200"
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setPeriod("monthly")}
          className={`px-4 py-2 rounded-md ${
            period === "monthly" ? "bg-rose-700 text-white" : "bg-gray-200"
          }`}
        >
          Monthly
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 w-full ">
        <div className="p-4 bg-[#D8EFD3] rounded border border-gray-500 text-center">
          <h3 className="text-lg font-semibold">Daily Earnings</h3>
          <p className="text-2xl">${dailyTotal.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-[#FEEFAD] rounded border border-gray-500 text-center">
          <h3 className="text-lg font-semibold">Weekly Earnings</h3>
          <p className="text-2xl">${weeklyTotal.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-[#CAF4FF] rounded border border-gray-500 text-center">
          <h3 className="text-lg font-semibold">Monthly Earnings</h3>
          <p className="text-2xl">${monthlyTotal.toFixed(2)}</p>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="w-full max-w-3xl mt-6">
        <Bar
          data={chartData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
    </div>
  );
};

export default EarningStatistics;
