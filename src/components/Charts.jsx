import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend,
  ResponsiveContainer
} from 'recharts'

const COLORS = ['#0C447C', '#1D9E75', '#BA7517', '#7F77DD', '#D85A30']

function prepareChartData(csvData){

    const monthOrder = ['Jan','Feb','Mar','Apr','May',
                      'Jun','Jul','Aug','Sep','Oct','Nov','Dec']

    const byMonth = {}
    csvData.forEach((row)=>{
        const month = row.month
        if (!byMonth[month]){
            byMonth[month] = {month, revenue:0,orders:0}
        }
        byMonth[month].revenue+=Number(row.revenue) || 0;
        byMonth[month].orders += Number(row.orders) || 0;
    })
    const monthlyData = Object.values(byMonth).sort((a,b) => monthOrder.indexOf(a.month)- monthOrder.indexOf(b.month))

    //pie chart revenue by category
    const byCategory = {}
    csvData.forEach((row)=>{
        const cat =row.category || 'Uncategorised'
        if (!byCategory[cat]) byCategory[cat] = {name: cat, value:0}
        byCategory[cat].value += Number(row.revenue) || 0
    })
    const categoryData = Object.values(byCategory)

    return {monthlyData,categoryData}
                      

}

function Charts({csvData}){
    const {monthlyData, categoryData} = prepareChartData(csvData)

    return (
        <div>
            {/*Barc chart-reveneue per month*/ }
            <div style={{
                background:'#fff',
                borderRadius:12,
                padding:24,
                marginBottom:24,
                border:'1px solid #e2e8f0'
            }}>
                <h2 style={{
                    fontSize:15,
                    fontWeight:600,
                    marginBottom:20,
                    color:'#1a1a2e'
                }}>Monthly Revenue</h2>
                <ResponsiveContainer width="100%" height = {300}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" fontSize={12}/>
                        <YAxis fontSize={12}/>
                        <Tooltip 
                        formatter = {(value) => [`$${value.toLocaleString()}`,'Revenue']} />
                        <Bar dataKey="revenue" fill = "#0C447C" radius = {[4,4,0,0]} />

                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* orders trend using line charts */}
            <div style={{
                background:'#fff',
                borderRadius: 12,
                padding: 24,
                marginBottom: 24,
                border: '1px solid #e2e8f0'
            }}>
                <h2 style={{
                    fontSize:15,
                    fontWeight:600,
                    marginBottom:20,
                    color:'#1a1a2e'
                }}>Orders Trend</h2>
                <ResponsiveContainer width="100%" height = {300}>
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" fontSize={12}/>
                        <YAxis fontSize={12}/>
                        <Tooltip 
                        formatter = {(value) => [value,'orders']} />
                        <Line
                            type="monotone"
                            dataKey="orders"
                            stroke="#1D9E75"
                            strokeWidth={2}
                            dot={{ fill: '#1D9E75', r: 4 }}
                            />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Revenue by category in pie chart */}
            <div style={{
                background:'#fff',
                borderRadius: 12,
                padding: 24,
                marginBottom: 24,
                border: '1px solid #e2e8f0' }}>
            
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
                }>
                    {categoryData.map((entry, index) => (
                    <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                 <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
        </div>
    )
}

export default Charts;