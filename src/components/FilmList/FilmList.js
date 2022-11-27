import { Component } from 'react'
import PropTypes from 'prop-types'

import Film from '../Film'

import './FilmList.css'

export default class FilmList extends Component {
  static defaultProps = {
    movies: [],
  }

  static propTypes = {
    movies: PropTypes.array.isRequired,
  }

  render() {
    const films = this.props.movies.map((item) => {
      const { id, ...filmInfo } = item

      return (
        <li key={id}>
          <Film
            filmInfo={filmInfo}
            movieRate={this.props.moviesRates[id]}
            onChangeMovieRate={(filmRate) => this.props.onChangeMoviesRates(id, filmRate)}
          />
        </li>
      )
    })

    return <ul className="film-list">{films}</ul>
  }
}
