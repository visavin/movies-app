import { Component } from 'react'
import PropTypes from 'prop-types'

import Film from '../Film'

import './FilmList.css'

export default class FilmList extends Component {
  static defaultProps = {
    movies: [{}],
  }

  static propTypes = {
    movies: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  render() {
    const films = this.props.movies.map((item) => {
      const { id, ...filmInfo } = item

      return (
        <li key={id}>
          <Film filmInfo={filmInfo} />
        </li>
      )
    })

    return <ul className="film-list">{films}</ul>
  }
}
