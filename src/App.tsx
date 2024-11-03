import { useState } from 'react'
import './App.css'
import { generateMnemonic } from 'bip39';
import { SolanaWallet } from './components/SolanaWallet';
import { EthWallet } from './components/EthWallet';

function App() {
  const [mnemonic, setMnemonic] = useState("");

  return (
    <>
      <div>
        <input type="text" value={mnemonic} style={{ marginRight: "10px" }}></input>
        <button onClick={function() {
          const mn = generateMnemonic()
          setMnemonic(mn)
        }} className='ml-5'>Create Seed Phrase</button>
        <SolanaWallet mnemonic={mnemonic} />
        <EthWallet mnemonic={mnemonic} />
      </div >
    </>
  )
}

export default App
