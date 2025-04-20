'use client'
import { useState } from 'react'

export default function PokemonSearch({ onSelect }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [pokemonData, setPokemonData] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`)
      if (!res.ok) throw new Error('Pokémon not found')
      const data = await res.json()
      setPokemonData(data)
      onSelect(data) // Notify parent component
    } catch (err) {
      setError(err.message)
      setPokemonData(null)
    }
  }

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search Pokémon by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-3 py-2 rounded"
      />
      <button onClick={handleSearch} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
        Search
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {pokemonData && (
        <div className="mt-4">
          <h2 className="text-lg font-bold capitalize">{pokemonData.name}</h2>
          <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
        </div>
      )}
    </div>
  )
}
