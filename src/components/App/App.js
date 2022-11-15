import React, { Component } from 'react'
import { Spin, Alert, Pagination } from 'antd'
import { Offline } from 'react-detect-offline'

import FilmList from '../FilmList'
import Search from '../Search'
import ThemoviedbService from '../../services/ThemoviedbService'

import 'antd/dist/antd.css'
import './App.css'

export default class App extends Component {
  movieService = new ThemoviedbService()

  state = {
    movies: [],
    totalPages: 1,
    totalResults: 0,
    currentPage: 1,
    query: '',
    loading: false,
    error: false,
  }

  onAddedQuery = (query) => {
    this.setState({ query: query, currentPage: 1 })
  }

  onMoviesLoaded = (movies) => {
    this.setState({
      movies: movies.filmList,
      totalPages: movies.total_pages,
      totalResults: movies.total_results,
      loading: false,
      error: false,
    })
  }

  onError = (error) => {
    this.setState({ error: true, loading: false })
    console.log(`Текст ошибки: ${error.message}.`)
  }

  updateMovies() {
    this.setState({ loading: true })
    this.movieService
      .searchFilms(this.state.query, this.state.currentPage)
      .then(this.onMoviesLoaded)
      .catch(this.onError)
  }

  onChangePage = (page) => {
    this.setState({ currentPage: page })
  }

  // componentDidMount() {
  //   this.updateMovies()
  // }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.query && this.state.query !== prevState.query) {
      this.updateMovies()
    }
    if (this.state.currentPage !== prevState.currentPage) {
      this.updateMovies()
    }
  }

  render() {
    console.log(this.state.currentPage, ' ', this.state.totalPages)

    const { movies, totalResults, currentPage, loading, error, query } = this.state
    const hasData = !(loading || error || !query)
    const emptySearchResult = !(!hasData || movies.length)
    const errorMessage = error ? (
      <Alert
        message="Error"
        description="This is an error message about connection with database. Try again later..."
        type="error"
        showIcon
      />
    ) : null
    const spinner = loading ? <Spin size="large" /> : null
    const content = hasData ? <FilmList movies={movies} /> : null
    const emptySearch = emptySearchResult ? <p>The search yielded no results</p> : null
    const pagination = hasData ? (
      <Pagination
        defaultPageSize={20}
        showSizeChanger={false}
        current={currentPage}
        onChange={this.onChangePage}
        total={totalResults}
      />
    ) : null

    return (
      <div className="container">
        <Offline>
          <OfflineAlert />
        </Offline>
        <Search onAddedQuery={this.onAddedQuery} />
        {errorMessage}
        {spinner}
        {emptySearch}
        {content}
        {pagination}
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
