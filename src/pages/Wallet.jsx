import Navbar from "./Navbar"
import { useState } from "react"
import { generateMnemonic } from "bip39"


export default function Wallet() {
  const [mnemonic, setMnemonic] = useState('');
  console.log("hi")
  async function displayMn() {
    const mn = await generateMnemonic();
    setMnemonic(mn)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Navbar />

      {/* Hero */}
      <div>
            <h1 className="font-extrabold text-5xl  text-white text-center" >
              Wallet Management
            </h1>
            <p className="text-gray-300 mt-10 text-3xl text-center">Generate keys from seed phrase and manage your crypto assets</p>

            <button className="block mx-auto px-4 py-2 mt-8 bg-white text-black rounded-2xl hover:bg-black hover:text-white" onClick={displayMn}>
                  Create Seed Phrase
            </button>

            <div>
              <h1> 

              </h1>
            </div>
      </div>


      
    </div>
    
  )
}
