import { Component } from 'react'
import PropTypes from 'prop-types'
import { Rate } from 'antd'
import classNames from 'classnames'

import { GenreConsumer } from '../context'

import './Film.css'

export default class Film extends Component {
  static defaultProps = {
    filmInfo: {},
  }

  static propTypes = {
    filmInfo: PropTypes.object.isRequired,
  }

  render() {
    const { title, date, description, image, vote, genreIds } = this.props.filmInfo
    let voteClass = classNames({
      'film__vote--red': vote > 0 && vote <= 3,
      'film__vote--orange': vote > 3 && vote <= 5,
      'film__vote--yellow': vote > 5 && vote <= 7,
      'film__vote--green': vote > 7,
    })

    return (
      <GenreConsumer>
        {(genres) => {
          const filmGenres = genreIds.map((item) => {
            return (
              <li key={item} className="film__type">
                {genres.filter((genre) => genre.id === item)[0].name}
              </li>
            )
          })

          return (
            <div className="film">
              <img className="film__image" src={image} alt="" />
              <div className="film__info">
                <div className="film__header">
                  <h5 className="film__title">{title}</h5>
                  <div className={voteClass + ' film__vote'}>{vote}</div>
                </div>
                <p className="film__date">{date}</p>
                <ul className="film__types">{filmGenres}</ul>
                <p className="film__description">{description}</p>
                <Rate count={10} onChange={this.props.onChangeMovieRate} value={this.props.movieRate} />
              </div>
            </div>
          )
        }}
      </GenreConsumer>
    )
  }
}
