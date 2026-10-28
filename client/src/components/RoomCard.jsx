import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const fallbackImg = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80';
  const displayImage = (room.images && room.images.length > 0) ? room.images[0] : fallbackImg;

  return (
    <div className="card h-100 room-card shadow-sm border-0">
      <div className="room-image-wrapper">
        <img
          src={displayImage}
          alt={room.title}
          onError={(e) => { e.target.src = fallbackImg; }}
        />
        <span className="price-tag">
          ${room.pricePerNight} <span className="small fw-normal text-light">/ night</span>
        </span>
      </div>

      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge badge-luxury">{room.type}</span>
          <span className="text-warning small fw-bold">
            <i className="bi bi-star-fill me-1"></i>{room.rating || 4.8}
          </span>
        </div>

        <h5 className="card-title fw-bold text-dark mb-2">{room.title}</h5>
        <p className="card-text text-muted small flex-grow-1 mb-3 line-clamp-2">
          {room.description}
        </p>

        <div className="d-flex flex-wrap gap-2 py-2 border-top border-bottom my-2 text-secondary small">
          <span><i className="bi bi-people me-1 text-primary"></i>{room.capacity} Guests</span>
          <span>•</span>
          <span><i className="bi bi-door-closed me-1 text-primary"></i>Room #{room.roomNumber}</span>
          <span>•</span>
          <span><i className="bi bi-aspect-ratio me-1 text-primary"></i>{room.sizeSqFt || 350} sq ft</span>
        </div>

        <div className="mt-3">
          <Link to={`/rooms/${room._id}`} className="btn btn-outline-dark w-100 fw-semibold">
            View Details & Book <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
