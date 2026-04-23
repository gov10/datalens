import { useState } from "react";

export default function CollapsableTable ({csvData}){
    const [isOpen, setIsOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const rowPerPage = 20
    const totalPages = Math.ceil(csvData.length/rowPerPage)

    const visibleRows = csvData.slice(
        (currentPage-1)*rowPerPage, currentPage*rowPerPage
    )

    return (
        <div style={{marginBottom:24}}>
            {/*Toggle button */}
            <button onClick={()=>setIsOpen(!isOpen)}
                style = {{
                    background:'transparent',
                    border: '1px solid #e228f0',
                    borderRadius:8,
                    padding:'8px 16px',
                    fontSize:13,
                    cursor:'pointer',
                    color:'#64748b',
                    marginBottom:isOpen ? 12:0,
                    display:'flex',
                    alignItems: 'center',
                    gap:8
                }}>
                    {isOpen ? '▲ Hide': '▼ Show'} raw data
                    <span style = {{
                        background:'#E6F1FB',
                        color:'#0C447C',
                        borderRadius:20,
                        padding:'1px 8px',
                        fontSize:11
                    }}>{csvData.length} rows</span>
                </button>

           {/* Table only when open */}    
           {isOpen &&(
            <div>
                {/**Pagination info */}

                <div style={{
                    display:'flex',
                    justifyContent:'space-between',
                    alignItems:'center',
                    fontSize:13,
                    marginBottom:10,
                    color: '#64748b'
                }}>
                    <span>
                        Showing {((currentPage-1)*rowPerPage)+1}-{Math.min(currentPage*rowPerPage,csvData.length)} of {csvData.length} rows
                    </span>
                    <div style={{display:'flex',gap:8}}>
                        <button 
                        onClick={()=>setCurrentPage (p=>Math.max(1,p-1))}
                        disabled={currentPage===1}
                        style={{
                            padding:'4pz 12px',
                            borderRadius:6,
                            border:'1px solid #e2e8f0',
                            cursor:currentPage ===1 ? 'not-allowed':'pointer',
                            background:'#fff',
                            fontSize:13,
                            opacity:currentPage === 1?0.4:1

                        }}>
                            ← Prev
                        </button>
                        <button 
                        onClick={()=> setCurrentPage(p=>Math.min(totalPages,p+1))}
                        disabled = {currentPage=== totalPages}
                        style={{
                        padding:'4px 12px',
                        borderRadius:6,
                        border: '1px solid #e2e8f0',
                        cursor: currentPage===totalPages ? 'not-allowed': ' pointer',
                        background:'#fff',
                        fontSize:13,opacity:currentPage===totalPages ? 0.4 : 1
                        }}>
                            Next →
                        </button>
                    </div>
                </div>
                {/**Table */}
                <div style={{overflow:'auto'}}>
                    <table style={{
                        width:'100%',
                        borderCollapse:'collapse',
                        fontSize:13
                    }}>
                        <thead>
                            <tr style = {{background:'#0C447C'}}>
                                {Object.keys(csvData[0]).map((col)=>(
                                    <th key={col} style={{
                                        padding:'10px 14px',
                                        color:'#fff',
                                        textAlign:'left',
                                        fontWeight:500
                                    }}>

                                    {col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {visibleRows.map((row, index)=>(
                                <tr key={index} style={{
                                    background:index%2===0? '#fff':'#f8fafc',
                                    borderBottom: '1px, solid #e2e8f0'
                                }}>
                                    {Object.values(row).map((val,i)=>(
                                        <td
                                        key={i} style={{padding:'10px 14px'}}>
                                            {val}
                                        </td>
                                    ))}
                                </tr>

                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
           )}  
        </div>
    )
}