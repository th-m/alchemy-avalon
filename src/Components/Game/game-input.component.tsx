import React, { useContext } from 'react'
import { TextField, Button } from '@material-ui/core'
import { GameContext, GameProvider } from './provider'

export const GameInput = ({ step }) => {
    const ctx = useContext(GameContext);
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
                id={step}
                fullWidth
                required
                label={(step === 1 ? "Enter The Game Secret" : "What Is Your Name")}
                onChange={ctx.handleInputChange}
                className="marg_0"
                margin="normal"
                value={ctx.state[step]}
            />
            <div style={{ marginTop: 10 }}>
                <Button variant="contained" color="primary" fullWidth onClick={ctx.sendMessage}>
                    Enter
          </Button>
            </div>
        </div >
    )
}