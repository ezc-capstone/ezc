import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {Login, Signup, UserHome, GamesList, PlayersList, SubmissionWrapper, Compilation} from './components'
import {me} from './store'
import { getGames } from './store/games'
import { getAllUsers } from './store/users';
import Chat from './components/comments'


class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props

    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path='/games/:gameId/compilation' render={({match, location}) => <Compilation match={match} location={location}/>}/>
        <Route path='/test-socket' component={Chat}/>
        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}
            <Route exact path="/home" component={UserHome} />
            <Route exact path="/games" render={({match}) => <GamesList match={match}/>} />
            <Route path="/selectplayers" component={PlayersList} />
            <Route exact path='/games/:gameId/submissions' render={({match, history,location})=> <SubmissionWrapper match={match} history={history} location={location}/>} />
            {/* //Question: how to differentiate between drawing and phrase guess? */}

          </Switch>
        )}
        {/* Displays our Login component as a fallback */}
        <Route component={Login} />

      </Switch>
    )
  }
}


const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
      dispatch(getAllUsers())
      dispatch(getGames())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
