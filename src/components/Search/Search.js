import { Component } from 'react'
import { debounce } from 'lodash'
import PropTypes from 'prop-types'

import './Search.css'

export default class Search extends Component {
  static defaultProps = {
    onAddedQuery: () => {},
  }

  static propTypes = {
    onAddedQuery: PropTypes.func,
  }

  state = {
    description: '',
  }

  debounceQuery = debounce((query) => {
    this.props.onAddedQuery(query)
  }, 1000)

  onChanged = (event) => {
    this.setState({
      description: event.target.value,
    })
    this.debounceQuery(event.target.value)
  }

  render() {
    return (
      <input
        className="search"
        placeholder="Type to search..."
        autoFocus
        onInput={this.onChanged}
        value={this.state.description}
      />
    )
  }
}
