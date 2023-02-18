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
    }
  },
  methods: {
    async fetchNextPokemon() {
      if (this.pageCount === 5) return
      this.pageCount++
      await this.fetchPokedex(this.pokedex.next)
    },
    async fetchPrevPokemon() {
      if (this.pageCount === 1) return
      this.pageCount--
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
              return await data.json()
            } catch (error) {
              console.log(error)
            }
          })
          .sort((a, b) => a.id - b.id)
      ).then((val) => val)
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
