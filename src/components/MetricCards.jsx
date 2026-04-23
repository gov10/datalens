export default function MetricCards({csvData}){
    //calculate all metrics from raw data
    const totalRevenue = csvData.reduce((sum,row)=>
        sum +(Number(row.revenue) || 0),0)

    const totalOrders = csvData.reduce((sum,row)=>
        sum+ (Number(row.orders)||0),0)

    const avgOrder = totalOrders>0
        ? Math.round(totalRevenue/totalOrders) : 0

    //group revenue by month

    const byMonth = {}
    csvData.forEach((row) =>{
        if (!byMonth[row.month]) byMonth[row.month] = 0
        byMonth[row.month] += Number(row.revenue) || 0
    })

    const monthEntries = Object.entries(byMonth)
    .sort((a,b)=> b[1]-a[1])

    const bestMonth = monthEntries[0]?.[0] || '-'
    const worstMonth = monthEntries[monthEntries.length-1]?.[0] || '-'

    // group revenue by item

    const byItem ={}
    csvData.forEach((row)=>{
        if (!byItem[row.item]) byItem[row.item] = 0
        byItem[row.item] += Number(row.revenue) || 0
    })
    const topItem = Object.entries(byItem)
    .sort ((a,b)=>b[1]-a[1])[0]?.[0] || '-'

    // define all six cards
    const cards = [
            {
            label: 'Total Revenue',
            value: `$${totalRevenue.toLocaleString()}`,
            icon: '💰',
            bg: '#E6F1FB',
            color: '#0C447C'
            },
            {
            label: 'Total Orders',
            value: totalOrders.toLocaleString(),
            icon: '🛒',
            bg: '#E1F5EE',
            color: '#085041'
            },
            {
            label: 'Avg Order Value',
            value: `$${avgOrder}`,
            icon: '📊',
            bg: '#FAEEDA',
            color: '#633806'
            },
            {
            label: 'Best Month',
            value: bestMonth,
            icon: '🏆',
            bg: '#EEEDFE',
            color: '#3C3489'
            },
            {
            label: 'Top Item',
            value: topItem,
            icon: '⭐',
            bg: '#E1F5EE',
            color: '#085041'
            },
            {
            label: 'Worst Month',
            value: worstMonth,
            icon: '📉',
            bg: '#FCEBEB',
            color: '#A32D2D'
            },

    ]

    return (
        <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(3,1fr)',
            gap:12,
            marginBottom:24
        }}>
            {cards.map((card)=>(
                <div key={card.label} style={{
                    background:card.bg,
                    borderRadius:12,
                    padding:'16px 20px',
                    minWidth:0,
                    overflow:'hidden'

                    }}>
                        <div style={{ fontSize:20,marginBottom:8}}>
                            {card.icon}
                        </div>
                        <div style={{
                            fontSize:11,
                            color: card.color,
                            textTransform:'uppercase',
                            letterSpacing:'0.06em',
                            fontWeight:500,
                            opacity:0.8
                        }}>
                            {card.label}

                        </div>
                        <div style={{
                            fontSize:22,
                            fontWeight:600,
                            color:card.color
                        }}>
                            {card.value}

                        </div>

                    </div>
            ))}
        </div>
    )


}