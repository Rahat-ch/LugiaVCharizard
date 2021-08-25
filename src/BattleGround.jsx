import * as React from 'react';
import { ethers } from 'ethers';
import abi from './utils/lugia.json';
import charizard from './images/charizard.png'
import lugia from './images/lugia.png'
import flamethrower from './images/flamethrower.gif'
import zardhealing from './images/potion.gif'

const BattleGround = () => {
    console.log(zardhealing)
    const [attacking, setAttacking] = React.useState(false)
    const [healing, setHealing] = React.useState(false)
    const [zardhp, setZardhp] = React.useState("")
    const [shadowlugiahp, setLugiahp] = React.useState("")

    const contractAddress = process.env.REACT_APP_ADDRESS;
    const contractABI = abi.abi

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const lugiaBattleContract = new ethers.Contract(contractAddress, contractABI, signer);

    const attack = async () => {
        const attack = await lugiaBattleContract.attack();
        console.log("attacking....", attack.hash)
        setAttacking(true)
        await attack.wait()
        setAttacking(false)
        console.log("success...", attack.hash)
        const lugiaHP = await lugiaBattleContract.getCurrentHp()
        const charizardHP = await lugiaBattleContract.getCurrentCharizardHp()
        console.log(`Lugia got ${lugiaHP} hp remaining` )
        setLugiahp(`${lugiaHP}`)
        console.log(`Charizard got ${charizardHP} hp remaining`)
        setZardhp(`${charizardHP}`)
  }

  const potion = async () => {
      const potion = await lugiaBattleContract.potion()
      console.log("healing...")
      setHealing(true)
      await potion.wait()
      console.log('healed up')
      setHealing(false)
      const charizardHP = await lugiaBattleContract.getCurrentCharizardHp()
      console.log(`Charizard got ${charizardHP} hp remaining`)
      setZardhp(`${charizardHP}`)
  }

  const getHP = async () => {
      const lugiaHP = await lugiaBattleContract.getCurrentHp()
        const charizardHP = await lugiaBattleContract.getCurrentCharizardHp()
        console.log(`Lugia got ${lugiaHP} hp remaining` )
        setLugiahp(`${lugiaHP}`)
        console.log(`Charizard got ${charizardHP} hp remaining`)
        setZardhp(`${charizardHP}`)
  }

  React.useEffect(() => {
    getHP()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

    return(
        <main className="container">
            <h1>Help Charizard defeat Lugia!</h1>
            <div className="imgContainer">
                <div>
                    <img className="pokes" src={charizard} alt="charizard" />
                    {zardhp && <p>HP: {zardhp}</p>}
                </div>
                <div>
                    <img className="pokes" src={lugia} alt="lugia" />
                    {shadowlugiahp && <p>HP: {shadowlugiahp}</p>}
                </div>
            </div>
        {attacking && <>
        <img src={flamethrower} className="pokesgif" alt="charizard using flamethrower" />
        <p>Charizard is using Flamethrower! But the Shadow Lugia is Attacking Back!</p>
        </>}
        {healing && <> <img className="pokesgif" src={zardhealing} alt="charizard healing" /> 
        <p>Giving Charizard a potion</p>
        </>}
        {!attacking && !healing && 
        <>
        <button className="button" onClick={attack}>Use Flamethrower!</button>
        <button className="button" onClick={potion}>Use a Potion!</button>
        </>
        }
        </main>
    )
}

export default BattleGround