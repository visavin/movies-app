import React, { Component } from 'react'
import { Spin, Alert, Pagination, Tabs } from 'antd'
import { Offline } from 'react-detect-offline'

import FilmList from '../FilmList'
import Search from '../Search'
import ThemoviedbService from '../../services/ThemoviedbService'
import { GenreProvider } from '../context'

import 'antd/dist/antd.css'
import './App.css'

export default class App extends Component {
  movieService = new ThemoviedbService()

  state = {
    guestSessionId: '',
    movies: [],
    moviesRates: {},
    genres: [],
    totalPages: 1,
    totalResults: 0,
    currentPage: 1,
    query: '',
    loading: false,
    error: false,
  }

  onChangeMoviesRates = (filmId, filmRate) => {
    console.log(filmId, ' ', filmRate)
    console.log(this.state.moviesRates)
    this.setState(({ moviesRates }) => {
      return {
        moviesRates: { ...moviesRates, [filmId]: filmRate },
      }
    })
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

  startGuestSession() {
    this.movieService
      .guestSession()
      .then((result) => {
        this.setState({
          guestSessionId: result.guest_session_id,
        })
      })
      .catch(this.onError)
  }

  loadGenres() {
    this.movieService
      .getGenres()
      .then((result) => {
        this.setState({
          genres: result.genres,
        })
      })
      .catch(this.onError)
  }

  onChangePage = (page) => {
    this.setState({ currentPage: page })
  }

  componentDidMount() {
    this.startGuestSession()
    this.loadGenres()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.query && this.state.query !== prevState.query) {
      this.updateMovies()
    }
    if (this.state.currentPage !== prevState.currentPage) {
      this.updateMovies()
    }
  }

  render() {
    const { movies, moviesRates, totalResults, currentPage, loading, error, query } = this.state
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
    const content = hasData ? (
      <FilmList movies={movies} moviesRates={moviesRates} onChangeMoviesRates={this.onChangeMoviesRates} />
    ) : null
    const emptySearch = emptySearchResult ? <p>The search yielded no results</p> : null
    const pagination =
      hasData && !emptySearchResult ? (
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
        <GenreProvider value={this.state.genres}>
          <Tabs
            defaultActiveKey="1"
            centered
            destroyInactiveTabPane
            items={[
              {
                label: 'Search',
                key: '1',
                children: (
                  <React.Fragment>
                    <Search onAddedQuery={this.onAddedQuery} />
                    {errorMessage}
                    {spinner}
                    {emptySearch}
                    {content}
                    {pagination}
                  </React.Fragment>
                ),
              },
              {
                label: 'Rated',
                key: '2',
                children: 'Content of Tab Pane 2',
              },
            ]}
          />
        </GenreProvider>
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
