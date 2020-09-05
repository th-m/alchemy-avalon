import React, { useContext, useState } from 'react'
import { TextField, Button } from '@material-ui/core'
import { GameContext } from '../../provider'
import { cleanString } from '../../firebase/actions'
import enterIcon from '../../assets/imgs/sacred-geometry/circles-svgrepo-com.svg'
export const GameSecret = () => {
    const ctx = useContext(GameContext);
    const [value, setValue] = useState('')
    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '16px',
            marginLeft: '-150px',
            width: '300px',
            height: '300px',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={enterIcon} onClick={() => ctx.dispatch({ type: "SET_SECRET", payload: value })} className={(value ? "play-able" : 'play-disable')} alt="enter room" />
            </div>
            <TextField
                fullWidth
                required
                label={"Enter Secret"}
                onChange={(event) => setValue(cleanString(event.target.value))}
                className="marg_0"
                margin="normal"
                value={value}
            />
        </div >
    )
}