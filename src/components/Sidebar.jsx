function Sidebar(activePage,setActivePage){
    const navItems = ['Dashboard','Uploads', 'Reports','payment']

    return (
        <aside style={{
            width:200,
            background: '#fff',
            borderRight: '1px solid #e2e8f0',
            padding: '20px 12px',
            minHeight:'100vh',
            flexShrink:0}}>

                <div style={{
                    fontSize:11,color:'#EA580C',textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12, fontWeight:500
                }}>Navigation</div>

                {navItems.map((item)=> (
                    <div key={item}
                        onClick={()=>setActivePage(item)}
                        style ={{
                            
                        padding: '8px 12px',
                        borderRadius: 8,
                        fontSize: 13,
                        cursor: 'pointer',
                        marginBottom: 4,
                        background: activePage === item ? '#FFEDD5' : 'transparent',
                        color: activePage === item ? '#7C2D12' : '#92400E',
                        fontWeight: activePage === item ? 500 : 400,
                        }}
                    >{item}</div>
                ))}

        </aside>
    )
}
export default Sidebar;