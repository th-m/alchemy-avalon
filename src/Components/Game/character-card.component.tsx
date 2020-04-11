
import React, { useContext } from 'react'
import {characterPics} from './../../assets/index'
import {GameContext} from './provider'
const KnownInfo= (props) => {
    return  ( props.data ? <> {Object.keys(props.data).map((k, i) => <KnownData character={k} xpos={i} names={props.data[k]} /> )} </> : null);
}

const KnownData= (props) => {
    return <> 
              <text x="100" y="170" font-family="Verdana" font-size="30" fill="green">{props.character}</text>
              { props.names.map((name, i) => <text x="100" y={((i * 20) + 200)} font-family="Verdana" font-size="" fill="green">{name}</text> ) }
            </>
}

export const CharacterCard = () => {
    const ctx = useContext(GameContext);
    const character = ctx.state.character;
    return (
     
          <>
                    <text x="100" y="55" fontFamily="Verdana" fontSize="35" fill="blue">{character.name}</text>
                    <text x="100" y="70" fontFamily="Verdana" fontSize="15" fill="green">Aignment: {character.alignment}</text>
                    '<image href={characterPics[character.name]} x="110" y="75" height="100" width="100" />
                    {(character.known ? <KnownInfo data={character.known} />:null)}
            </>
       
    )
  }
  