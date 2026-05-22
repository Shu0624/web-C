import React, { useEffect, useRef, useState } from 'react';
import cornerDecor from './assets/invitation_corner_decor.png';
import bottomDecor from './assets/invitation_bottom_decor.png';
import './InvitationCard.css';

function InvitationCard() {
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Parse guest name from URL: #/invitation?name=Dr. Rajesh Kumar
  const getGuestName = () => {
    const hash = window.location.hash;
    const queryStart = hash.indexOf('?');
    if (queryStart === -1) return '';
    const params = new URLSearchParams(hash.substring(queryStart));
    return params.get('name') || '';
  };

  const guestName = getGuestName();

  // Link generator state
  const [linkGenName, setLinkGenName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  // Animated star-field background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.8 + 0.3,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.02;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 180, 255, ${currentOpacity})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${currentOpacity * 0.1})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 200);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleDownload = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CODECRAFT 2026 - Invitation',
          text: 'You are cordially invited to CODECRAFT 2026 — The Next Wave of Innovation! 29th May 2026 at CSMSS Chh. Shahu College of Engineering.',
          url: window.location.origin + '/#/invitation',
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + '/#/invitation');
      alert('Link copied to clipboard!');
    }
  };

  const handleGenerateLink = () => {
    if (!linkGenName.trim()) return;
    const encoded = encodeURIComponent(linkGenName.trim());
    const link = `${window.location.origin}/#/invitation?name=${encoded}`;
    setGeneratedLink(link);
    setLinkCopied(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="invitation-page">
      <canvas ref={canvasRef} className="invitation-particles" />

      {/* Ambient glow orbs */}
      <div className="invitation-orb invitation-orb-1" />
      <div className="invitation-orb invitation-orb-2" />
      <div className="invitation-orb invitation-orb-3" />

      {/* Back button */}
      <a href="/" className="invitation-back-btn syncopate">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        BACK
      </a>

      <div className={`invitation-card-wrapper ${isVisible ? 'visible' : ''}`}>
        {/* Outer decorative border */}
        <div className="invitation-outer-frame">
          {/* Gold corner accents */}
          <div className="corner-accent corner-tl" />
          <div className="corner-accent corner-tr" />
          <div className="corner-accent corner-bl" />
          <div className="corner-accent corner-br" />

          {/* Inner card */}
          <div className="invitation-inner-card">
            {/* Botanical decorations */}
            <img src={cornerDecor} alt="" className="decor-top-right" />
            <img src={bottomDecor} alt="" className="decor-bottom-left" />
            {/* Decorative top line */}
            <div className="invitation-top-flourish">
              <div className="flourish-line" />
              <div className="flourish-diamond" />
              <div className="flourish-line" />
            </div>

            {/* Header */}
            <div className="invitation-header">
              <span className="invitation-label syncopate">YOU ARE CORDIALLY INVITED TO</span>
              <h1 className="invitation-title syncopate">INVITATION</h1>
              <div className="invitation-title-underline" />
            </div>

            {/* Event Details - Left aligned like reference */}
            <div className="invitation-details-section">
              <div className="invitation-address-row">
                <div className="invitation-address">
                  <p className="address-name">CSMSS Chh. Shahu College of Engineering</p>
                  <p className="address-line">Department of Computer Science & Engineering</p>
                  <p className="address-line">Chh. Sambhajinagar, Maharashtra</p>
                </div>
                <div className="invitation-date syncopate">
                  May 29, 2026
                </div>
              </div>
            </div>

            {/* Greeting */}
            <div className="invitation-greeting">
              <p className="greeting-text">{guestName ? `Dear ${guestName},` : 'Dear Esteemed Guest,'}</p>
            </div>

            {/* Body */}
            <div className="invitation-body">
              <p>
                We are honored to invite you to <strong>CODECRAFT 2026 — The Next Wave of Innovation</strong>, a premier technical fest organized by the Department of Computer Science & Engineering at CSMSS Chh. Shahu College of Engineering.
              </p>
              <p>
                This flagship event brings together the brightest minds to compete, collaborate, and create across multiple domains including competitive coding, blind coding, startup pitching, filmmaking for sustainable development, strategic chess, and box cricket.
              </p>
              <p>
                Join us for a day of innovation, learning, and excitement as we celebrate the spirit of technology and creative problem-solving.
              </p>
            </div>

            {/* Event Highlights */}
            <div className="invitation-highlights">
              <div className="highlight-item">
                <div className="highlight-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="highlight-text">
                  <span className="highlight-label">DATE</span>
                  <span className="highlight-value syncopate">29TH MAY 2026</span>
                </div>
              </div>
              <div className="highlight-item">
                <div className="highlight-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="highlight-text">
                  <span className="highlight-label">TIME</span>
                  <span className="highlight-value syncopate">10 AM ONWARDS</span>
                </div>
              </div>
              <div className="highlight-item">
                <div className="highlight-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="highlight-text">
                  <span className="highlight-label">VENUE</span>
                  <span className="highlight-value syncopate">CSMSS CSE DEPT.</span>
                </div>
              </div>
            </div>

            {/* Closing */}
            <div className="invitation-closing">
              <p className="closing-regards">Best Regards,</p>
              <p className="closing-signature">Dr. S. P. Abhang</p>
              <p className="closing-role">Head of Department</p>
              <p className="closing-dept">Computer Science & Engineering</p>
            </div>

            {/* Bottom flourish */}
            <div className="invitation-bottom-flourish">
              <div className="flourish-line" />
              <div className="flourish-diamond" />
              <div className="flourish-line" />
            </div>

            {/* Website link */}
            <div className="invitation-footer-link">
              <span className="syncopate">csecodecraft26.site</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className={`invitation-actions ${isVisible ? 'visible' : ''}`}>
        <button className="inv-action-btn syncopate" onClick={handleDownload}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          PRINT
        </button>
        <button className="inv-action-btn syncopate" onClick={handleShare}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          SHARE
        </button>
      </div>

      {/* Link Generator Panel */}
      {!guestName && (
        <div className={`link-generator-panel ${isVisible ? 'visible' : ''}`}>
          <h3 className="link-gen-title syncopate">GENERATE PERSONALIZED LINKS</h3>
          <p className="link-gen-desc">Type a guest's name to create their unique invitation link</p>
          <div className="link-gen-input-row">
            <input
              type="text"
              className="link-gen-input"
              placeholder="e.g. Prof. N. Z. Patel"
              value={linkGenName}
              onChange={(e) => setLinkGenName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateLink()}
            />
            <button className="link-gen-btn syncopate" onClick={handleGenerateLink}>
              GENERATE
            </button>
          </div>
          {generatedLink && (
            <div className="link-gen-result">
              <code className="link-gen-url">{generatedLink}</code>
              <button className="link-gen-copy syncopate" onClick={handleCopyLink}>
                {linkCopied ? '✓ COPIED!' : 'COPY'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InvitationCard;
