import {
          BarChart, Bar,
          LineChart, Line,
          PieChart, Pie, Cell,
          XAxis, YAxis, CartesianGrid,
          Tooltip, Legend,
          ResponsiveContainer
            } from 'recharts'

    const COLORS = ['#EA580C', '#7C2D12', '#EAB308', '#FB923C', '#FCD34D']

    function prepareChartData(csvData) {
      const monthOrder = ['Jan','Feb','Mar','Apr','May',
                          'Jun','Jul','Aug','Sep','Oct','Nov','Dec']

      const byMonth = {}
      csvData.forEach((row) => {
        const month = row.month
        if (!byMonth[month]) {
          byMonth[month] = { month, revenue: 0, orders: 0 }
        }
        byMonth[month].revenue += Number(row.revenue) || 0
        byMonth[month].orders += Number(row.orders) || 0
      })

      const monthlyData = Object.values(byMonth)
        .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month))

      const byCategory = {}
      csvData.forEach((row) => {
        const cat = row.category || 'Uncategorised'
        if (!byCategory[cat]) byCategory[cat] = { name: cat, value: 0 }
        byCategory[cat].value += Number(row.revenue) || 0
      })

      const categoryData = Object.values(byCategory)

      return { monthlyData, categoryData }
    }

    function Charts({ csvData, currency='$' }) {
      const { monthlyData, categoryData } = prepareChartData(csvData)

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Bar chart — revenue per month */}
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: '#1a1a2e' }}>
              Monthly Revenue
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value) => [`${currency}${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#EA580C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line chart — orders trend */}
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: '#1a1a2e' }}>
              Orders Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value) => [value, 'Orders']} />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#7C2D12"
                  strokeWidth={2}
                  dot={{ fill: '#7C2D12', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart — revenue by category */}
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: '#1a1a2e' }}>
              Revenue by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${currency}${value.toLocaleString()}`, 'Revenue']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      )
    }

    export default Charts