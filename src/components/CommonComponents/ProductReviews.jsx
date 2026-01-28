import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

export default function ProductReviews() {
  const { id: productId } = useParams(); // Product ID from URL
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/ratings/product/${productId}`
        );
        const json = await res.json();

        if (json.success) {
          setReviews(json.data.ratings || []);
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) return <p className="mt-6">Loading reviews...</p>;

  return (
    <div className="mt-10 space-y-6">
      <h2 className="text-xl font-semibold tracking-widest">
        Customer Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            className="border rounded-lg p-4 space-y-3"
          >
            {/* ⭐ Rating */}
            <StarRating rating={review.rating} />

            {/* 📝 Title */}
            <p className="font-semibold">{review.title}</p>

            {/* 📄 Review text */}
            <p>{review.review}</p>

            {/* 🖼 Review Images */}
            {review.images?.length > 0 && (
              <div className="flex gap-3 mt-2 flex-wrap">
                {review.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.imageUrl}
                    alt="review"
                    className="w-24 h-24 object-cover rounded-lg border shadow-sm"
                  />
                ))}
              </div>
            )}

            {/* 👤 User */}
            <p className="text-sm text-gray-500">
              By {review.user?.name || review.userName || "Customer"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

/* ⭐ Simple Star Rating UI */
function StarRating({ rating }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= rating ? "text-yellow-400 text-lg" : "text-gray-300 text-lg"}
        >
          ★
        </span>
      ))}
    </div>
  );
}
