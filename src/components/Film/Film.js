import { Component } from 'react'
import PropTypes from 'prop-types'

import './Film.css'

export default class Film extends Component {
  static defaultProps = {
    filmInfo: {},
  }

  static propTypes = {
    filmInfo: PropTypes.object.isRequired,
  }

  render() {
    const { title, date, description, image } = this.props.filmInfo

    return (
      <div className="film">
        <img className="film__image" src={image} alt="" />
        <div className="film__info">
          <h5 className="film__title">{title}</h5>
          <p className="film__date">{date}</p>
          <ul className="film__types">
            <li className="film__type">Action</li>
            <li className="film__type">Drama</li>
          </ul>
          <p className="film__description">{description}</p>
        </div>
      </div>
    )
  }
}
