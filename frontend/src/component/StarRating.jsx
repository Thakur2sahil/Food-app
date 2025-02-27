import React from 'react';

const StarRating = ({ rating, onRatingChange }) => {
  const handleStarClick = (star) => {
    onRatingChange(star);
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= Math.floor(rating); // Full stars
        const isHalfFilled = star === Math.ceil(rating) && rating % 1 !== 0; // Half star

        return (
          <div
            key={star}
            className="relative mx-1 cursor-pointer text-gray-400"
            style={{
              width: '24px',
              height: '24px',
            }}
            onClick={() => handleStarClick(star)}
          >
            <span
              className="block w-full h-full leading-none"
              style={{ color: isFilled ? 'yellow' : isHalfFilled ? 'yellow' : 'gray' }}
            >
              {isFilled ? '★' : isHalfFilled ? '★' : '☆'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
