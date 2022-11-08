import { format, parseISO } from 'date-fns'

export default class ThemoviedbService {
  _apiBase = 'https://api.themoviedb.org/3'

  _apiKey = 'cde6f4e29f881453253ebd1d33efaec3'

  async getResource(url, parameters) {
    const res = await fetch(`${this._apiBase}${url}?api_key=${this._apiKey}&${parameters}`)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}` + `, received ${res.status}`)
    }
    return await res.json()
  }

  async searchFilms(query) {
    const films = await this.getResource('/search/movie/', `query=${query}`)
    return films.results.map(this._transformFilm)
  }

  _transformFilm(film) {
    const shorten = (str, maxLen = 170, separator = ' ') => {
      if (str.length <= maxLen) return str
      return str.substring(0, str.lastIndexOf(separator, maxLen)) + '...'
    }

    return {
      id: film.id,
      title: film.title,
      date: format(parseISO(film.release_date), 'MMMM dd, yyyy'),
      description: shorten(film.overview),
      image: `https://image.tmdb.org/t/p/original${film.poster_path}`,
    }
  }
}

// const movie = new ThemoviedbService()
//
// movie.searchFilms('return').then((films) => {
//     console.log(films)
// })
