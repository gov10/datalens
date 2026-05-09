import {useState,useEffect} from 'react';
import Papa from 'papaparse'
import Charts from './Charts'
import MetricCards from './MetricCards';
import CollapsableTable from './CollapsableTable';
import AutoInsights from './AutoInsights';
import ColumnMapper from './ColumnMapper';

//Data Cleaning layer
const wordToNumber = {
  'zero': 0, 'one': 1, 'two': 2, 'three': 3,
  'four': 4, 'five': 5, 'six': 6, 'seven': 7,
  'eight': 8, 'nine': 9, 'ten': 10,
  'eleven': 11, 'twelve': 12, 'thirteen': 13,
  'fourteen': 14, 'fifteen': 15, 'sixteen': 16,
  'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
  'twenty': 20, 'thirty': 30, 'forty': 40,
  'fifty': 50, 'sixty': 60, 'seventy': 70,
  'eighty': 80, 'ninety': 90, 'hundred': 100,
  'thousand': 1000, 'million': 1000000
}

function parsedSmartNumber(value){
    if(!value && value !==0) return null

    const cleaned = value.toString()
    .replace(/[$£€¥₹]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

    // already a number — return it
    const direct = Number(cleaned)
    if (!isNaN(direct) && cleaned!=='') return direct

     // remove commas — "2,800" → 2800
    const noCommas = cleaned.replace(/,/g, '') 
    if(!isNaN(Number(noCommas)) && noCommas !=='') return Number(noCommas)

     // handle "2.8k" or "2.8K" → 2800
     const kMatch = cleaned.match(/^([\d.]+)\s*k$/i)
     if(kMatch) return Math.round(parseFloat(kMatch[1])*1000)

    // handle "2.8m" or "2.8M" → 2800000
    const mMatch = cleaned.match(/^([\d.]+)\s*m$/i)
    if (mMatch) return Math.round(parseFloat(mMatch[1])*1000000)
    
    //handwritten numbers
    const words = cleaned.toLowerCase().split(/[\s-]+/)
    let result = 0
    let current = 0

    for (const word of words){
        const num = wordToNumber[word]
        if (num ===undefined) continue
        if (num === 1000000){
            current = current === 0?1 : current
            result +=current*num
            current = 0
        } else if (num ===1000){
            current = current === 0?1:current
            result +=current*num
            current = 0
        } else if (num ===100){
            current = current ===0?1:current
            current*=num
        
        } else{
            current +=num
        }
    
    }

    const total = result + current
    return total > 0 ? total :null
}

const monthMap = {
 // January
  'jan': 'Jan', 'jan.': 'Jan', 'january': 'Jan', 'janvier': 'Jan',

  // February
  'feb': 'Feb', 'feb.': 'Feb', 'febr': 'Feb', 'february': 'Feb',

  // March
  'mar': 'Mar', 'mar.': 'Mar', 'march': 'Mar', 'marc': 'Mar',

  // April
  'apr': 'Apr', 'apr.': 'Apr', 'april': 'Apr', 'aprl': 'Apr',

  // May
  'may': 'May', 'may.': 'May',

  // June
  'jun': 'Jun', 'jun.': 'Jun', 'june': 'Jun',

  // July
  'jul': 'Jul', 'jul.': 'Jul', 'july': 'Jul', 'jly': 'Jul',

  // August
  'aug': 'Aug', 'aug.': 'Aug', 'august': 'Aug', 'agust': 'Aug',

  // September
  'sep': 'Sep', 'sep.': 'Sep', 'sept': 'Sep', 'sept.': 'Sep',
  'september': 'Sep', 'setember': 'Sep',

  // October
  'oct': 'Oct', 'oct.': 'Oct', 'october': 'Oct', 'octo': 'Oct',

  // November
  'nov': 'Nov', 'nov.': 'Nov', 'november': 'Nov', 'novem': 'Nov',

  // December
  'dec': 'Dec', 'dec.': 'Dec', 'december': 'Dec', 'decem': 'Dec',

  // Numbers some systems export month as number
  '1': 'Jan', '01': 'Jan',
  '2': 'Feb', '02': 'Feb',
  '3': 'Mar', '03': 'Mar',
  '4': 'Apr', '04': 'Apr',
  '5': 'May', '05': 'May',
  '6': 'Jun', '06': 'Jun',
  '7': 'Jul', '07': 'Jul',
  '8': 'Aug', '08': 'Aug',
  '9': 'Sep', '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
}

function normaliseMonth(value){
    if (!value) return null;
    const str = value.toString().toLowerCase().trim()

    const timestamp = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
    if (timestamp) return monthMap[timestamp[2]] || str

     //handle DD-MM-YYYY format like "07-03-2022"
    const ddmmyyyy = str.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/)
    if (ddmmyyyy) return monthMap[ddmmyyyy[2]] || str

    //  handle MM/DD/YYYY format like "03/07/2022"
    const mmddyyyy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
    if (mmddyyyy) return monthMap[mmddyyyy[1]] || str

    // handle formats like "2022-01" or "01-2022" extract month number
    const dashMatch = str.match(/^(\d{4})-(\d{1,2})$/)
    if (dashMatch) return monthMap[dashMatch[2]] || str

    const slashMatch = str.match(/^(\d{1,2})\/(\d{4})$/)
    if (slashMatch) return monthMap[slashMatch[1]] || str

    // handle "Jan 2022" or "January 2022" extract just month name
    const spaceMatch = str.match(/^([a-z]+)\s+\d{4}$/)
    if (spaceMatch) return monthMap[spaceMatch[1]] || str

    // standard lookup
    return monthMap[str] || value.trim()

}



