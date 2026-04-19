import {useState,useEffect} from 'react';
import Papa from 'papaparse'

function Dashboard(){
    const [file,setFile] = useState(null);
    const[csvData,setCsvData] = useState([])
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState('')
    const [parsed, setParsed] = useState(false)

    // useEffect watches file — runs when file changes
    useEffect(()=>{
        if (!file) return // no file yet — do nothing
        if (parsed) return
        

        Papa.parse(file,{
            header:true,
            skipEmptyLines:true,
            complete:(result) =>{
                setCsvData(result.data)
                setLoading(false)
            },
            error:()=>{
                setError('Could not read file. Please try again.')
                setLoading(false)
            }
        })
    })
    return (
        <main style ={{flex:1, padding: 24}}> 

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',marginBottom:24}}>
                <h1 style={{fontsize:20,fontWeight:600,color:'#1a1a2e'}}>Dashboard</h1>
                <button  onClick={() => document.getElementById('csvInput').click() }style={{
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
            {/* Loading state */}
            {loading &&(
                <div style={{textAlign:'center',padding:40, color:'#94a3b8'}}>Reading your file...</div>
            )}

            {/* Empty state — only show if no file selected */}

            {!file && !loading && (
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

           
               


            
        </main>

    )
}
export default Dashboard;