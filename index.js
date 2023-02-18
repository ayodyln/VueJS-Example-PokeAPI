import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js"

createApp({
  data() {
    return {
      pageCount: 1,
      pokedex: {
        list: [],
        next: "",
        prev: null,
      },
      favorites: [],
      filter: "",
      typeFilter: [
        "Normal",
        "Fire",
        "Water",
        "Grass",
        "Electric",
        "Ice",
        "Fighting",
        "Poison",
        "Ground",
        "Flying",
        "Psychic",
        "Bug",
        "Rock",
        "Ghost",
        "Dragon",
        "Dark",
        "Steel",
      ],
    }
  },
  methods: {
    async fetchNextPokemon() {
      if (this.pageCount === 5) return
      this.pageCount++
      this.filter = ""
      await this.fetchPokedex(this.pokedex.next)
    },
    async fetchPrevPokemon() {
      if (this.pageCount === 1) return
      this.pageCount--
      this.filter = ""
      await this.fetchPokedex(this.pokedex.prev)
    },
    async fetchPokedex(
      url = "https://pokeapi.co/api/v2/pokemon/?limit=30&offset=0"
    ) {
      try {
        const data = await fetch(url)
        const pokemon = await data.json()

        this.pokedex.list = await this.fetchPokemonData(pokemon.results)
        this.pokedex.next = pokemon.next
        this.pokedex.prev = pokemon.previous
      } catch (error) {
        console.error(error)
      }
    },
    async fetchPokemonData(pokedexResults) {
      return Promise.all(
        pokedexResults
          .map(async (pokemon) => {
            try {
              const data = await fetch(pokemon.url)
              const res = await data.json()
              return {
                name: res.name,
                image: res.sprites.front_default,
                id: res.id,
                type: res.types.map((type) => type.type.name),
                weight: res.weight,
                favorite: this.favorites.find(
                  (pokemon) => pokemon.name === res.name
                ),
              }
            } catch (error) {
              console.log(error)
            }
          })
          .sort((a, b) => a.id - b.id)
      ).then((val) => val)
    },
    toggleFavorite(event) {
      const pokeID = event.target.dataset.id * 1
      const pokemon = this.pokedex.list.find((pokemon) => pokemon.id === pokeID)

      if (pokemon.favorite) {
        pokemon.favorite = !pokemon.favorite
        this.favorites = this.favorites.filter(
          (poke) => poke.name !== pokemon.name
        )
      } else {
        pokemon.favorite = !pokemon.favorite
        this.favorites.push(pokemon)
      }
    },
    logFavorites() {
      console.log(this.favorites)
    },
    filterPokemon() {
      this.pokedex.list = this.pokedex.list.filter((pokemon) =>
        pokemon.type.includes(this.filter.toLowerCase())
      )
    },
    async resetFilter() {
      await this.fetchPokedex()
      this.pageCount = 1
    },
  },
  async mounted() {
    console.log(`App Mounted`)
    try {
      await this.fetchPokedex()
    } catch (error) {
      console.log(error)
    }
  },
}).mount("#vue")
