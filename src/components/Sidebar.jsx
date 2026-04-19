function Sidebar(activePage,setActivePage){
    const navItems = ['Dashboard','Uploads', 'Reports','payment']

    return (
        <aside style={{
            width:200,
            background: '#fff',
            borderRight: '1px solid #e2e8f0',
            padding: '20px 12px',
            minHeight:'100vh'}}>

                <div style={{
                    fontSize:11,color:'#94a3b8',textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12
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
                        background: activePage === item ? '#E6F1FB' : 'transparent',
                        color: activePage === item ? '#0C447C' : '#64748b',
                        fontWeight: activePage === item ? 500 : 400,
                        }}
                    >{item}</div>
                ))}

        </aside>
    )
}
export default Sidebar;