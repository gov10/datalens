import useWindowSize from './hooks/useWindowSize'

export default function MetricCards({csvData, currency = '$'}){
    const { isMobile } = useWindowSize()
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
            value: `${currency}${totalRevenue.toLocaleString()}`,
            icon: '💰',
            bg: '#FFEDD5',
            color: '#7C2D12'
            },
            {
            label: 'Total Orders',
            value: totalOrders.toLocaleString(),
            icon: '🛒',
            bg: '#FEF3C7',
            color: '#78350F'
            },
            {
            label: 'Avg Order Value',
            value: `${currency}${avgOrder}`,
            icon: '📊',
            bg: '#FEE2E2',
            color: '#991B1B'
            },
            {
            label: 'Best Month',
            value: bestMonth,
            icon: '🏆',
            bg: '#FFEDD5',
            color: '#7C2D12'
            },
            {
            label: 'Top Item',
            value: topItem,
            icon: '⭐',
            bg: '#FEF9C3',
            color: '#713F12'
            },
            {
            label: 'Worst Month',
            value: worstMonth,
            icon: '📉',
            bg: '#FEE2E2',
            color: '#991B1B'
            },

    ]

    return (
        <div style={{
            display:'grid',

            gridTemplateColumns:isMobile ? '1fr 1fr': 'repeat(3,1fr)',
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
                        <div style={{ fontSize:20}}>
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