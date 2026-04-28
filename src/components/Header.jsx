function Header(){
    return (
        <header style={{
            background:'#7C2D12',
            padding: '14px 24px',
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between'
        }}>
            <div style={{
                fontSize:20,fontWeight:600, color: '#fff'  
            }}>
                Data<span style={{color:'#EA580C'}}>Lens </span>
            </div>
            {/* Tagline */}
            <div style={{
                fontSize:20, color:'#FDBA74'
            }}>Small Business Data analyst</div>
        </header>
    )
}
export default Header;