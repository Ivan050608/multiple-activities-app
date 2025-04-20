'use client'
import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/lib/supabaseClient'
import { supabase } from '@/lib/supabaseClient'
import '../styles/ReviewForm.css'

const ReviewForm = ({ food_id }) => {
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('food_reviews')
        .select('id, review_text, rating, user_id, created_at')
        .eq('food_id', food_id)

      if (error) {
        console.error('Error fetching reviews:', error)
      } else {
        setReviews(data)  // Set the reviews only once after fetching them
      }
    }

    fetchReviews()
  }, [food_id])  // Depend on food_id, so it fetches reviews specific to that food item

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (reviewText === '' || rating === 0) {
      setErrorMessage('Please provide both a review and a rating.')
      return
    }

    const user = await getCurrentUser()

    if (!user) {
      setErrorMessage('User not authenticated.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const { data, error } = await supabase
        .from('food_reviews')
        .insert([ 
          {
            food_id: food_id,
            user_id: user.id,
            review_text: reviewText,
            rating: rating,
            created_at: new Date().toISOString(),
          },
        ])

      if (error) {
        throw error
      }

      setSuccessMessage('Review submitted successfully!')
      setReviewText('')
      setRating(0)

      setReviews((prevReviews) => [
        ...prevReviews,
        {
          review_text: reviewText,
          rating,
          user_id: user.id,
          created_at: new Date().toISOString(),
        },
      ])

    } catch (error) {
      setErrorMessage('Error adding review: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return

    const { error } = await supabase
      .from('food_reviews')
      .delete()
      .eq('id', reviewId)

    if (error) {
      console.error('Error deleting review:', error)
      setErrorMessage('Error deleting review: ' + error.message)
    } else {
      // After deleting, remove the review from the state directly
      setReviews(reviews.filter((review) => review.id !== reviewId))
      setSuccessMessage('Review deleted successfully!')
    }
  }

  return (
    <div className="review-form-container">
      <form onSubmit={handleSubmit} className="review-form">
        <h2 className="form-title">Leave a Review</h2>

        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here"
          required
          className="review-textarea"
        />

        <div className="rating-container">
          <label htmlFor="rating" className="rating-label">Rating:</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            min="1"
            max="5"
            required
            className="rating-input"
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      <div className="review-list">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={review.id || index} className="review-item">
              <div className="review-content">
                <p>{review.review_text}</p>
                <div className="review-rating">
                  Rating: {review.rating}
                </div>
                <div className="review-date">
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => deleteReview(review.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  )
}

export default ReviewForm