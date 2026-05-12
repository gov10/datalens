function Sidebar(activePage,setActivePage,isMobile, onClose){
    const navItems = ['Dashboard','Uploads', 'Reports','payment']

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

                {['Dashbaord','Uploads','Reports'].map((item)=>(
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
                        cursor:'pointer',
                        marginBottom:4,
                        background:activePage===item? '#FFEDD5' : 'transparent',
                        color: activePage === item ? '#7C2D12' : '#92400E',
                        fontWeight: activePage === item ? 600 : 400,
                    }}>
                        {item}
                    </div>
                ))}

        </aside>
    )
}
export default Sidebar;