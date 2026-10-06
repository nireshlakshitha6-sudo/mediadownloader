'use client';

/**
 * PremiumTab Component
 * Pricing Plans with Direct WhatsApp Pre-Generated Messages (+94724074632)
 */
export default function PremiumTab() {
  const plans = [
    {
      id: '1-month',
      name: '1 Month Plan',
      price: '1,000',
      period: '/ 30 Days',
      badge: 'Starter',
      isFeatured: false,
      whatsappMsg: 'Hello VEROX MEDIA, I want to purchase the 1 Month Premium Package.',
      features: [
        'Unlock 1080p Full HD Video',
        'Unlock 320kbps MP3 Audio',
        'TikTok No Watermark Downloads',
        'High-Speed Turbo Bandwidth'
      ]
    },
    {
      id: '2-months',
      name: '2 Months Plan',
      price: '1,500',
      period: '/ 60 Days',
      badge: '🔥 MOST POPULAR',
      isFeatured: true,
      whatsappMsg: 'Hello VEROX MEDIA, I want to purchase the 2 Months Premium Package.',
      features: [
        'Unlock 4K Ultra HD & 1080p 60FPS',
        'Studio Master 320kbps & WAV Lossless',
        'Multi-Connection Chunk Accelerator',
        'Priority VIP Server Cluster',
        '24/7 Dedicated WhatsApp Support'
      ]
    },
    {
      id: 'lifetime',
      name: 'Lifetime Plan',
      price: '2,500',
      period: '/ Permanent',
      badge: '👑 BEST VALUE',
      isFeatured: false,
      whatsappMsg: 'Hello VEROX MEDIA, I want to purchase the Lifetime Premium Package.',
      features: [
        'Unlimited Lifetime VIP Access',
        'All Future Platform Updates Included',
        'Maximum Gigabit Server Speeds',
        'Instant KeyAuth VIP Account Delivery',
        'Never Pay Again'
      ]
    }
  ];

  return (
    <div className="premium-view-container">
      <div className="pricing-header">
        <div className="pricing-tag">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <span>VIP SUBSCRIPTION PACKAGES</span>
        </div>
        <h2 className="pricing-title">
          Upgrade to <span>VEROX PREMIUM</span>
        </h2>
        <p className="pricing-sub">
          Unlock unrestricted 4K Ultra HD video, 1080p 60FPS, 320kbps Studio Audio, and turbo-accelerated download nodes.
        </p>
      </div>

      <div className="pricing-cards-grid">
        {plans.map((plan) => (
          <div key={plan.id} className={`pricing-card ${plan.isFeatured ? 'featured' : ''}`}>
            {plan.isFeatured && <div className="featured-ribbon">{plan.badge}</div>}
            {!plan.isFeatured && plan.id === 'lifetime' && (
              <div className="featured-ribbon lifetime-ribbon">{plan.badge}</div>
            )}

            <div>
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price-wrap">
                <span className="plan-currency">LKR</span>
                <span className="plan-amount">{plan.price}</span>
                <span className="plan-period">{plan.period}</span>
              </div>

              <ul className="plan-features-list">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="plan-feature-item">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct WhatsApp Redirection */}
            <a
              href={`https://wa.me/94724074632?text=${encodeURIComponent(plan.whatsappMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-buy"
            >
              <svg viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>Buy Now via WhatsApp</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
