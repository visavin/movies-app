import { Component } from 'react'
import { debounce } from 'lodash'

import './Search.css'

export default class Search extends Component {
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
