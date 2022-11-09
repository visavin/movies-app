import { Component } from 'react'
// import { Spin } from 'antd'

import FilmList from '../FilmList'
import ThemoviedbService from '../../services/ThemoviedbService'

import 'antd/dist/antd.css'
import './App.css'

export default class App extends Component {
  movieService = new ThemoviedbService()

  state = {
    movies: [{ id: 0 }],
  }

  constructor(props) {
    super(props)
    this.updateMovies()
  }

  onMoviesLoaded = (movies) => {
    this.setState({ movies })
  }

  updateMovies() {
    this.movieService.searchFilms('return').then(this.onMoviesLoaded)
  }

  render() {
    const { movies } = this.state

    return (
      <div className="container">
        <FilmList movies={movies} />
      </div>
    )
  }
}
