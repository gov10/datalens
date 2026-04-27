 export default function AutoInsights({csvData}){
    
    function generateInsights(){
        if(!csvData.length) return []
        const insights = []

        //group by months
        const byMonth = {}
        csvData.forEach((row)=>{
            if (!byMonth[row.month]) byMonth[row.month]=0
            byMonth[row.month] +=Number(row.revenue) || 0
        })

        //group by Item
        const byItem = {}
        csvData.forEach((row)=>{
            if(!byItem[row.item]) byItem[row.item] = 0
            byItem[row.item] +=Number(row.revenue)
        })

        //group by category
        const byCategory = {}
        csvData.forEach((row)=>{
            const cat = (row.category || 'Uncategorised')
            .toLowerCase()
            .replace(/\b\w/g, c => c.toUpperCase()) 
            if (!byCategory[cat]) byCategory[cat] = 0
            byCategory[cat] += Number(row.revenue)
        })
        const totalRevenue = csvData.reduce((sum,row)=>
        sum + (Number(row.revenue)|| 0),0)

        const totalOrders = csvData.reduce((sum,row)=>
        sum+(Number(row.orders)||0),0)

        const itemEntries = Object.entries(byItem).sort((a,b)=>b[1]-a[1])

        const monthEntries = Object.entries(byMonth).sort((a,b)=>b[1]-a[1])

        const catEntries = Object.entries(byCategory).sort((a,b)=>b[1]-a[1])

        //insight 1 top item

        if (itemEntries.length>0){
            const [topItem,topRevenue] = itemEntries[0]
            const pct = Math.round((topRevenue/totalRevenue)*100)
            insights.push({
                icon: '⭐',
                color:'#E1F5EE',
                textColor:'#085041',
                title:`${topItem} is your best seller`,
                detail:`Contributing ${pct}% of total revenue-$${topRevenue.toLocaleString()} overall. Keep it well stocked and prmonently on your menu `

            })
        }

        //Insight 2 worst item

        if (itemEntries.length>1){
            const [worstItem, worstRevenue] = itemEntries[itemEntries.length-1]
            const pct = Math.round((worstRevenue/totalRevenue)*100)
            insights.push({
                icon: '⚠️',
                color: '#FCEBEB',
                textColor: '#A32D2D',
                title: `${worstItem} is underperforming`,
                detail: `Only ${pct}% of total revenue $${worstRevenue.toLocaleString()}. Consider a promotion, a price reduction, or replacing it entirely.`

            })
        }
        //insight 3 best month
        if(monthEntries.length>0){
            const [bestMonth, bestRevenue] = monthEntries[0] 
            insights.push({
                icon: '🏆',
                color: '#FAEEDA',
                textColor: '#633806',
                title: `${bestMonth} was your strongest month`,
                detail: `Revenue peaked at $${bestRevenue.toLocaleString()}. Make sure you are fully staffed and stocked during this period next year.`

            })
        }
        //insight 4 worst month

        if(monthEntries.length>1){
            const [worstMonth,worstRevenue] = monthEntries[monthEntries.length-1]
            insights.push({
                icon: '📉',
                color: '#FCEBEB',
                textColor: '#A32D2D',
                title: `${worstMonth} was your slowest month`,
                detail: `Revenue dropped to $${worstRevenue.toLocaleString()}. Consider running promotions or special events during this period next year.`
            })

        }

        //insight 5 category breakdown

        if(catEntries.length>1){
            const [topCat, topCatRev] = catEntries[0]
            const [bottomCat,bottomCatRev] = catEntries[catEntries.length-1]
            const topPct = Math.round((topCatRev/totalRevenue)*100)
            const bottomPct = Math.round((bottomCatRev/totalRevenue)*100)
            insights.push({
                icon: '📊',
                color: '#E6F1FB',
                textColor: '#0C447C',
                title: `${topCat} dominates your revenue at ${topPct}%`,
                detail: `${bottomCat} only contributes ${bottomPct}%. ${bottomPct < 15
                ? `Consider promoting your ${bottomCat} more — bundle deals or happy hour specials could help.`
                : 'Good balance across categories.'
                }`
            })

        }
        //insight 6 trend of revenue
        const monthOrder = ['Jan','Feb','Mar','Apr','May',
                        'Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        const sortedMonths = Object.entries(byMonth).sort((a,b)=>monthOrder.indexOf(a[0])-monthOrder.indexOf(b[0]))

        if(sortedMonths.length>=3){
            const first = sortedMonths[0][1]
            const last = sortedMonths[sortedMonths.length-1][1]
            const growth = Math.round(((last-first)/first)*100)

            if (growth > 0) {
                insights.push({
                icon: '📈',
                color: '#E1F5EE',
                textColor: '#085041',
                title: `Revenue grew ${growth}% over the period`,
                detail: `From $${first.toLocaleString()} in ${sortedMonths[0][0]} to $${last.toLocaleString()} in ${sortedMonths[sortedMonths.length - 1][0]}. Strong growth, keep doing what is working.`
                })
                } else if (growth < 0) {
                    insights.push({
                    icon: '📉',
                    color: '#FCEBEB',
                    textColor: '#A32D2D',
                    title: `Revenue declined ${Math.abs(growth)}% over the period`,
                    detail: `From $${first.toLocaleString()} in ${sortedMonths[0][0]} to $${last.toLocaleString()} in ${sortedMonths[sortedMonths.length - 1][0]}. Review your pricing and menu to reverse this trend.`
                    })
                } else {
                    insights.push({
                    icon: '➡️',
                    color: '#FAEEDA',
                    textColor: '#633806',
                    title: `Revenue stayed flat over the period`,
                    detail: `No significant growth or decline. Consider new menu items or promotions to drive growth.`
                    })
                }
        }
             // INSIGHT 7 avg order value
            if (totalOrders > 0) {
            const avg = Math.round(totalRevenue / totalOrders)
            insights.push({
                icon: '🛒',
                color: '#EEEDFE',
                textColor: '#3C3489',
                title: `Average order value is $${avg}`,
                detail: avg < 15
                ? `This is relatively low. Consider upselling strategies, combo deals, add-ons, or premium menu items could increase this.`
                : avg < 30
                ? `Healthy average order value. Upselling desserts or drinks could push this higher.`
                : `Strong average order value. Your customers are spending well.`
            })
            }

            return insights


            }

            const insights = generateInsights()
            if (!insights.length) return null

            return(
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
                        color:'#1a1a2e',
                        marginBottom:16
                    }}>
                        Auto Insights
                    </h2>
                    <div style={{
                        display:'flex',
                        flexDirection:'column',
                        gap:10
                    }}>
                        {insights.map((insight,i)=>(
                            <div key={i} style={{
                                background:insight.color,
                                borderRadius:10,
                                padding:'12px 16px',
                                display:'flex',
                                gap:12,
                                alignItems:'flex-start'
                            }}>
                                <div style={{fontSize:20,flexShrink:0}}>
                                    {insight.icon}
                                </div>
                                <div>
                                    <div style={{
                                        fontSize:13, 
                                        fontWeight:600,
                                        color:insight.textColor,
                                        marginBottom:3
                                    }}>
                                        {insight.title}
                                    </div>
                                    <div style={{
                                        fontSize:13,
                                        color:insight.textColor,
                                        opacity:0.85,
                                        lineHeight:1.6
                                    }}>
                                        {insight.detail}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            )
}

