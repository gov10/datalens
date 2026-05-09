export default function ColumnMapper({columns, mapping,onMappingChange,onConfirm}){
    const requiredFields = [
        { key: 'month', label: 'Month / Period', description: 'The time period column' },
        { key: 'item', label: 'Item / Product', description: 'The menu item or product name' },
        { key: 'revenue', label: 'Revenue / Sales', description: 'The sales amount column' },
        { key: 'orders', label: 'Orders / Quantity', description: 'Number of orders (optional)' },
        { key: 'category', label: 'Category', description: 'Product category (optional)' },
    ]
    const isReady = mapping.month && mapping.item && mapping.revenue

    return (
        <div style={{background:'#fff',border:'1px solid #FDBA74',borderRadius:12,padding:24,marginBottom:24}}>
            <h2 style={{fontSize:15, fontWeight:600, color:'#7C2D12',marginBottom:6}}>  Map your column</h2>
            <p style={{fontSize:13,color:'#92400E',marginBottom:20,lineHeight:1.6}}>This CSV has different column.Tell us which column contains which data.</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:24}}>
                {requiredFields.map((field) => (
                    <div key={field.key}>
                        <div style={{fontSize:12,fontWeight:500,color:'#7C2D12',marginBottom:4}}>
                            {field.label}
                            {(field.key==='month'|| field.key === 'item' || field.key ==='revenue')&& (
                                <span style={{color:'#EA580C',marginLeft:4}}>*</span>
                            )}
                        </div>
                        <div style={{fontSize:11,color:'#92400E',marginBottom:6,opacity:0.8}}>{field.description}</div>
                        <select value={mapping[field.key]| ''}
                                onChange={(e)=>onMappingChange(field.key,e.target.value)}
                                style={{
                                    width:'100%',
                                    padding:'8px 10px',
                                    borderRadius:8,
                                    border:`1px solid ${mapping[field.key] ? '#FDBA74':'#e2e8f0'} `,
                                    fontSize:13,
                                    color:'#1a1a2e',
                                    background:mapping[field.key] ? '#FFFbF7':'#fff',
                                    cursor:'pointer',
                                    outline:'none'
                                }}>
                                    <option value="">--select column--</option>
                                    {columns.map((col)=>(
                                        <option key={col} value={col}>{col}</option>
                                    ))}
                                </select>
                    </div>
                ))}
            </div>
            {/**Required fields reminder */}
            {!isReady &&(
                <div style={{background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:8,padding:'10px 14px',fontSize:13,color:'#78350F',marginBottom:16}}>
                    ⚠️ Please map Month, Item and Revenue to continue. Orders and Category are optional.
                </div>
            )}
            <button
                onClick={onConfirm}
                disabled={!isReady}
                style={{
                    background:isReady ? '#EA580C': '#e2e8f0',
                    color:isReady ? '#fff': '#94a3b8',
                    border:'none',
                    padding:'10px 24px',
                    borderRadius:8,
                    fontSize:13,
                    fontWeight:500,
                    cursor:isReady ? 'pointer': 'not-allowed',
                    transition:'all 0.15'
                }}>
                    {isReady ? 'Apply Mapping ->':'Map required fields first'}
                </button>
        </div>
    )
}