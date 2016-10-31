import {connect} from 'react-redux'
import Shortcut from './Shortcut'

function mapDispatchToProps() {
  return {}
}

function mapStateToProps(store, ownProps) {
  return {
    hotkeys: ownProps.hotkeys,
    show: store.get('shortcut').get('show')
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Shortcut)
