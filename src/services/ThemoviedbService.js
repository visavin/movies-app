import { format, parseISO } from 'date-fns'

export default class ThemoviedbService {
  _apiBase = 'https://api.themoviedb.org/3'

  _apiKey = 'cde6f4e29f881453253ebd1d33efaec3'

  async getResource(url, parameters = '') {
    const res = await fetch(`${this._apiBase}${url}?api_key=${this._apiKey}&${parameters}`)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}` + `, received ${res.status}`)
    }
    return await res.json()
  }

  async getGenres() {
    return await this.getResource('/genre/movie/list')
  }

  async guestSession() {
    return await this.getResource('/authentication/guest_session/new')
  }

  async searchFilms(query, page) {
    const films = await this.getResource('/search/movie/', `query=${query}&page=${page}`)
    return {
      filmList: films.results.map(this._transformFilm),
      total_pages: films.total_pages,
      total_results: films.total_results,
    }
  }

  _transformFilm(film) {
    const shorten = (str, maxLen = 100, separator = ' ') => {
      if (str.length <= maxLen) return str
      return str.substring(0, str.lastIndexOf(separator, maxLen)) + '...'
    }

    let date = film.release_date

    try {
      date = format(parseISO(film.release_date), 'MMMM dd, yyyy')
    } catch (error) {
      console.log(error.message)
    }

    return {
      id: film.id,
      title: film.title,
      date: date,
      description: shorten(film.overview),
      image: `https://image.tmdb.org/t/p/original${film.poster_path}`,
      vote: film.vote_average,
      genreIds: film.genre_ids,
    }
  }
}
