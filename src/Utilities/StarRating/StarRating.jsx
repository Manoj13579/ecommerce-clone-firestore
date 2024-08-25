import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa'; // Assuming you use Font Awesome icons

const StarRating = ({ rating }) => {
  const stars = [1, 2, 3, 4, 5]; // Total number of stars

  return (
    <div>
      {stars.map((star, index) => (
        <span key={index}>
          {star <= rating ? (
            <FaStar color="#ffc107" />
          ) : (
            <FaRegStar color="#ffc107" />
          )}
        </span>
      ))}
    </div>
  );
};

export default StarRating;