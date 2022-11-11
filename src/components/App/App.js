import React, { Component } from 'react'
import { Spin, Alert } from 'antd'
import { Offline } from 'react-detect-offline'

import FilmList from '../FilmList'
import ThemoviedbService from '../../services/ThemoviedbService'

import 'antd/dist/antd.css'
import './App.css'

export default class App extends Component {
  movieService = new ThemoviedbService()

  state = {
    movies: [{ id: 0 }],
    loading: true,
    error: false,
  }

  constructor(props) {
    super(props)
    this.updateMovies()
  }

  onMoviesLoaded = (movies) => {
    this.setState({ movies, loading: false })
  }

  onError = () => {
    this.setState({ error: true, loading: false })
  }

  updateMovies() {
    this.movieService.searchFilms('return').then(this.onMoviesLoaded).catch(this.onError)
  }

  render() {
    const { movies, loading, error } = this.state
    const hasData = !(loading || error)
    const errorMessage = error ? (
      <Alert
        message="Error"
        description="This is an error message about connection with database."
        type="error"
        showIcon
      />
    ) : null
    const spinner = loading ? <Spin size="large" /> : null
    const content = hasData ? <FilmList movies={movies} /> : null

    return (
      <div className="container">
        <Offline>
          <OfflineAlert />
        </Offline>
        {errorMessage}
        {spinner}
        {content}
      </div>
    )
  }
}

const OfflineAlert = () => {
  return (
    <React.Fragment>
      <div className="overlay"></div>
      <Alert
        className="alert"
        message="Warning"
        description="You do not have an Internet connection."
        type="warning"
        showIcon
      />
    </React.Fragment>
  )
}
