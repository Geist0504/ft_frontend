import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import AuthContext from '../context/auth-context'
import SkillRater from '../components/Forms/SkillRater'
// import LocationSearchInput from '../components/Forms/LocationAutocomplete'
import MaterialLocation from '../components/Forms/MaterialLocation'

import './SignIn.css'
const backendURL = 'http://localhost:8000/graphql'

const finalStep = 2

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class SignIn extends Component {
  state = {
    isLogin: true,
    signUpStep: 1,
  }

  static contextType = AuthContext

  constructor(props){
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.usernameEl = React.createRef();
  }
  switchModeHandler = (event) => {
    event.preventDefault();
    this.setState(prevState => {
      return {isLogin: !prevState.isLogin};
    })
  }

  nextStep = () => {
    const { signUpStep } = this.state
    this.setState({
        signUpStep : signUpStep + 1
    })
}

prevStep = () => {
    const { signUpStep } = this.state
    this.setState({
        signUpStep : signUpStep - 1
    })
}

  handleChange = name => value => {
    this.setState({
      [name]: value,
    });
  };

  onNewRequest = (selectedData, searchedText, selectedDataIndex) => {
    console.log(selectedData, searchedText, selectedDataIndex);
  }

  submitHandler = (event) =>  {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const username = this.usernameEl.current.value;
    const password = this.passwordEl.current.value;

    //Could add more robust validation and feedback here
    if (email.trim().length === 0 || password.trim().length ===0){
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}"){
            userId
            token
            tokenExpiration
          }
        }
      `
    }

    if (!this.state.isLogin) {
      requestBody ={
         query: `
           mutation{
             createUser(userInput:{email: "${email}", username: "${username}", password: "${password}"}){
               _id
               email
             }
           }
         `
       }
    }
    //send to the backend
    //TODO: Refactor to call to backend middleware
    fetch(backendURL, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!')
      }
      return res.json();
    })
    .then(resData => {
      if(resData.data.login.token){
        this.context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration)
      }
    })
    .catch(err => {
      console.log(err)
    })
  };

  render(){
    const { classes } = this.props;
    const { isLogin, signUpStep } = this.state;
    return (
        <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                {isLogin ? 'Sign in' : 'Sign up'}
            </Typography>
            <form className={classes.form}>
            {signUpStep ===  1 && (<React.Fragment>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="email">Email Address</InputLabel>
                    <Input id="email" name="email" autoComplete="email" autoFocus />
                </FormControl>
                {!isLogin &&
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <Input id="username" name="username"  />
                    </FormControl>
                }
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input name="password" type="password" id="password" autoComplete="current-password" />
                </FormControl>
                {isLogin && <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />}
            </React.Fragment> )}
            {(!isLogin && signUpStep ===2) &&(
                <React.Fragment>
                    <MaterialLocation />
                    <SkillRater />
                    {/* <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">Languages You Speak</InputLabel>
                        <Input id="email" name="email"  />
                    </FormControl> */}

                </React.Fragment>
            )
            }
            <div className={(signUpStep !== 1) ? "buttonWrapper" : 'null'}>
                {signUpStep !== 1 && (
                    <Button
                        onClick={this.prevStep}
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        >
                        Previous
                    </Button>)}
                {(isLogin || (signUpStep === finalStep)) && ( 
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {isLogin ? 'Sign in' : (signUpStep === finalStep) ? 'Sign Up' : 'Save and Continue'}
                    </Button>
                )}
                {(!isLogin && signUpStep < finalStep) &&(
                    <Button
                        onClick={this.nextStep}
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Save and Continue
                    </Button>
                )}
            </div>
            <Button
                onClick={this.switchModeHandler}
                variant="contained"
                fullWidth
                color="tertiary"
                className={classes.submit}
            >
                {isLogin ? 'No Account? Sign up' : 'I have an Account. Sign me in'} 
            </Button>
            </form>
        </Paper>
        </main>
    );
    }
}
SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);