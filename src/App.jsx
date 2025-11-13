import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Table from './Table.jsx'

const App = () => {
  return (
    <div className="card-container">
      <h2>Bine ai venit in magazinul nostru online!</h2>
      <Table/>
      {/* <Card title = "Produse"/> */}
      {/* <Card title = "Despre noi"/> */}
    </div>
      )
  }

export default App
