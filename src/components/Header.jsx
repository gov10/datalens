function Header({isMobile, sidebarOpen, setSidebarOpen}){
    return (
        <header style={{
            background:'#7C2D12',
            padding: '14px 24px',
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between'
        }}>
            <div style={{ display:'flex', alignItems:'center',gap:12}}>
                {isMobile &&(
                    <button onClick={()=>setSidebarOpen(!sidebarOpen)}
                    style={{background:'transparent',
                        border:'none',
                        color:'#FED7AA',
                        fontSize:22,
                        cursor:'pointer',
                        padding:0,
                        lineHeight:1
                    }}>
                        {sidebarOpen ? '✕' : '☰'}

                    </button>
                )}
            </div>
            <div style={{
                fontSize:20,fontWeight:700, color: '#FED7AA'  
            }}>
                Data<span style={{color:'#EA580C'}}>Lens </span>
            </div>
            {/* Tagline */}
            {!isMobile &&(
                <div style={{
                fontSize:20, color:'#FDBA74'
            }}>Tool for your resturant</div>

            )}
            
        </header>
    )
}
export default Header;