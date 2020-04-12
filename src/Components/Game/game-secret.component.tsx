import React, { useContext, useState } from 'react'
import { TextField, Button } from '@material-ui/core'
import { GameContext, GameProvider } from './provider'

export const GameSecret = () => {
    const ctx = useContext(GameContext);
    const [value, setValue] = useState('')
    console.log(value);
    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-25px',
            marginLeft: '-150px',
            width: '300px',
            height: '300px',
        }}>
            <TextField
                fullWidth
                required
                label={"Enter The Game Secret"}
                onChange={(event) => setValue(event.target.value)}
                className="marg_0"
                margin="normal"
                value={value}
            />
            <div style={{ marginTop: 10 }}>
                <Button variant="contained" color="primary" fullWidth onClick={() => ctx.dispatch({ type: "SET_SECRET", payload: value })}>
                    Enter
                </Button>
            </div>
        </div >
    )
}