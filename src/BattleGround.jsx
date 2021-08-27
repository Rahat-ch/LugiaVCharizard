import * as React from 'react';
import { ethers } from 'ethers';
import abi from './utils/lugia.json';
import charizard from './images/charizard.png'
import lugia from './images/lugia.png'
import flamethrower from './images/flamethrower.gif'
import zardhealing from './images/potion.gif'
import BattleCard from './BattleCard';

const BattleGround = () => {
    const [attacking, setAttacking] = React.useState(false)
    const [healing, setHealing] = React.useState(false)
    const [zardhp, setZardhp] = React.useState("")
    const [shadowlugiahp, setLugiahp] = React.useState("")
    const [allActions, setAllActions] = React.useState([])

    const contractAddress = process.env.REACT_APP_ADDRESS;
    const contractABI = abi.abi

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const lugiaBattleContract = new ethers.Contract(contractAddress, contractABI, signer);

    const attack = async () => {
        const attack = await lugiaBattleContract.attack(`attacked Lugia with Flamethrower! Lugia attacked back!`);
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
      const potion = await lugiaBattleContract.potion(`healed Charizard with a potion!`)
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
  
  const getAllActions = async () => {
    const actions = await lugiaBattleContract.getAllActions()
    const cleanedActions = actions.map(action => {
        return {
            address: action.trainer,
            timestamp: new Date(action.timestamp * 1000),
            message: action.message,
        }
    })
    setAllActions(cleanedActions)
  }

  const listener = (block) => {
    console.log("new action emited")
    console.log(block)
    getAllActions()
  }

  React.useEffect(() => {
    getHP()
    getAllActions()
    lugiaBattleContract.on("NewAction", listener)
    return () => {
        lugiaBattleContract.off("NewAction", listener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

    console.log({allActions})
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
        {allActions.map(action => <BattleCard action={action} />)}
        </main>
    )
}

export default BattleGround