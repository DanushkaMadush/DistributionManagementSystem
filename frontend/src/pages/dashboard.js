import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  // Branch-wise sales data (pie chart)
  const branchSalesData = useMemo(
    () => ({
      labels: ['Jaffna', 'Trincomalee', 'Galle', 'Colombo', 'Kandy'],
      datasets: [
        {
          label: 'Sales (LKR)',
          data: [450000, 520000, 680000, 950000, 580000],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(153, 102, 255, 0.7)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 2,
        },
      ],
    }),
    []
  );

  // Monthly sales trend (line chart)
  const monthlySalesData = useMemo(
    () => ({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Jaffna',
          data: [380000, 420000, 450000, 410000, 480000, 520000, 490000, 510000, 540000, 580000, 600000, 450000],
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Trincomalee',
          data: [420000, 450000, 480000, 500000, 520000, 540000, 560000, 580000, 600000, 620000, 650000, 520000],
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Galle',
          data: [500000, 520000, 580000, 620000, 660000, 680000, 700000, 720000, 750000, 780000, 800000, 680000],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Colombo',
          data: [800000, 850000, 900000, 920000, 950000, 980000, 1000000, 1020000, 1050000, 1100000, 1150000, 950000],
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Kandy',
          data: [450000, 480000, 520000, 540000, 560000, 580000, 600000, 620000, 640000, 660000, 680000, 580000],
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    }),
    []
  );

  // Branch-wise orders (bar chart)
  const branchOrdersData = useMemo(
    () => ({
      labels: ['Jaffna', 'Trincomalee', 'Galle', 'Colombo', 'Kandy'],
      datasets: [
        {
          label: 'Total Orders',
          data: [85, 95, 120, 180, 110],
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
        },
        {
          label: 'Completed Orders',
          data: [78, 88, 110, 165, 100],
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
        },
      ],
    }),
    []
  );

  // Product category sales (doughnut chart)
  const productCategoryData = useMemo(
    () => ({
      labels: ['Dairy', 'Grains', 'Vegetables', 'Beverages', 'Snacks'],
      datasets: [
        {
          label: 'Sales by Category',
          data: [850000, 920000, 680000, 750000, 580000],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(153, 102, 255, 0.7)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 2,
        },
      ],
    }),
    []
  );

  // KPI Statistics
  const kpis = useMemo(
    () => [
      {
        title: 'Total Sales',
        value: 'LKR 3,780,000',
        change: '+12.5%',
        trend: 'up',
        icon: 'bi-graph-up',
        color: 'primary',
      },
      {
        title: 'Total Orders',
        value: '590',
        change: '+8.2%',
        trend: 'up',
        icon: 'bi-box-seam',
        color: 'success',
      },
      {
        title: 'Active Branches',
        value: '5',
        change: '0%',
        trend: 'stable',
        icon: 'bi-geo-alt',
        color: 'info',
      },
      {
        title: 'Avg Order Value',
        value: 'LKR 6,407',
        change: '+4.1%',
        trend: 'up',
        icon: 'bi-wallet',
        color: 'warning',
      },
    ],
    []
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h3 className="mb-1">
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard
        </h3>
        <p className="text-muted mb-0">Welcome back! Here's your sales overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="col-12 col-sm-6 col-lg-3">
            <div className="card border-light h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <p className="text-muted small mb-1">{kpi.title}</p>
                    <h5 className="mb-0">{kpi.value}</h5>
                  </div>
                  <i className={`bi ${kpi.icon} text-${kpi.color} fs-4`}></i>
                </div>
                <small className={`text-${kpi.trend === 'up' ? 'success' : kpi.trend === 'down' ? 'danger' : 'muted'}`}>
                  <i className={`bi bi-arrow-${kpi.trend === 'up' ? 'up' : 'down'}-short me-1`}></i>
                  {kpi.change}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="row g-3 mb-4">
        {/* Pie Chart - Branch Sales */}
        <div className="col-12 col-lg-6">
          <div className="card border-dark h-100">
            <div className="card-header">Branch-wise Sales Distribution</div>
            <div className="card-body">
              <div style={{ position: 'relative', height: '300px' }}>
                <Pie data={branchSalesData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Doughnut Chart - Category Sales */}
        <div className="col-12 col-lg-6">
          <div className="card border-dark h-100">
            <div className="card-header">Sales by Product Category</div>
            <div className="card-body">
              <div style={{ position: 'relative', height: '300px' }}>
                <Doughnut data={productCategoryData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="row g-3 mb-4">
        {/* Bar Chart - Orders */}
        <div className="col-12 col-lg-6">
          <div className="card border-dark h-100">
            <div className="card-header">Branch-wise Order Summary</div>
            <div className="card-body">
              <div style={{ position: 'relative', height: '300px' }}>
                <Bar data={branchOrdersData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Table */}
        <div className="col-12 col-lg-6">
          <div className="card border-dark h-100">
            <div className="card-header">Top Performing Branches</div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Branch</th>
                      <th className="text-end">Sales</th>
                      <th className="text-end">Orders</th>
                      <th className="text-end">Avg Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-bold">Colombo</td>
                      <td className="text-end">LKR 950,000</td>
                      <td className="text-end">180</td>
                      <td className="text-end">LKR 5,278</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Galle</td>
                      <td className="text-end">LKR 680,000</td>
                      <td className="text-end">120</td>
                      <td className="text-end">LKR 5,667</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Kandy</td>
                      <td className="text-end">LKR 580,000</td>
                      <td className="text-end">110</td>
                      <td className="text-end">LKR 5,273</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Trincomalee</td>
                      <td className="text-end">LKR 520,000</td>
                      <td className="text-end">95</td>
                      <td className="text-end">LKR 5,474</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Jaffna</td>
                      <td className="text-end">LKR 450,000</td>
                      <td className="text-end">85</td>
                      <td className="text-end">LKR 5,294</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="row g-3">
        {/* Line Chart - Monthly Trend */}
        <div className="col-12">
          <div className="card border-dark">
            <div className="card-header">Monthly Sales Trend (Last Year)</div>
            <div className="card-body">
              <div style={{ position: 'relative', height: '350px' }}>
                <Line data={monthlySalesData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}