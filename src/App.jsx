import {useState} from 'react';
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import useWindowSize from './components/hooks/useWindowSize'

function App(){
  const { isMobile } = useWindowSize()
  const [activePage, setActivePage] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLanding,setShowLanding] = useState(false)
  const [landingKey, setLandingKey] = useState(0)

  function handleLogoClick(){
    setShowLanding(true)
    setLandingKey(prev => prev + 1)
    setActivePage('Dashboard')
    setSidebarOpen(false)
  }
  
  return(
    <div style={{display:'flex',flexDirection:'column',minHeight:'100vh'}}>
      <Header
        isMobile= {isMobile}
        sidebarOpen = {sidebarOpen}
        setSidebarOpen = {setSidebarOpen}
        onLogoClick={handleLogoClick}
        showLanding={showLanding} />

      {/* Body — sidebar + main content side by side */}
      <div style={{display:'flex', flex:1}}>
        {(!isMobile || sidebarOpen) &&(
          <Sidebar

        activePage = {activePage}
        setActivePage ={setActivePage} 
        isMobile = {isMobile}
        onClose={()=> setSidebarOpen(false)}
        />

        )}
        {isMobile && sidebarOpen &&(
          <div
          onClick={()=> setSidebarOpen(false)}
          style={{position:'fixed',
            inset:0, background:'rgba(0,0,0,0.4)',
            zIndex:1
          }}/>

          
        )}
        
        <Dashboard
          key={landingKey}
          showLanding={showLanding}
          onLandingDismiss={() => setShowLanding(false)}
        />
        </div>
    </div>
  )
}
export default App;