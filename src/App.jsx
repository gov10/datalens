import {useState} from 'react';
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'

function App(){
  const [activePage, setActivePage] = useState('Dashboard')
  return(
    <div>
      <Header />

      {/* Body — sidebar + main content side by side */}
      <div style={{display:'flex'}}>
        <Sidebar
        activePage = {activePage}
        setActivePage ={setActivePage} 
        />
        <Dashboard />
        </div>
    </div>
  )
}
export default App;