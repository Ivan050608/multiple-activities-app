'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import PokemonReviewCard from '@/components/PokemonReviewCard';

export default function PokemonPage() {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [reviews, setReviews] = useState({});
  const [sortAsc, setSortAsc] = useState(true); // ✅ Added sort state

  const fetchPokemon = async () => {
    const { data, error } = await supabase
      .from('pokemon_list')
      .select('*')
      .order('name', { ascending: sortAsc }); // ✅ Dynamic sort

    if (!error) {
      setPokemonList(data);
    }
  };

  const fetchReviews = async (pokemonId) => {
    const { data, error } = await supabase
      .from('pokemon_reviews')
      .select('*')
      .eq('pokemon_id', pokemonId);

    if (!error) {
      setReviews((prevReviews) => ({ ...prevReviews, [pokemonId]: data }));
    }
  };

  const handleAddPokemon = async () => {
    if (!name || !imageUrl) return;

    const { data, error } = await supabase
      .from('pokemon_list')
      .insert([{ name: name.toLowerCase(), image_url: imageUrl }]);

    if (!error) {
      setName('');
      setImageUrl('');
      fetchPokemon();
    } else {
      alert('Error adding Pokémon. Maybe it already exists?');
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, [sortAsc]); // ✅ Fetch on sort change

  useEffect(() => {
    pokemonList.forEach((pokemon) => {
      fetchReviews(pokemon.id);
    });
  }, [pokemonList]);

  const handleDeleteReview = (pokemonId, reviewId) => {
    setReviews((prevReviews) => ({
      ...prevReviews,
      [pokemonId]: prevReviews[pokemonId].filter((review) => review.id !== reviewId)
    }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Add a Pokémon</h1>

      <div className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Pokémon name (e.g., bulbasaur)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={handleAddPokemon}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Pokémon
        </button>
      </div>

      {/* ✅ Sort Button */}
      <button
        onClick={() => setSortAsc((prev) => !prev)}
        className="mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Sort {sortAsc ? 'A-Z' : 'Z-A'}
      </button>

      <h2 className="text-2xl font-semibold mb-2">Pokémon List</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {pokemonList.map((p) => (
          <div key={p.id} className="border rounded p-4 text-center hover:shadow-lg">
            <Link href={`/pokemon/${p.id}`}>
              <img src={p.image_url} alt={p.name} className="w-24 h-24 mx-auto" />
              <p className="capitalize mt-2 font-medium">{p.name}</p>
            </Link>

            <Link
              href={`/activity/pokemon/${p.id}`}
              className="inline-block mt-2 text-sm text-blue-600 hover:underline"
            >
              Reviews
            </Link>

            <div className="mt-4">
              {reviews[p.id] && reviews[p.id].map((review) => (
                <PokemonReviewCard
                  key={review.id}
                  review={review}
                  onDelete={(reviewId) => handleDeleteReview(p.id, reviewId)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
