function Dashboard(){
    return (
        <main style ={{flex:1, padding: 24}}> 
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',marginBottom:24}}>
                <h1 style={{fontsize:20,fontWeight:600,color:'#1a1a2e'}}>Dashboard</h1>
                <button style={{
                    background:'#0C447C',
                    color:'#fff',
                    border:'none',
                    padding:'8px 16px',
                    borderRadius:8,
                    fontSize: 13,
                    cursor:'pointer'
                }}>Upload CSV</button>
            </div>
            <div style = {{
                border:'2px dashed #cbd5e1',
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
        </main>

    )
}
export default Dashboard;