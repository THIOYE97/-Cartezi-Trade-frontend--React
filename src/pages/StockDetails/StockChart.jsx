import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarketChart } from "@/Redux/Coin/CoinSlice";
import { useTheme } from "@/context/ThemeContext";

const timeSeries = [
  { keyword: "DIGITAL_CURRENCY_DAILY", key: "Time Series (Daily)", lable: "1D", value: 1 },
  { keyword: "DIGITAL_CURRENCY_WEEKLY", key: "Weekly Time Series", lable: "1W", value: 7 },
  { keyword: "DIGITAL_CURRENCY_MONTHLY", key: "Monthly Time Series", lable: "1M", value: 30 },
  { keyword: "DIGITAL_CURRENCY_MONTHLY_3", key: "3 Month Time Series", lable: "3M", value: 90 },
  { keyword: "DIGITAL_CURRENCY_MONTHLY_6", key: "6 Month Time Series", lable: "6M", value: 180 },
  { keyword: "DIGITAL_CURRENCY_YEARLY", key: "Yearly Time Series", lable: "1Y", value: 365 },
];

const StockChart = ({ coinId }) => {
  const [activeType, setActiveType] = useState(timeSeries[0]);
  const [chartType, setChartType] = useState("line"); // line, area, bar
  const { coin, auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const series = [{
    name: "Price",
    data: coin.marketChart.data
  }];

  const getChartOptions = (type) => ({
    chart: {
      id: "price-chart",
      type: type,
      height: 400,
      zoom: { enabled: true },
      toolbar: { show: false },
      background: "transparent",
      foreColor: isLight ? "#525252" : "#737373",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        dynamicAnimation: { speed: 350 },
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: "datetime",
      tickAmount: 6,
      labels: {
        style: {
          colors: isLight ? "#525252" : "#a3a3a3",
          fontSize: "11px",
          fontFamily: "Inter, sans-serif",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: {
        stroke: { color: isLight ? "#e5e5e5" : "#404040" },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isLight ? "#525252" : "#a3a3a3",
          fontSize: "11px",
          fontFamily: "Inter, sans-serif",
        },
        formatter: (value) => "$" + value?.toLocaleString(),
      },
    },
    colors: type === "bar" ? ["#22c55e"] : [isLight ? "#000000" : "#ffffff"],
    stroke: {
      curve: "smooth",
      width: type === "bar" ? 0 : 2,
    },
    markers: {
      size: 0,
      hover: { size: 4 },
    },
    tooltip: {
      theme: isLight ? "light" : "dark",
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
      x: { format: "dd MMM yyyy" },
      y: {
        formatter: (value) => "$" + value?.toLocaleString(),
      },
    },
    fill: {
      type: type === "area" ? "gradient" : "solid",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
      opacity: type === "bar" ? 0.8 : 1,
    },
    grid: {
      borderColor: isLight ? "#e5e5e5" : "#262626",
      strokeDashArray: 0,
      show: true,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: "60%",
      },
    },
  });

  useEffect(() => {
    if (coinId) {
      dispatch(fetchMarketChart({
        coinId,
        days: activeType.value,
        jwt: localStorage.getItem("jwt") || auth.jwt
      }));
    }
  }, [coinId, activeType.value]);

  if (coin.marketChart.loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className={`w-8 h-8 border-2 rounded-full animate-spin ${isLight
          ? "border-gray-200 border-t-black"
          : "border-neutral-700 border-t-white"
          }`} />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        {/* Time Period Tabs */}
        <div className="flex items-center gap-1">
          {timeSeries.map((item) => (
            <Button
              onClick={() => setActiveType(item)}
              key={item.lable}
              variant="ghost"
              size="sm"
              className={`px-3 h-8 text-xs font-medium rounded-lg transition-all ${activeType.lable === item.lable
                ? isLight
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-white text-black hover:bg-neutral-200"
                : isLight
                  ? "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  : "text-neutral-500 hover:text-white hover:bg-neutral-800"
                }`}
            >
              {item.lable}
            </Button>
          ))}
        </div>

        {/* Chart Type Toggle */}
        <div className={`flex items-center gap-1 p-1 rounded-lg ${isLight ? "bg-gray-100" : "bg-neutral-900"
          }`}>
          {[
            { type: "line", label: "Line" },
            { type: "area", label: "Area" },
            { type: "bar", label: "Bar" },
          ].map((item) => (
            <button
              key={item.type}
              onClick={() => setChartType(item.type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${chartType === item.type
                ? isLight
                  ? "bg-white text-black shadow-sm"
                  : "bg-neutral-800 text-white"
                : isLight
                  ? "text-gray-500 hover:text-gray-900"
                  : "text-neutral-500 hover:text-white"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <ReactApexChart
          options={getChartOptions(chartType)}
          series={series}
          type={chartType}
          height={400}
        />
      </div>
    </div>
  );
};

export default StockChart;
