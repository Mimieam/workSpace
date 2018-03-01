import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import Button from 'material-ui/Button';
import indigo from 'material-ui/colors/indigo';
import pink from 'material-ui/colors/pink';
import red from 'material-ui/colors/red';
import withStyles from 'material-ui/styles/withStyles';

import Icon from 'material-ui/Icon';
import AddToPhotosIcon from 'material-ui-icons/AddToPhotos';
import IconButton from 'material-ui/IconButton';
import Modal from 'material-ui/Modal/Modal';
import Typography from 'material-ui/Typography/Typography';
import StyledModal from './styledModal'

import './muscle.css'
import '../index.css';
import Workspace from './workspace'
import { GCWindows , GCTabs } from '../background/helpers';

import theme from './theme'

export const styles = {
  root: {
    padding:'5px',
    width: 530,
    height: 500,
    background: '#363537',
    color: '#fff',
    // overflow: 'hidden'
  },
  customButton: {
     background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
     borderRadius: 3,
     border: 0,
     color: 'white',
     height: 48,
     padding: '0 30px',
     boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .30)',
  }
  ,
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
};

class Popup extends Component {

  constructor (props) {
    super(props)
    this.state = {
      workspaces:[]
    }
  }

  onClick = () => {
    this.modal.handleOpen() // do stuff
  }
  
  async createNewWS(name) {
    /*  In case in the future you decide to add support for workspace spanning multiple windows...
     *  use the code below to get your formated Object instead of an array 
     *   
    // query all windows...
    const t = await GCTabs._query({})

    // aggregate tabs by windowID 
    const formatted = t.reduce((obj, tab, index) => {
      obj[tab.windowId] ?  obj[tab.windowId].push(tab): obj[tab.windowId] = [tab]
      return obj
    }, {})
    */

    let currWindow = await GCWindows.getLastFocused(true)
    const formatted = currWindow.tabs

    const ws = {
      name: name,
      tabs: formatted
    }
    // console.log('parent fct called - received', name, JSON.stringify(formatted))
    await this.setState({
      workspaces: this.state.workspaces.concat(ws)
    })
    console.log(ws)
    return ws
  }

  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={ theme }>
        <div className='flex-container top column' style={ styles.root }>  
          <div className={ 'flex-item row fixed-header' }>
            <div className={ 'flex-item top center' }>
              <Typography variant="title" gutterBottom>
                [WSp]
              </Typography>
            </div>  
            <div className={'flex-item top right'}>
              <IconButton onClick={ this.onClick } style={ styles.customButton }>
                <AddToPhotosIcon/> 
              </IconButton>
            </div>  
          </div>  

          <div className={ 'flex-item column' } style={ {
            justifyContent: 'start',
            wordWrap: 'break-word',
            overflowX: 'hidden'
          } }>
            
          
          
          { console.log(this.state.workspaces) }
            {
              this.state.workspaces.map((ws) => {
                return <Workspace
                  name={ ws.name }
                  urls={ ws.tabs }
                />
              })
            }  
            
          </div>

          </div>  
          <StyledModal
            callback={this.createNewWS.bind(this)}  
            onRef={ ref => (this.modal = ref) }
          />
      </MuiThemeProvider>  
    )
  }
}

export default Popup

const StyledPopup = withStyles(styles)(Popup);
ReactDOM.render(<StyledPopup />, document.getElementById('root'));
