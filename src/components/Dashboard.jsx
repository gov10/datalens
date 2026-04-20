import {useState,useEffect} from 'react';
import Papa from 'papaparse'

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
    const noCommas = cleaned.replace(/./g,'') 
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
  'jan': 'Jan', 'january': 'Jan',
  'feb': 'Feb', 'february': 'Feb',
  'mar': 'Mar', 'march': 'Mar',
  'apr': 'Apr', 'april': 'Apr',
  'may': 'May', 'may': 'May',
  'jun': 'Jun', 'june': 'Jun',
  'jul': 'Jul', 'july': 'Jul',
  'aug': 'Aug', 'august': 'Aug',
  'sep': 'Sep', 'september': 'Sep',
  'oct': 'Oct', 'october': 'Oct',
  'nov': 'Nov', 'november': 'Nov',
  'dec': 'Dec', 'december': 'Dec',
}
function normaliseMonth(value){
    if (!value) return null
    const key = value.toString().toLowerCase().trim()
    return monthMap[key] || value.trim()
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
    return sorted.length52 !==0
    ? sorted[mid]
    :Math.round((sorted[mid-1]+sorted[mid]/2))
}
//main cleaning function
function cleanData(rows){
    const parsed = rows.map((row)=>({
    ...row,
    month:normaliseMonth(row.month),
    item:cleanText(row.item),
    category: cleanText(row.category,'Uncategorised'),
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
return {
    data:imputed,
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
    //const [loading,setLoading] = useState(false)
    const [error,setError] = useState('')
    const [parsed, setParsed] = useState(false)
    const [removed, setRemoved] = useState(0)
const [imputed, setImputed] = useState(0)

    // useEffect watches file — runs when file changes
    useEffect(()=>{
        if (!file) return // no file yet — do nothing
        if (parsed) return
        

        Papa.parse(file,{
            header:true,
            skipEmptyLines:true,
            complete:(result) =>{
                //console.log('Parsed rows:',result.data)
                const {data,removedCount,imputedCount} = cleanData(result.data)
                setCsvData(data)
                setRemoved(removedCount)
                setImputed(imputedCount)
      setParsed(true)
            },
            error:()=>{
                setError('Could not read file. Please try again.')
               
            }
        })
    },[file])
    return (
        <main style ={{flex:1, padding: 24}}> 

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',marginBottom:24}}>
                <h1 style={{fontsize:20,fontWeight:600,color:'#1a1a2e'}}>Dashboard</h1>
                <button  onClick={() => document.getElementById('csvInput').click() } style={{
                    background:'#0C447C',
                    color:'#fff',
                    border:'none',
                    padding:'8px 16px',
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
            onChange={(e) => setFile(e.target.files[0])}
            />

            {/* File Selection confirmation */}
            {file && (
                <div style = {{
                    background: '#E1F5EE',
                    border:'1px solid #9FE1CB',
                    borderRadius:8,
                    padding:'10px 14px',
                    marginBottom:20,
                    fontSize:13,
                    color:'#085041'
                }}>Selected: {file.name}</div>
            )}

            {/* Error Message */}

            {error &&(
                <div style={{
                    background:'#FCEBEB',
                    border: '1px solid #F7C1C1',
                    borderRadius:8,
                    padding:'10px 14px',
                    marginBottom:20,
                    fontSize:13,
                    color:'#A32D2D'
                }}>X {error}</div>
            )}
            {/* Loading state
            {loading &&(
                <div style={{textAlign:'center',padding:40, color:'#94a3b8'}}>Reading your file...</div>
            )} */}

            {/* Empty state — only show if no file selected */}

            {!file &&(
                <div style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius:12,
                    padding:'60px 20px',
                    textAlign:'center'
                }}>
                    <div style={{fontSize:40,marginBottom:12}}>📊</div>
                    <div style={{fontSize:16,fontWeight:500,marginBottom:6}}>
                    No data yet
                    </div>
                    <div style= {{fontSize:13, color:'#94a3b8'}}>
                    Upload a Csv file to see  your dashboard
                    </div>
                </div>
            )}
            {/* Data Table - only shows after parsing*/ }
            {parsed && csvData.length>0 &&(
            <div style={{overflowX:'auto'}}>
                <table style={{
                    width:'100%',
                    borderCollapse:'collapse',
                    fontSize: 13
                }}>
                    {/* Table headers — from CSV column names */}
                    <thead>
                        <tr style={{background:'0C447C'}}>
                            {Object.keys(csvData[0]).map((col)=>(
                                <th key={col} style={{
                                    padding:'10px 14px',
                                    
                                    textAlign:'left',
                                    fontWeight:500

                                }}>{col}</th>

                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {csvData.map((row,index)=>(
                            <tr key={index} style={{
                                background:index % 2===0 ? '#fff': '#f8fafc',
                                birderBottom:'1px solid #e2e8f0'
                            }}>
                                {Object.values(row).map((val,i)=>(
                                    <td key={i} style={{padding:'10px 14px'}}>
                                        {val}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

         )}
               


            
        </main>

    )
}
export default Dashboard;