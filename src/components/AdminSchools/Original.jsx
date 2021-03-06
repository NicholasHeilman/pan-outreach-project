import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import moment from 'moment';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class AdminSchools extends Component {
  state = {
    id: 0,
    edit: false,
    username: '',
    password: '',
    school_name: '',
    open: false,
    hidden: null,
    active: null
  }

logState = () => {
  console.log(this.state.person)
}

  //new school handlers
  handleUsername = (event) => {
    this.setState({
      username: event.target.value
    })
  }
  handlePassword = (event) => {
    this.setState({
      password: event.target.value
    })
  }
  handleName = (event) => {
    this.setState({
      school_name: event.target.value
    })
  }

  //slider toggle funcs
  // handleReady = (row) => {
  //     this.setState({ id: row.id });
  //     this.setState({ active: !row.active });  
  //     console.log('hit handle ready', row.id) 
  //     this.handleActive();
  // }

  handleActive = (row) => {
    this.props.dispatch({ type: 'UPDATE_ACTIVE', payload: row })
    // console.log('hit handle active', row)
  }

  //edit dialog funcs
  handleUpdate = () => {
    this.props.dispatch({
        type: 'UPDATE_PERSON',
        payload: this.state
    })
  }

    // add dialog handlers
  handleClick = () => {
    this.props.dispatch({ type: 'POST_PERSON', payload: this.state })
    this.handleClose();
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  //edit school dialog funcs
  editSchool = (row) => {
    this.setState({ id: row.id });
    this.setState({ edit: true });
  }

  handleNameChange = (event) => {
    this.setState({
      ...this.state,
      username: event.target.value
    })
  };

  handlePasswordChange = (event) => {
    this.setState({
      ...this.state,
      password: event.target.value
    })
  };
  handleSchoolChange = (event) => {
    this.setState({
      ...this.state,
      school_name: event.target.value
    })
  };
  editHandleClick = () => {
    this.props.dispatch({ type: 'UPDATE_PERSON', payload: this.state })
    this.setState({
      edit: false
    })
  }
 //dialog handlers
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ 
      open: false,
      edit: false
     });
  };
  //handle delete
  deleteSchool = (row) => {
    this.props.dispatch({ type: 'DELETE_PERSON', payload: row.id })
  }
  
  seeState = () => {
    console.log(this.state);
    
  }
  render() {
  
    const isEnabled = this.state.username.length > 0 && this.state.password.length > 0 && this.state.school_name.length > 0;
    const { hidden } = this.state;
    return (
      this.state.edit ?
      <>
      <h1 className="heading">
            Schools
        </h1>
        <center>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                Add New School
        </Button>
        <Paper>
              <Table className="adminTable">
                <TableHead>
                  <TableRow>
                    <TableCell>School Name</TableCell>
                    <TableCell>Date Created</TableCell>
                    <TableCell align="center">Active?</TableCell>
                    <TableCell align="center">Edit</TableCell>
                    <TableCell align="center">Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.reduxStore.personReducer.map((row) => {
                    if (row.admin === false) {
                      return (
                        <TableRow key={row.id}>
                          <TableCell align="left">{row.school_name}</TableCell>
                          <TableCell align="left">{moment(row.creation_date).format('MMMM Do YYYY')}</TableCell>
                          <TableCell align="left">
                            <Switch
                              id=''
                              checked={row.active}
                              onClick={() => this.handleActive(row)}
                              value={row.active}
                              color="primary"
                            />
                          </TableCell>
                          <TableCell align="left"><Button onClick={() => this.editSchool(row)}>Edit</Button></TableCell>
                          <TableCell align="left"><Button onClick={() => this.deleteSchool(row)}>Delete</Button></TableCell>
                        </TableRow>
                      )
                    }
                  })}
                </TableBody>
              </Table>
            </Paper>
        </center>
      <Dialog
          open={this.state.edit}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit School</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Edit School Information
                </DialogContentText>
            {/* Username input for new school */}
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Username"
              type="text"
              onChange={this.handleNameChange}
              value={this.state.name}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Password"
              type="password"
              onChange={this.handlePasswordChange}
              value={this.state.password}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="School Name"
              type="text"
              onChange={this.handleSchoolChange}
              value={this.state.school_name}
              fullWidth
            />
          </DialogContent>          
          <DialogActions>
            <Button onClick={() => this.handleClose()} color="primary">
              Cancel
                            </Button>
            <Button disabled={!isEnabled} onClick={() => this.editHandleClick()} color="primary">
              Submit
                            </Button>
          </DialogActions>         
        </Dialog>
        </>
        :
      <div>
        
        <div>
          <h1 className="heading">
            Schools
        </h1>
          <center>
            {/* start add school */}
            <div >
              <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                Add New School
                        </Button>
              <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Add School</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Add a new school
                  </DialogContentText>
                  {/* Username input for new school */}
                  <TextField
                    autoFocus
                    margin="dense"
                    id="newUsername"
                    label="Username"
                    type="text"
                    onChange={this.handleUsername}
                    value={this.state.username}
                    fullWidth
                  />

                  {/* password input for new school */}
                  <TextField
                    autoFocus
                    margin="dense"
                    id="newPassword"
                    label="Password"
                    type="password"
                    onChange={this.handlePassword}
                    value={this.state.password}
                    fullWidth
                  />
                  {/* input for new schools name */}
                  <TextField
                    autoFocus
                    margin="dense"
                    id="newName"
                    label="School Name"
                    type="text"
                    onChange={this.handleName}
                    value={this.state.school_name}
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleClose} color="primary">
                    Cancel
                            </Button>
                  <Button disabled={!isEnabled} onClick={() => this.handleClick()} color="primary">
                    Submit
                            </Button>
                </DialogActions>
              </Dialog>
            </div>
            {/* end add school */}
            <Paper>
              <Table className="adminTable">
                <TableHead>
                  <TableRow>
                    <TableCell>School Name</TableCell>
                    <TableCell>Date Created</TableCell>
                    <TableCell align="center">Active?</TableCell>
                    <TableCell align="center">Edit</TableCell>
                    <TableCell align="center">Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.reduxStore.personReducer.map((row) => {
                    if (row.admin === false) {
                      return (
                        <TableRow key={row.id}>
                          <TableCell align="left">{row.school_name}</TableCell>
                          <TableCell align="left">{moment(row.creation_date).format('MMMM Do YYYY')}</TableCell>
                          <TableCell align="left">
                            <Switch
                              id=''
                              checked={row.active}
                              onClick={() => this.handleActive(row)}
                              value={row.active}
                              color="primary"
                            />
                          </TableCell>
                          <TableCell align="left"><Button onClick={() => this.editSchool(row)}>Edit</Button></TableCell>
                          <TableCell align="left"><Button onClick={() => this.deleteSchool(row)}>Delete</Button></TableCell>
                        </TableRow>
                      )
                    }
                  })}
                </TableBody>
              </Table>
            </Paper>
          </center>
        </div>
      </div>
    )
  }
};

const mapStateToProps = reduxStore => ({
  reduxStore,
});

export default withStyles(styles)(connect(mapStateToProps)(AdminSchools))