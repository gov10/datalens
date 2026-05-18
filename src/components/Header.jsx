function Header({isMobile, sidebarOpen, setSidebarOpen,onLogoClick}){
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
                
                <div onClick={onLogoClick} style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}}>
                    <div style={{display:'flex',alignItems:'flex-end',gap:3,height:24,flexShrink:0}}>
                        {[38, 62, 85, 54, 100].map((h, i) => (
                            <div key={i} style={{
                                width: 4,
                                height: `${h}%`,
                                background: '#FED7AA',
                                borderRadius: '2px 2px 0 0'
                                }} />
                            ))}
                    </div>
                    <div style={{
                        fontFamily: "'Oxanium', sans-serif",
                        fontWeight: 800,
                        fontSize: 20,
                        color: '#FED7AA',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase'
                            }}>
                        DATALENS
                    </div>
                </div>
            </div>
             {!isMobile && (
                <div style={{ fontSize: 13, color: '#FDBA74' }}>
                Data Made Simple
                </div>
            )}

        </header>
    )
}
export default Header;