import { Component } from 'react'
// import { DatePicker, Button } from 'antd'

import FilmList from '../FilmList'
import ThemoviedbService from '../../services/ThemoviedbService'

import 'antd/dist/antd.css'
import './App.css'

export default class App extends Component {
  movieService = new ThemoviedbService()

  state = {
    movies: [{}],
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

    console.log(movies)

    return (
      <div className="container">
        <FilmList movies={movies} />
        {/*<DatePicker />*/}
        {/*<Button type="primary">Button</Button>*/}
      </div>
    )
  }
}