//text cleaner
function cleanText(value,fallback = ''){
    if (!value) return fallback
    return value.toString().trim()
}

//median calculator

function getMedian(numbers){
    const valid = numbers.filter(n =>n !== null && n> 0)
    if (!valid.length) return 0
    const sorted = [...valid].sort((a,b)=>a-b)
    const mid = Math.floor(sorted.length/2)
    return sorted.length%2 !==0
    ? sorted[mid]
    :Math.round((sorted[mid-1]+sorted[mid])/2)
}

function aggregateByMonth(rows){
    const grouped = {}
    rows.forEach(row=>{
        const key = `${row.month}__${row.item}`
        if (!grouped[key]){
            grouped[key]={
                month:row.month,
                item:row.item,
                category:row.category,
                revenue: 0 ,
                orders:0
            }
        }
        grouped[key].revenue +=Number(row.revenue)|| 0
        grouped[key].orders += Number(row.orders) || 0
    })
    return Object.values(grouped)
}

//main cleaning function
function cleanData(rows){
    const parsed = rows.map((row)=>({
    ...row,
    month:normaliseMonth(row.month),
    item:cleanText(row.item),
    category: cleanText(row.category,'Uncategorised')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase()),
    revenue: parsedSmartNumber(row.revenue),
    orders: parsedSmartNumber(row.orders)

}))

// calculate medians from valid rows only
const medianRevenue = getMedian(parsed.map(r=>r.revenue))
const medianOrders = getMedian(parsed.map(r=>r.orders))
// split into removed and kept

const kept = parsed.filter(r=> r.month && r.item)
const removed = parsed.filter(r =>!r.month || !r.item)

//impute missing numbers
const imputed = kept.map((row)=>({
    ...row,
    revenue:row.revenue !== null && row.revenue >0
    ?row.revenue
    :medianRevenue,
    orders:row.orders !== null && row.orders >0
    ?row.orders
    :medianOrders
}))

const aggregated = aggregateByMonth(imputed)
return {
    data:aggregated,
    removedCount: removed.length,
    imputedCount:kept.filter(
        (r,i)=>r.revenue !==imputed[i].revenue||
                r.orders !== imputed[i].orders
    ).length
}

}



