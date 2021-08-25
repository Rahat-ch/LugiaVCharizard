import * as React from 'react';
import './App.css';
import BattleGround from './BattleGround';

function App() {
  const [currAcount, setCurrAccount] = React.useState("")

  const isWalletConnected = () => {
    const { ethereum } = window
    if(!ethereum) {
      console.log("Metmask not detected")
      return
    } else {
      console.log("Ayy its ethereum", ethereum)
    }

    ethereum.request({ method: 'eth_accounts'})
      .then(accounts => {
        if(accounts.length !== 0){
          const account = accounts[0]
          console.log("found authorized account", account)
          setCurrAccount(account)
        } else {
          console.log("no authorized account found")
        }
      })
  }

  const connectWallet = () => {
    const { ethereum } = window
    if(!ethereum) {
      alert("get your ass some metamask yo!")
      return
    }
    ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        console.log('hello')
        console.log(accounts)
        setCurrAccount(accounts[0])
      })
      .catch(err => console.error(err))
  }

  React.useEffect(() => {
    isWalletConnected()
  },[])
  return (
    <div className="App">
      {currAcount ? <BattleGround /> : 
      <>
        <h1>Connect with MetaMask to fight Lugia</h1>
        <button onClick={connectWallet}>Connect Wallet</button>
        </>
      }
      
    </div>
  );
}

export default App;
