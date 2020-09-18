import React, { useContext } from 'react';
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
    const members = Object.values(ctx?.state?.missionMembers ?? {});
    const classes = useStyles();
    const { open } = props;


    const handleListItemClick = (id: string) => {
        console.log(id)
    }
    const handleVote = (decision: any) => () => {
        console.log(decision)
    }
    return (
        <Dialog aria-labelledby="simple-dialog-title" open={open}>
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
                    <Button onClick={handleVote('Reject')} color="primary">
                        Reject
                    </Button>
                    <Button onClick={handleVote('Approve')} color="primary">
                        Approve
                    </Button>
                </DialogActions>

            </List>
        </Dialog>
    );
}

// export default function Voting() {
//   const [open, setOpen] = React.useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = (value: string) => {
//     setOpen(false);
//     setSelectedValue(value);
//   };

//   return (
//     <div>
//       <Typography variant="subtitle1">Selected: {selectedValue}</Typography>
//       <br />
//       <Button variant="outlined" color="primary" onClick={handleClickOpen}>
//         Open simple dialog
//       </Button>
//       {/* <SimpleDialog selectedValue={selectedValue} open={open} onClose={() => setOpen(false)} /> */}
//     </div>
//   );
// }
