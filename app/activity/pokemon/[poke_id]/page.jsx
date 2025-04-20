'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import PokemonReviewForm from '@/components/PokemonReviewForm'
import PokemonReviewCard from '@/components/PokemonReviewCard'

export default function PokemonDetailPage() {
  const { poke_id } = useParams()
  const [pokemon, setPokemon] = useState(null)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: pokemonData, error: pokemonError } = await supabase
        .from('pokemon_list')
        .select('*')
        .eq('id', poke_id)
        .single()

      if (pokemonError) {
        console.error('Error fetching Pokémon:', pokemonError)
        return
      }

      const { data: reviewData, error: reviewError } = await supabase
        .from('pokemon_reviews')
        .select('*')
        .eq('pokemon_name', pokemonData.name)
        .order('created_at', { ascending: false })

      if (reviewError) {
        console.error('Error fetching reviews:', reviewError)
        return
      }

      setPokemon(pokemonData)
      setReviews(reviewData)
    }

    if (poke_id) fetchData()
  }, [poke_id])

  if (!pokemon) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold capitalize">{pokemon.name}</h1>
      <img src={pokemon.image_url} alt={pokemon.name} className="w-40 h-40 my-4" />

      <PokemonReviewForm
        pokemonName={pokemon.name}
        onReviewAdded={() => {
          supabase
            .from('pokemon_reviews')
            .select('*')
            .eq('pokemon_name', pokemon.name)
            .order('created_at', { ascending: false })
            .then(({ data }) => setReviews(data))
        }}
      />

      <h2 className="text-2xl mt-8 mb-4">Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <PokemonReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}
