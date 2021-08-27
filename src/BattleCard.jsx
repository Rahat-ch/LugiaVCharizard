const BattleCard = ({action}) => {
    const {address, message, timestamp} = action;
    console.log(timestamp)
    return(
        <main>
            <h3>Trainer {address} {message}</h3>
        </main>
    )
}

export default BattleCard;
