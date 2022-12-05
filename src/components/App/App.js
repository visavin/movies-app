import React, { Component } from 'react'
import { Spin, Alert, Pagination, Tabs } from 'antd'
// import { Offline } from 'react-detect-offline'

import FilmList from '../FilmList'
import Search from '../Search'
import ThemoviedbService from '../../services/ThemoviedbService'
import { GenreProvider } from '../context'

import 'antd/dist/antd.css'
import './App.css'

export default class App extends Component {
  movieService = new ThemoviedbService()

  state = {
    network: true,
    guestSessionId: '',
    movies: [],
    ratedMovies: [],
    ratedTotalPages: 1,
    ratedTotalResults: 0,
    moviesRates: {},
    genres: [],
    totalPages: 1,
    totalResults: 0,
    currentPage: 1,
    query: '',
    loading: false,
    error: false,
  }

  onNetworkState = () => {
    this.setState((prevState) => ({ network: !prevState.network }))
  }

  onChangeMoviesRates = (filmId, filmRate) => {
    this.setState(({ moviesRates }) => {
      return {
        moviesRates: { ...moviesRates, [filmId]: filmRate },
      }
    })
    this.movieService
      .setRatedMovies(this.state.guestSessionId, filmId, filmRate)
      .then(() => {
        this.updateRatedMovies(this.state.guestSessionId)
        setTimeout(() => {
          this.updateRatedMovies(this.state.guestSessionId)
        }, 1000)
      })
      .catch(this.onError)
  }

  onAddedQuery = (query) => {
    this.setState({ query: query, currentPage: 1 })
  }

  onMoviesLoaded = (movies) => {
    this.setState(() => ({
      movies: movies.filmList,
      totalPages: movies.total_pages,
      totalResults: movies.total_results,
      loading: false,
      error: false,
    }))
  }

  onRatedMoviesLoaded = (movies) => {
    this.setState(() => ({
      ratedMovies: movies.filmList,
      ratedTotalPages: movies.total_pages,
      ratedTotalResults: movies.total_results,
      loading: false,
      error: false,
    }))
  }

  onError = (error) => {
    this.setState({ error: true, loading: false })
    console.log(`Текст ошибки: ${error.message}.`)
  }

  updateMovies() {
    this.setState({ loading: true })
    if (this.state.query) {
      this.movieService
        .searchFilms(this.state.query, this.state.currentPage)
        .then(this.onMoviesLoaded)
        .catch(this.onError)
    } else {
      this.movieService.topRatedFilms(this.state.currentPage).then(this.onMoviesLoaded).catch(this.onError)
    }
  }

  startGuestSession() {
    this.movieService
      .guestSession()
      .then((result) => {
        this.setState({
          guestSessionId: result.guest_session_id,
        })
        return result.guest_session_id
      })
      .then((guest_session_id) => this.updateRatedMovies(guest_session_id))
      .catch(this.onError)
  }

  updateRatedMovies(guestSessionId) {
    this.movieService.getRatedMovies(guestSessionId).then(this.onRatedMoviesLoaded).catch(this.onError)
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
    this.updateMovies()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.query && this.state.query !== prevState.query) {
      this.updateMovies()
    }
    if (this.state.currentPage !== prevState.currentPage) {
      this.updateMovies()
    }
    if (this.state.moviesRates !== prevState.moviesRates) {
      this.updateRatedMovies(this.state.guestSessionId)
    }
  }

  render() {
    const { movies, moviesRates, totalResults, currentPage, loading, error, ratedMovies, network } = this.state
    // const hasData = !(loading || error || !query)
    const hasData = !(loading || error)
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
    const ratedContent = ratedMovies.length ? (
      <FilmList movies={ratedMovies} moviesRates={moviesRates} onChangeMoviesRates={this.onChangeMoviesRates} />
    ) : null
    const emptySearch = emptySearchResult ? <p>The search yielded no results</p> : null
    const emptyRatedContent = !ratedMovies.length && !error ? <p>There are no rated films</p> : null
    const pagination =
      hasData && !emptySearchResult ? (
        <Pagination
          defaultPageSize={20}
          showSizeChanger={false}
          current={currentPage}
          onChange={this.onChangePage}
          total={totalResults < 10000 ? totalResults : 10000}
        />
      ) : null
    const offlineAlert = !network ? <OfflineAlert /> : null

    return (
      <div className="container">
        <NetworkState onNetworkState={this.onNetworkState} />
        {offlineAlert}
        {/*<Offline>*/}
        {/*  <OfflineAlert />*/}
        {/*</Offline>*/}
        <GenreProvider value={this.state.genres}>
          <Tabs
            defaultActiveKey="1"
            centered
            // destroyInactiveTabPane
            items={[
              {
                label: 'Search',
                key: '1',
                children: (
                  <React.Fragment>
                    {errorMessage}
                    <Search onAddedQuery={this.onAddedQuery} />
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
                children: (
                  <React.Fragment>
                    {errorMessage}
                    {spinner}
                    {emptyRatedContent}
                    {ratedContent}
                  </React.Fragment>
                ),
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

const NetworkState = ({ onNetworkState }) => {
  window.onoffline = () => {
    onNetworkState()
  }
  window.ononline = () => {
    onNetworkState()
  }
}
