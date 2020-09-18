import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import { DialogActions } from '@material-ui/core';
import { GameContext } from '../../provider'
import { setPlayerVote } from '../../firebase/actions';
import { auth } from 'firebase';
import firebase from 'firebase';

const emails = ['username@gmail.com', 'user02@gmail.com'];

const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
        marginRight: 8
    },
});

interface Props {
    open: boolean;
}

export function Voting(props: Props) {
    const ctx = useContext(GameContext);
    const [visible, setVisible] = useState(true);
    const members = Object.values(ctx?.state?.missionMembers ?? {});
    const classes = useStyles();
    const { open } = props;


    const handleListItemClick = (id: string) => {
        console.log(id)
    }

    const handleVote = (vote: boolean) => () => {
        const player = Object.values(ctx.state.players).find(player => player.uid === firebase.auth()?.currentUser?.uid)
        if (player) {
            setPlayerVote({ player, mission: ctx.state.mission, vote, gameKey: ctx.state.secret })
        }
        setVisible(false)
    }

    return (
        <Dialog aria-labelledby="simple-dialog-title" open={open && visible}>
            <DialogTitle id="simple-dialog-title">Approve or Reject this Team?</DialogTitle>
            <List>
                {members.map((member) => (
                    <ListItem button onClick={() => handleListItemClick(member.uid)} key={member.uid}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar} alt={member.displayName} src={member.photoURL} />

                        </ListItemAvatar>
                        <ListItemText primary={member.displayName} />
                    </ListItem>
                ))}
                <DialogActions>
                    <Button onClick={handleVote(true)} color="primary">
                        Reject
                    </Button>
                    <Button onClick={handleVote(false)} color="primary">
                        Approve
                    </Button>
                </DialogActions>

            </List>
        </Dialog>
    );
}
