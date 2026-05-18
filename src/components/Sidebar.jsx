function Sidebar({activePage,setActivePage,isMobile, onClose}){

    const navItems = [
        {label:'Dashboard',active:true},
        {label:'Uploads',active:false},
        {label:'Reports',active:false}
    ]
    
    return (
        <aside style={{
            width:200,
            background: '#fff',
            borderRight: '1px solid #e2e8f0',
            padding: '20px 12px',
            minHeight:'100vh',
            flexShrink:0,
            //mobile position fix
            ...(isMobile &&{
                position:'fixed',
                top:0,
                left:0,
                zIndex:30,
                paddingTop:60,
                boxShadow:'4px 0 20px rgba(0,0,0,0.15)'
            })
            }}>

                <div style={{
                    fontSize:11,color:'#EA580C',textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12, fontWeight:500
                }}>Navigation</div>

                {navItems.map((item)=>(
                    <div 
                    key={item}
                    onClick={()=>{
                        setActivePage(item)
                        if(isMobile) onClose()
                    }}
                    style={{
                        padding:'8px 12px',
                        borderRadius:8,
                        fontSize:13,
                        cursor:item.active ? 'pointer':'not-allowed',
                        marginBottom:4,
                        background:activePage===item.label ? '#FFEDD5' : 'transparent',
                        color: activePage === item.label ? '#7C2D12' : '#92400E',
                        fontWeight: activePage === item ? 600 : 400,
                        opacity:item.active ? 1:0.45,
                        display:'flex',
                        justifyContent:'space-between',
                        alignItems: 'center',
                        transition:'all 0.15s'
                    }}>
                        {item.label}
                        {/**Coming soon */}
                        {!item.active &&(
                            <span style={{
                                fontsize:10,
                                background:'#FDBA74',
                                color:'#7C2D12',
                                padding:'2px 6px',
                                borderRadius:20,
                                fontWeight:600,
                                letterSpacing:'0.05em',
                                textTransform:'uppercase'

                            }}>Soon</span>
                        )}
                    </div>
                ))}

        </aside>
    )
}
export default Sidebar;