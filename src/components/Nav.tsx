import React, { Component } from 'react';
import { connect } from "react-redux";
import { request } from "../store/api";
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Menu as MenuIcon, Person as PersonIcon, AccountCircle as AccountCircleIcon } from '@material-ui/icons';

class Nav extends Component<{ classes: any, user: any }> {
  componentDidMount() {
    request([{
      endpoint: "GET_USER"
    }])
  }
  render() {
    const { classes } = this.props;
    console.log(this.props)
    return (
      <div className={classes.root}>
        <AppBar position="absolute" style={{ backgroundColor: 'white' }}>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Makerhive
          </Typography>
            {this.props.user ? <>
              <Typography variant="h6">
                {this.props.user.name}
          </Typography>
              <IconButton
                edge="end"
                aria-label={this.props.user.name + 's Account'}
                //aria-controls={menuId}
                aria-haspopup="true"
                //onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircleIcon />
              </IconButton>
            </>
              :
              <Button color="inherit">Login <PersonIcon /></Button>
            }
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

const styles = ({ spacing }: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: spacing(2),
  },
  title: {
    flexGrow: 1,
    textAlign: "start",
  }
});

const mapStatetoProps = (state: { user: any; }) => ({
  user: state.user
});


export default connect(mapStatetoProps)(withStyles(styles)(Nav))