function Dashboard(){
    const [file,setFile] = useState(null);
    const[csvData,setCsvData] = useState([])
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState('')
    const [parsed, setParsed] = useState(false)
    const [removed, setRemoved] = useState(0)
    const [imputed, setImputed] = useState(0)

    //these are added for column mapper
    const [rawData,setRawData] = useState([])
    const [columns, setColumns] = useState([])
    const [mapping, setMapping] = useState({})
    const [showMapper, setShowMapper] = useState(false)

    async function saveToBackend(data, filename){
        try{
            const response = await fetch('http://localhost:3001/save',{
                method:'POST',
                headers:{'Content-Tppe':'application/json'},
                body:JSON.stringify({
                    filename,totalRows:data.length,
                    columns:Object.keys(data[0]||{}),
                    data
                })
            })
            await response.json()
        }catch(err){
             // silent fail, charts still show from state

        }
    }

    function handleConfirmMapping(){
        const remapped = rawData.map(row=>({
            month:row[mapping.month] || '',
            item:row[mapping.item] || '',
            category: row[mapping.category] || 'Uncategorised',
            revenue: row[mapping.revenue] || 0,
            orders: row[mapping.orders] || 0,
        }))
        const { data, removedCount, imputedCount } = cleanData(remapped)
        setCsvData(data)
        setRemoved(removedCount)
        setImputed(imputedCount)
        setParsed(true)
        setShowMapper(false)
        saveToBackend(data, file.name)
        }
    

    useEffect(()=>{
        fetch('http://localhost:3001/data')
        .then(res =>res.json())
        .then(result=>{
            try{
                //console.log('MongoDB response:', JSON.stringify(result))//debugger
                const uploads = result.uploads
                if(!uploads){
                    //console.log('No uploads field in respons')
                    setLoading(false)
                    return
                }
                if(uploads.length===0){
                   //console.log('Uploads array is empty')
                    setLoading(false)
                    return
                }
                const latest = result.uploads[0]
               // console.log('Latest upload:', latest.filename, latest.totalRows)//debugger

                setCsvData(latest.data)
                setParsed(true)
                setLoading(false)
               

            }catch(err){
                console.log('Error inside then:',err.message)
                setLoading(false)
            }
        })
        .catch(err=>{
            //console.log('network error',err.message)
            setLoading(false)
        })
    },[])

    // useEffect watches file — runs when file changes
    useEffect(()=>{
        if (!file) return // no file yet — do nothing
        if (parsed) return
        

        Papa.parse(file,{
            header:true,
            skipEmptyLines:true,
            complete:async(result) =>{
                const csvColumns = result.meta.fields
                const rows = result.data
                const expectedColumns = ['month','item','revenue']
                const hasExpectedColumns = expectedColumns.every(col =>
                    csvColumns.map(c=>c.toLowerCase()).includes(col.toLowerCase())
                )
                if(hasExpectedColumns){
                    const {data,removedCount, imputedCount} = cleanData(rows)
                    setCsvData(data)
                    setRemoved(removedCount)
                    setImputed(imputedCount)
                    setParsed(true)
                    await saveToBackend(data, file.name)
                }else{
                    setRawData(rows)
                    setColumns(csvColumns)
                    setShowMapper(true)

                    const autoMapping={}
                    csvColumns.forEach(col =>{
                        const lower = col.toLowerCase()
                        if (lower.includes('month') || lower.includes('date') || lower.includes('period'))
                            autoMapping.month = col
                        if (lower.includes('item') || lower.includes('product') || lower.includes('dish') || lower.includes('name'))
                            autoMapping.item = col
                        if (lower.includes('revenue') || lower.includes('sales') || lower.includes('amount') || lower.includes('income'))
                            autoMapping.revenue = col
                        if (lower.includes('order') || lower.includes('qty') || lower.includes('quantity') || lower.includes('count'))
                            autoMapping.orders = col
                        if (lower.includes('category') || lower.includes('type') || lower.includes('dept'))
                            autoMapping.category = col
                        })
                        setMapping(autoMapping)
                }
            },
            error:()=>{
                setError('Could not read file. Please try again.')
            }
            
        })
    },[file])
    return (
        <main style ={{flex:1,background: '#FFF7ED',minWidth: 0, padding: 24}}> 

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',marginBottom:20}}>
                <h1 style={{fontSize:20,fontWeight:600,color:'#7C2D12'}}>Dashboard</h1>
                <button  onClick={() => document.getElementById('csvInput').click() } style={{
                    background:'#EA580C',
                    color:'#fff',
                    border:'none',
                    padding:'8px 20px',
                    borderRadius:8,
                    fontSize: 13,
                    cursor:'pointer'
                }}>Upload CSV</button>
            </div>

             {/* Hidden file input */}
            <input 
            id="csvInput"
            type = "file"
            accept=".csv"
            style={{display:'none'}}
            onChange={(e) => {
                setFile(e.target.files[0])
                setParsed(false)
                setCsvData([])
                setError('')
                setRemoved(0)
                setImputed(0)

            }}
            />

            {/* File Selection confirmation */}
            {file && (
                <div style = {{
                    background: '#FFEDD5',
                    border:'1px solid #FDBA74',
                    borderRadius:8,
                    padding:'10px 14px',
                    marginBottom:20,
                    fontSize:13,
                    color:'#7C2D12'
                }}>Selected: {file.name}</div>
            )}

            {parsed && (removed >0 || imputed>0) && (
                <div style={{
                    background:'#FEF3C7',
                    border:'1px solid #FDE68A',
                    borderRadius:8,
                    padding:'10px 14px',
                    marginBottom:20,
                    fontSize:13,
                    color:'#78350F'

                }}>
                    {removed>0 && `${removed} rows removed.`}
                    {imputed > 0 && `${imputed} values filled with median values`}
                </div>
            )}

           
           
        

            {/* Error Message */}

            {error &&(
                <div style={{
                    background:'#FEE2E2',
                    border: '1px solid #FECACA',
                    borderRadius:8,
                    padding:'10px 14px',
                   
                    fontSize:13,
                    color:'#991B1B'
                }}>X {error}</div>
            )}

            {/**loading state */}

            {loading &&(
                <div style={{
                    border: '2px dashed #FDBA74',
                    borderRadius: 12,
                    padding: '60px 20px',
                    textAlign: 'center',
                    background: '#fff'
                }}>
                    <div style={{fontSize:40,marginBottom:12}}>⏳</div>
                    <div style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: '#7C2D12',
                        marginBottom: 6
                    }}
                    >Loading your data
                    </div>
                </div>
            )}
            
           
            {/**empty state- only shows if not loading and no file*/}
            {!loading && !file && !parsed&&(
                <div style={{
                    border: '2px dashed #FDBA74',
                    borderRadius:12,
                    padding:'60px 20px',
                    textAlign:'center',
                    background:'#fff'
                }}>
                    <div style={{fontSize:40,marginBottom:12}}>🍽️</div>
                    <div style={{fontSize:16,fontWeight:600,color: '#7C2D12',marginBottom:6}}>
                    No data yet
                    </div>
                    <div style= {{fontSize:13, color:'#92400E'}}>
                    Upload a Csv file to see  your dashboard
                    </div>
                </div>
            )}
            {/**Column mapper  */}
            {showMapper && (
                    <ColumnMapper
                        columns={columns}
                        mapping={mapping}
                        onMappingChange={(field, value) =>
                        setMapping(prev => ({ ...prev, [field]: value }))
                        }
                        onConfirm={handleConfirmMapping}
                    />
                    )}

             {/* Metric card */}
            {parsed && csvData.length>0 && (
                <MetricCards csvData={csvData} />
            )}
            {/* Two column layout — insights left, charts right */}
            {parsed && csvData.length > 0 && (
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.8fr',
                gap: 16,
                marginBottom: 16,
                alignItems: 'stretch'
            }}>

                {/* Left — Auto Insights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Auto Insights */}
            <div style={{
                background: '#fff',
                borderRadius: 12,
                padding: 20,
                border: '1px solid #FDBA74',
            }}>
                <AutoInsights csvData={csvData} />
            </div>

            {/* Top Items by Revenue */}
            <div style={{
                background: '#fff',
                borderRadius: 12,
                padding: 20,
                border: '1px solid #FDBA74',
                flex: 1
            }}>
                <h2 style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#7C2D12',
                marginBottom: 16
                }}>
                🏆 Top Items by Revenue
                </h2>
                {Object.entries(
                csvData.reduce((acc, row) => {
                    if (!acc[row.item]) acc[row.item] = 0
                    acc[row.item] += Number(row.revenue) || 0
                    return acc
                }, {})
                )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([item, revenue], i) => {
                    const max = Math.max(...Object.values(
                    csvData.reduce((acc, row) => {
                        if (!acc[row.item]) acc[row.item] = 0
                        acc[row.item] += Number(row.revenue) || 0
                        return acc
                    }, {})
                    ))
                    const pct = Math.round((revenue / max) * 100)
                    const colors = ['#EA580C','#FB923C','#FCD34D','#FDBA74','#FED7AA']
                    return (
                    <div key={item} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 12
                    }}>
                        <div style={{
                        width: 24, height: 24,
                        borderRadius: '50%',
                        background: colors[i],
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 600,
                        flexShrink: 0
                        }}>
                        {i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: 4
                        }}>
                            <span style={{ fontSize: 13, fontWeight: 500, color: '#7C2D12' }}>
                            {item}
                            </span>
                            <span style={{ fontSize: 12, color: '#92400E' }}>
                            ${revenue.toLocaleString()}
                            </span>
                        </div>
                        <div style={{
                            background: '#FFF7ED',
                            borderRadius: 4,
                            height: 6,
                            overflow: 'hidden'
                        }}>
                            <div style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: colors[i],
                            borderRadius: 4
                            }} />
                        </div>
                        </div>
                    </div>
                    )
                })}
            </div>

            </div>

                            
                            
                            

                            {/* Right — Charts */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 16
                                }}>
            
                            <Charts csvData={csvData} />
                            </div>

                        </div>
                        )}

            
          {parsed && csvData.length > 0 && (
            <CollapsableTable csvData={csvData} />
            )}   
        </main>

    )
}
export default Dashboard;