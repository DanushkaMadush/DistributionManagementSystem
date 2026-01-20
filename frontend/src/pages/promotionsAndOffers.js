import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Promotions() {
  const navigate = useNavigate();

  const promotions = [
    {
      id: 1,
      title: '10% Off on Orders Above LKR 5,000',
      description: 'Get 10% discount on all orders above LKR 5,000. Valid only on 20th January 2026.',
      type: 'Discount',
      validUntil: '2026-01-20',
      badge: 'Hot Deal'
    },
    {
      id: 2,
      title: 'Buy 5 Highland Yoghurts, Get 1 Free',
      description: 'Purchase 5 Highland yoghurt cups and receive 1 additional cup absolutely free!',
      type: 'Buy & Get',
      validUntil: '2026-01-31',
      badge: 'Popular'
    },
    {
      id: 3,
      title: 'Free Delivery on Orders Over LKR 3,000',
      description: 'No delivery charges for orders exceeding LKR 3,000. Limited time offer!',
      type: 'Free Delivery',
      validUntil: '2026-02-15',
      badge: 'New'
    },
    {
      id: 4,
      title: '15% Off on Fresh Vegetables',
      description: 'Get 15% discount on all fresh vegetables. Stock up your kitchen today!',
      type: 'Discount',
      validUntil: '2026-01-25',
      badge: 'Fresh'
    },
    {
      id: 5,
      title: 'Buy 3 Anchor Milk Packets, Get 20% Off',
      description: 'Purchase 3 Anchor milk packets and enjoy 20% discount on your total.',
      type: 'Discount',
      validUntil: '2026-02-10',
      badge: 'Limited'
    },
    {
      id: 6,
      title: 'Weekend Special: 25% Off on Beverages',
      description: 'Enjoy 25% off on all beverages during weekends (Saturday & Sunday).',
      type: 'Discount',
      validUntil: '2026-01-28',
      badge: 'Weekend'
    },
    {
      id: 7,
      title: 'Combo Offer: Rice + Dhal at LKR 1,200',
      description: 'Get 5kg rice and 1kg dhal together for just LKR 1,200. Save LKR 300!',
      type: 'Combo',
      validUntil: '2026-02-05',
      badge: 'Combo'
    },
    {
      id: 8,
      title: 'First Order Discount: 10% Off',
      description: 'New customers get 10% off on their first order. Use code: WELCOME10',
      type: 'Discount',
      validUntil: '2026-03-31',
      badge: 'New User'
    },
    {
      id: 9,
      title: 'Buy 2 Bread Loaves, Get 1 Free',
      description: 'Purchase 2 bread loaves and receive an additional loaf for free!',
      type: 'Buy & Get',
      validUntil: '2026-01-30',
      badge: 'Popular'
    },
    {
      id: 10,
      title: 'Loyalty Rewards: Earn Points on Every Purchase',
      description: 'Earn 10 points for every LKR 100 spent. Redeem for discounts!',
      type: 'Loyalty',
      validUntil: 'Ongoing',
      badge: 'Rewards'
    },
    {
      id: 11,
      title: 'Flash Sale: 30% Off on Snacks',
      description: 'Limited 2-hour flash sale! Get 30% off on all snacks. Hurry!',
      type: 'Flash Sale',
      validUntil: '2026-01-21',
      badge: 'Flash'
    }
  ];

  const getBadgeColor = (badge) => {
    const colorMap = {
      'Hot Deal': 'danger',
      'Popular': 'success',
      'New': 'primary',
      'Fresh': 'info',
      'Limited': 'warning',
      'Weekend': 'secondary',
      'Combo': 'dark',
      'New User': 'primary',
      'Rewards': 'success',
      'Flash': 'danger'
    };
    return colorMap[badge] || 'secondary';
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className="bi bi-gift me-2"></i>
          Promotions & Offers
        </h3>
        <button className="btn btn-outline-primary" onClick={() => navigate('/products')}>
          <i className="bi bi-cart me-2"></i>
          Shop Now
        </button>
      </div>

      <div className="alert alert-info mb-4" role="alert">
        <i className="bi bi-info-circle me-2"></i>
        Don't miss out on these amazing deals! Valid for a limited time only.
      </div>

      <div className="row g-3">
        {promotions.map((promo) => (
          <div key={promo.id} className="col-12 col-md-6 col-lg-4">
            <div className="card border border-dark h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <span className="fw-bold text-truncate" style={{ maxWidth: '70%' }}>
                  {promo.type}
                </span>
                <span className={`badge bg-${getBadgeColor(promo.badge)}`}>
                  {promo.badge}
                </span>
              </div>
              <div className="card-body">
                <h5 className="card-title">{promo.title}</h5>
                <p className="card-text">{promo.description}</p>
              </div>
              <div className="card-footer bg-light">
                <small className="text-muted">
                  <i className="bi bi-calendar-event me-1"></i>
                  Valid until: {promo.validUntil}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button className="btn btn-secondary" onClick={() => navigate('/home')}>
          <i className="bi bi-arrow-left me-2"></i>
          Back to Home
        </button>
      </div>
    </div>
  );
}