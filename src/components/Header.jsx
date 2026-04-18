function Header(){
    return (
        <header style={{
            background:'#0C447C',
            padding: '14px 24px',
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between'
        }}>
            <div style={{
                fontSize:20,fontWeight:600, color: '#fff'  
            }}>
                Data<span style={{color:'#B5D4F4'}}>Lens </span>
            </div>
            {/* Tagline */}
            <div style={{
                fontSize:13, color:'#B5D4F4'
            }}>Small Business Data analyst</div>
        </header>
    )
}
export default Header;