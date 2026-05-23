// NightVibe — Vendor screens (Dashboard, My Services, Account)
// Same dark + neon-purple palette and Bricolage / Inter type.

const VN_BG = '#0B0613';
const VN_SURFACE = 'rgba(26,16,48,0.7)';
const VN_SURFACE_HI = 'rgba(36,21,64,0.85)';
const VN_STROKE = 'rgba(255,255,255,0.08)';
const VN_STROKE_HI = 'rgba(255,255,255,0.14)';
const VN_TEXT = '#F4EEFF';
const VN_TEXT_DIM = 'rgba(244,238,255,0.62)';
const VN_TEXT_MUTE = 'rgba(244,238,255,0.38)';
const VN_PURPLE = '#A855F7';
const VN_PURPLE_DEEP = '#7C3AED';
const VN_PURPLE_SOFT = '#C084FC';
const VN_PINK = '#EC4899';
const VN_GREEN = '#34D399';
const VN_GREEN_SOFT = '#6EE7B7';
const VN_AMBER = '#F59E0B';
const VN_CYAN = '#22D3EE';

// ── Demo vendor data ─────────────────────────────────────────
const DEMO_VENDOR = {
  name: 'SetemiL',
  handle: '@setemil',
  businessName: 'OG',
  vendorType: 'Restaurants',
  description: 'I am a business man.',
  email: 'setemiloye@gmail.com',
  phone: '+1 580 108 1000',
  city: 'Alabama, New York',
  address: 'My shop',
  website: 'hwheh.co.uk',
  socials: { instagram: '@setemil', tiktok: null, twitter: null, facebook: null },
  isVerified: true,
  payouts: { active: true, provider: 'Stripe' },
  avatarCover: 'linear-gradient(160deg, #22D3EE 0%, #7C3AED 50%, #EC4899 100%)',
  avatarEmoji: '🌊',
  businessCover: 'linear-gradient(160deg, #F59E0B 0%, #EC4899 60%, #7C3AED 100%)',
  // Stats
  servicesTotal: 1,
  servicesActive: 1,
  servicesUnavailable: 0,
  avgPrice: 20,
  bookingsThisMonth: 12,
  earningsThisMonth: 240,
  earningsLastMonth: 180,
  rating: 4.9,
  ratingCount: 18,
  categories: [
    { name: 'Pictures', count: 1, color: '#A855F7', emoji: '📷' },
  ],
  services: [
    {
      id: 's1',
      title: 'Photography',
      category: 'Pictures',
      price: 20,
      currency: 'USD',
      duration: '2 hours',
      status: 'available', // 'available' | 'unavailable'
      active: true,
      cover: 'linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)',
      emoji: '📸',
      description: 'Something',
      createdAt: '5/19/2026',
      bookings: 4,
    },
  ],
};

// ── Status bar ───────────────────────────────────────────────
function VNStatusBar() {
  return (
    <div style={{
      height: 54, padding: '14px 28px 0', display: 'flex',
      justifyContent: 'space-between', alignItems: 'center',
      fontFamily: 'Inter, system-ui', fontWeight: 600, fontSize: 16, color: VN_TEXT,
      flexShrink: 0, position: 'relative', zIndex: 30,
    }}>
      <div>9:41</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><path d="M1 8.5h2v3H1v-3zm4-2h2v5H5v-5zm4-2.5h2v7.5H9V4zm4-2.5h2v10h-2v-10zm4-1.5h2v11.5h-2V1.5z" fill={VN_TEXT}/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 2.5a9 9 0 016.4 2.65l1.4-1.4A11 11 0 008 .5a11 11 0 00-7.8 3.25l1.4 1.4A9 9 0 018 2.5zm0 4a5 5 0 013.55 1.47l1.4-1.4a7 7 0 00-9.9 0l1.4 1.4A5 5 0 018 6.5zm0 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill={VN_TEXT}/></svg>
        <div style={{ width: 26, height: 12, border: `1.5px solid ${VN_TEXT}`, borderRadius: 3, position: 'relative', opacity: 0.9 }}>
          <div style={{ position: 'absolute', inset: 1.5, width: '78%', background: VN_TEXT, borderRadius: 1 }}/>
          <div style={{ position: 'absolute', right: -3, top: 3, width: 2, height: 6, background: VN_TEXT, borderRadius: 1 }}/>
        </div>
      </div>
    </div>
  );
}

// ── Tab bar ──────────────────────────────────────────────────
function VNTabBar({ active = 'dashboard' }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> },
    { id: 'services',  label: 'Services',  icon: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg> },
    { id: 'bookings',  label: 'Bookings',  icon: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg> },
    { id: 'chats',     label: 'Chats',     icon: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg> },
    { id: 'account',   label: 'Account',   icon: (c, isActive) => <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive ? c : 'none'} stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg> },
  ];
  return (
    <div style={{
      paddingTop: 10, paddingBottom: 26,
      background: 'linear-gradient(to top, rgba(11,6,19,0.98) 40%, rgba(11,6,19,0))',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      borderTop: `1px solid ${VN_STROKE}`,
      flexShrink: 0, position: 'relative', zIndex: 5,
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        const c = isActive ? VN_PURPLE : VN_TEXT_MUTE;
        return (
          <div key={t.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            {t.icon(c, isActive)}
            <div style={{ fontFamily: 'Inter', fontSize: 10.5, fontWeight: isActive ? 700 : 500, color: c }}>{t.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Header (wordmark + Vendor pill + avatar) ─────────────────
function VNHeader({ v = DEMO_VENDOR }) {
  return (
    <div style={{
      padding: '4px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontFamily: '"Bricolage Grotesque"', fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em',
          background: 'linear-gradient(100deg, #C084FC 0%, #EC4899 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>NightVibe</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 9px', borderRadius: 999,
          background: 'rgba(168,85,247,0.16)', border: '1px solid rgba(192,132,252,0.35)',
          color: VN_PURPLE_SOFT,
          fontFamily: 'Inter', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
          </svg>
          Vendor
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', border: `1px solid ${VN_STROKE}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: VN_TEXT, cursor: 'pointer', position: 'relative',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span style={{
            position: 'absolute', width: 7, height: 7, borderRadius: '50%',
            background: VN_PINK, transform: 'translate(9px, -9px)',
            boxShadow: `0 0 0 2px ${VN_BG}`,
          }}/>
        </div>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: v.avatarCover,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          border: `1.5px solid ${VN_STROKE_HI}`,
          cursor: 'pointer',
        }}>{v.avatarEmoji}</div>
      </div>
    </div>
  );
}

// ── Section title (purple kicker) ────────────────────────────
function VNSectionTitle({ children, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12,
    }}>
      <div style={{
        fontFamily: '"Bricolage Grotesque"', fontWeight: 800, fontSize: 18, color: VN_TEXT,
        letterSpacing: '-0.02em',
      }}>{children}</div>
      {action && (
        <span style={{
          fontFamily: 'Inter', fontSize: 11.5, fontWeight: 700, color: VN_PURPLE_SOFT,
          cursor: 'pointer',
        }}>{action}</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 1 — DASHBOARD
// ─────────────────────────────────────────────────────────────
function VendorDashboard({ v = DEMO_VENDOR }) {
  const earningsDelta = v.earningsThisMonth - v.earningsLastMonth;
  const earningsPct = Math.round((earningsDelta / v.earningsLastMonth) * 100);

  return (
    <div style={{
      width: '100%', height: '100%', background: VN_BG, position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* aurora */}
      <div style={{
        position: 'absolute', top: -120, left: '50%', width: 480, height: 320,
        transform: 'translateX(-50%)', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.3), transparent 70%)',
        filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none',
      }}/>
      <VNStatusBar/>
      <VNHeader v={v}/>

      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 2 }}>
        {/* Greeting */}
        <div style={{ padding: '0 18px 18px' }}>
          <div style={{
            fontFamily: 'Inter', fontSize: 12, color: VN_TEXT_DIM, fontWeight: 500,
            marginBottom: 4, letterSpacing: '0.01em',
          }}>Good evening</div>
          <div style={{
            fontFamily: '"Bricolage Grotesque"', fontWeight: 900, fontSize: 30, color: VN_TEXT,
            letterSpacing: '-0.035em', lineHeight: 1.05,
          }}>Welcome back, <span style={{
            background: 'linear-gradient(100deg, #C084FC 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>{v.name}</span></div>
        </div>

        {/* Earnings hero card */}
        <div style={{ padding: '0 18px 14px' }}>
          <div style={{
            position: 'relative', borderRadius: 20, overflow: 'hidden', padding: '16px 18px 18px',
            background: 'linear-gradient(140deg, #1A1030 0%, #2A1654 55%, #4B1A6E 100%)',
            border: `1px solid ${VN_STROKE_HI}`,
            boxShadow: '0 24px 60px -20px rgba(124,58,237,0.55)',
          }}>
            {/* color blobs */}
            <div style={{
              position: 'absolute', right: -60, top: -60, width: 220, height: 220, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(236,72,153,0.55), transparent 70%)',
            }}/>
            <div style={{
              position: 'absolute', left: -40, bottom: -60, width: 200, height: 200, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(34,211,238,0.3), transparent 70%)',
            }}/>
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.06,
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}/>

            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  fontFamily: 'Inter', fontSize: 10, fontWeight: 700,
                  color: 'rgba(255,255,255,0.7)', letterSpacing: '0.14em', textTransform: 'uppercase',
                }}>EARNINGS · THIS MONTH</div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '3px 8px', borderRadius: 999,
                  background: 'rgba(52,211,153,0.18)',
                  border: '1px solid rgba(52,211,153,0.35)',
                  color: VN_GREEN_SOFT,
                  fontFamily: 'Inter', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
                  {earningsPct}%
                </div>
              </div>
              <div style={{
                marginTop: 6, fontFamily: '"Bricolage Grotesque"', fontWeight: 900, fontSize: 44,
                color: '#fff', letterSpacing: '-0.04em', lineHeight: 1,
              }}>
                ${v.earningsThisMonth.toLocaleString()}
                <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.6)', fontWeight: 700, marginLeft: 4 }}>.00</span>
              </div>
              <div style={{
                marginTop: 6, fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500,
              }}>
                +${earningsDelta} vs. last month
              </div>

              {/* Sparkline */}
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'flex-end', gap: 3, height: 28 }}>
                {[24, 32, 18, 40, 22, 36, 28, 44, 30, 38, 50, 46].map((h, i) => (
                  <div key={i} style={{
                    flex: 1, height: `${h}%`, borderRadius: 2,
                    background: i > 8 ? 'linear-gradient(180deg, #EC4899, #A855F7)' : 'rgba(255,255,255,0.18)',
                    boxShadow: i > 8 ? '0 0 8px rgba(236,72,153,0.5)' : 'none',
                  }}/>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid 2x2 */}
        <div style={{ padding: '0 18px 18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <VNStat
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>}
              accent={VN_PURPLE_SOFT}
              label="Total services"
              value={v.servicesTotal}
              sub={`${v.servicesActive} active`}
            />
            <VNStat
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>}
              accent={VN_PINK}
              label="Bookings"
              value={v.bookingsThisMonth}
              sub="this month"
            />
            <VNStat
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5 12 2"/></svg>}
              accent={VN_AMBER}
              label="Rating"
              value={v.rating}
              sub={`${v.ratingCount} reviews`}
            />
            <VNStat
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
              accent={VN_GREEN}
              label="Avg. price"
              value={`$${v.avgPrice}`}
              sub="per service"
            />
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ padding: '0 18px 18px' }}>
          <VNSectionTitle>Quick actions</VNSectionTitle>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              flex: 1, height: 44, padding: '0 14px', border: 'none', cursor: 'pointer', borderRadius: 12,
              background: 'linear-gradient(100deg, #A855F7 0%, #7C3AED 50%, #EC4899 100%)',
              color: '#fff', fontFamily: '"Bricolage Grotesque"', fontWeight: 800, fontSize: 13,
              letterSpacing: '-0.01em',
              boxShadow: '0 10px 28px rgba(168,85,247,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              New service
            </button>
            <button style={{
              flex: 1, height: 44, padding: '0 14px', cursor: 'pointer', borderRadius: 12,
              background: 'rgba(255,255,255,0.05)', border: `1px solid ${VN_STROKE_HI}`,
              color: VN_TEXT, fontFamily: '"Bricolage Grotesque"', fontWeight: 700, fontSize: 13,
              letterSpacing: '-0.01em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
              View payouts
            </button>
          </div>
        </div>

        {/* Categories */}
        <div style={{ padding: '0 18px 18px' }}>
          <VNSectionTitle action="Manage">By category</VNSectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {v.categories.map(c => (
              <div key={c.name} style={{
                padding: '12px 14px', borderRadius: 14,
                background: VN_SURFACE, border: `1px solid ${VN_STROKE}`,
                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: `linear-gradient(135deg, ${c.color}33, ${c.color}11)`,
                  border: `1px solid ${c.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>{c.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: '"Bricolage Grotesque"', fontWeight: 700, fontSize: 14, color: VN_TEXT,
                    letterSpacing: '-0.01em',
                  }}>{c.name}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 11, color: VN_TEXT_DIM, marginTop: 2, fontWeight: 500 }}>
                    {c.count} service · ${v.avgPrice} avg.
                  </div>
                </div>
                <div style={{
                  padding: '3px 9px', borderRadius: 999,
                  background: `${c.color}22`, border: `1px solid ${c.color}44`,
                  color: c.color,
                  fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                }}>{c.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent services */}
        <div style={{ padding: '0 18px 24px' }}>
          <VNSectionTitle action="See all">Recent services</VNSectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {v.services.map(s => <VNRecentServiceRow key={s.id} s={s}/>)}
          </div>
        </div>
      </div>

      <VNTabBar active="dashboard"/>
    </div>
  );
}

function VNStat({ icon, accent, label, value, sub }) {
  return (
    <div style={{
      padding: 12, borderRadius: 14,
      background: VN_SURFACE, border: `1px solid ${VN_STROKE}`,
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: `${accent}22`, border: `1px solid ${accent}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accent,
        }}>{icon}</div>
        <div style={{
          fontFamily: '"Bricolage Grotesque"', fontWeight: 800, fontSize: 22, color: VN_TEXT,
          letterSpacing: '-0.02em', lineHeight: 1,
        }}>{value}</div>
      </div>
      <div style={{
        marginTop: 8, fontFamily: 'Inter', fontSize: 11.5, color: VN_TEXT, fontWeight: 600,
      }}>{label}</div>
      <div style={{
        marginTop: 2, fontFamily: 'Inter', fontSize: 10.5, color: VN_TEXT_MUTE, fontWeight: 500,
      }}>{sub}</div>
    </div>
  );
}

function VNRecentServiceRow({ s }) {
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12,
      background: VN_SURFACE, border: `1px solid ${VN_STROKE}`, cursor: 'pointer',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 12, flexShrink: 0,
        background: s.cover, position: 'relative', overflow: 'hidden',
        border: `1px solid ${VN_STROKE_HI}`,
      }}>
        <div style={{
          position: 'absolute', right: -6, bottom: -10, fontSize: 38, opacity: 0.45,
          transform: 'rotate(-8deg)',
        }}>{s.emoji}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"Bricolage Grotesque"', fontWeight: 700, fontSize: 14.5, color: VN_TEXT,
          letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{s.title}</div>
        <div style={{
          fontFamily: 'Inter', fontSize: 11.5, color: VN_TEXT_DIM, marginTop: 3, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span>{s.category}</span>
          <span style={{ width: 2.5, height: 2.5, borderRadius: '50%', background: VN_TEXT_MUTE }}/>
          <span style={{ color: VN_PURPLE_SOFT, fontWeight: 700 }}>${s.price}</span>
          <span style={{ width: 2.5, height: 2.5, borderRadius: '50%', background: VN_TEXT_MUTE }}/>
          <span>{s.bookings} bookings</span>
        </div>
      </div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
        padding: '4px 9px', borderRadius: 999,
        background: s.status === 'available' ? 'rgba(52,211,153,0.16)' : 'rgba(244,238,255,0.06)',
        color: s.status === 'available' ? VN_GREEN_SOFT : VN_TEXT_MUTE,
        fontFamily: 'Inter', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: s.status === 'available' ? VN_GREEN : VN_TEXT_MUTE,
          boxShadow: s.status === 'available' ? '0 0 8px rgba(52,211,153,0.6)' : 'none',
        }}/>
        {s.status}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 2 — MY SERVICES
// ─────────────────────────────────────────────────────────────
function VendorServices({ v = DEMO_VENDOR }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: VN_BG, position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <VNStatusBar/>
      <VNHeader v={v}/>

      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {/* Title */}
        <div style={{
          padding: '0 18px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: '"Bricolage Grotesque"', fontWeight: 900, fontSize: 30, color: VN_TEXT,
              letterSpacing: '-0.035em', lineHeight: 1,
            }}>My services</div>
            <div style={{
              fontFamily: 'Inter', fontSize: 12, color: VN_TEXT_DIM, marginTop: 4, fontWeight: 500,
            }}>{v.servicesTotal} service · {v.servicesActive} active</div>
          </div>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 40, padding: '0 14px', border: 'none', cursor: 'pointer', borderRadius: 12,
            background: 'linear-gradient(100deg, #A855F7 0%, #7C3AED 50%, #EC4899 100%)',
            color: '#fff', fontFamily: '"Bricolage Grotesque"', fontWeight: 800, fontSize: 13,
            letterSpacing: '-0.01em',
            boxShadow: '0 10px 28px rgba(168,85,247,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            New
          </button>
        </div>

        {/* Filters */}
        <div style={{ padding: '0 18px 18px', display: 'flex', gap: 8 }}>
          {[
            { id: 'all', label: 'All', n: v.servicesTotal },
            { id: 'active', label: 'Active', n: v.servicesActive },
            { id: 'unavailable', label: 'Unavailable', n: v.servicesUnavailable },
          ].map((t, i) => {
            const on = i === 0;
            return (
              <div key={t.id} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 12px', borderRadius: 999, cursor: 'pointer',
                background: on ? 'rgba(168,85,247,0.18)' : 'rgba(255,255,255,0.04)',
                border: on ? '1px solid rgba(192,132,252,0.4)' : `1px solid ${VN_STROKE}`,
              }}>
                <span style={{
                  fontFamily: 'Inter', fontSize: 12, fontWeight: 700,
                  color: on ? VN_PURPLE_SOFT : VN_TEXT_DIM, letterSpacing: '0.02em',
                }}>{t.label}</span>
                <span style={{
                  padding: '1px 6px', borderRadius: 999,
                  background: on ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.06)',
                  fontFamily: 'Inter', fontSize: 10, fontWeight: 700,
                  color: on ? VN_PURPLE_SOFT : VN_TEXT_MUTE,
                }}>{t.n}</span>
              </div>
            );
          })}
        </div>

        {/* Service cards */}
        <div style={{ padding: '0 18px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {v.services.map(s => <VNServiceCard key={s.id} s={s}/>)}
        </div>
      </div>

      <VNTabBar active="services"/>
    </div>
  );
}

function VNServiceCard({ s }) {
  return (
    <div style={{
      borderRadius: 18, overflow: 'hidden',
      background: VN_SURFACE, border: `1px solid ${VN_STROKE_HI}`,
      boxShadow: '0 16px 36px -18px rgba(124,58,237,0.4)',
    }}>
      {/* Cover with overlay */}
      <div style={{ position: 'relative', height: 132, background: s.cover, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', right: -12, top: -8, fontSize: 140, opacity: 0.3,
          transform: 'rotate(-12deg)',
        }}>{s.emoji}</div>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(120% 80% at 100% 0%, rgba(255,255,255,0.2), transparent 50%), linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }}/>

        {/* Top row: status + price */}
        <div style={{
          position: 'absolute', top: 10, left: 10, right: 10,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 9px', borderRadius: 999,
            background: 'rgba(52,211,153,0.22)', border: '1px solid rgba(52,211,153,0.4)', backdropFilter: 'blur(8px)',
            color: VN_GREEN_SOFT,
            fontFamily: 'Inter', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: VN_GREEN, boxShadow: '0 0 8px rgba(52,211,153,0.6)' }}/>
            Active
          </span>
          <span style={{
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)',
            fontFamily: '"Bricolage Grotesque"', fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: '-0.01em',
          }}>${s.price}</span>
        </div>

        {/* Bottom: title */}
        <div style={{ position: 'absolute', left: 14, right: 14, bottom: 12 }}>
          <div style={{
            fontFamily: '"Bricolage Grotesque"', fontWeight: 900, fontSize: 24, color: '#fff',
            letterSpacing: '-0.03em', lineHeight: 1.05, textShadow: '0 2px 14px rgba(0,0,0,0.4)',
          }}>{s.title}</div>
          <div style={{
            marginTop: 4, fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 600,
          }}>{s.category}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 14px 14px' }}>
        {/* meta row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          fontFamily: 'Inter', fontSize: 12, color: VN_TEXT_DIM, fontWeight: 500,
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={VN_PURPLE_SOFT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
            </svg>
            {s.duration}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={VN_PURPLE_SOFT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>
            </svg>
            {s.bookings} booked
          </span>
        </div>

        {/* description */}
        <div style={{
          marginTop: 10, fontFamily: 'Inter', fontSize: 13, color: VN_TEXT, fontWeight: 500, lineHeight: 1.45,
        }}>{s.description}</div>

        {/* actions */}
        <div style={{
          marginTop: 14, paddingTop: 12, borderTop: `1px solid ${VN_STROKE}`,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <button style={{
            flex: 1, height: 38, padding: '0 12px', border: 'none', cursor: 'pointer', borderRadius: 10,
            background: 'rgba(168,85,247,0.16)', border: '1px solid rgba(192,132,252,0.3)',
            color: VN_PURPLE_SOFT, fontFamily: 'Inter', fontSize: 12, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4z"/>
            </svg>
            Edit
          </button>
          <button style={{
            height: 38, padding: '0 12px', cursor: 'pointer', borderRadius: 10,
            background: 'rgba(255,255,255,0.05)', border: `1px solid ${VN_STROKE_HI}`,
            color: VN_TEXT_DIM, fontFamily: 'Inter', fontSize: 12, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            Pause
          </button>
          <button style={{
            width: 38, height: 38, cursor: 'pointer', borderRadius: 10,
            background: 'rgba(236,72,153,0.10)', border: '1px solid rgba(236,72,153,0.3)',
            color: VN_PINK,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 3 — ACCOUNT
// ─────────────────────────────────────────────────────────────
function VendorAccount({ v = DEMO_VENDOR }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: VN_BG, position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <VNStatusBar/>
      <VNHeader v={v}/>

      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {/* Profile hero — business card */}
        <div style={{ padding: '0 18px 14px' }}>
          <div style={{
            position: 'relative', borderRadius: 20, overflow: 'hidden',
            border: `1px solid ${VN_STROKE_HI}`,
            boxShadow: '0 22px 50px -22px rgba(124,58,237,0.55)',
          }}>
            {/* Cover header */}
            <div style={{ position: 'relative', height: 96, background: v.businessCover, overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(120% 80% at 100% 0%, rgba(255,255,255,0.22), transparent 50%), linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.45) 100%)',
              }}/>
              <div style={{
                position: 'absolute', right: 12, top: 12,
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', cursor: 'pointer',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4z"/>
                </svg>
              </div>
            </div>

            {/* Body */}
            <div style={{
              padding: '0 16px 16px',
              background: VN_SURFACE_HI,
              position: 'relative',
            }}>
              {/* Avatar overlapping the cover */}
              <div style={{
                width: 76, height: 76, borderRadius: '50%', background: v.avatarCover,
                marginTop: -38, marginBottom: 8,
                border: `3px solid ${VN_BG}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
                boxShadow: '0 12px 30px -12px rgba(124,58,237,0.5)',
              }}>{v.avatarEmoji}</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <div style={{
                  fontFamily: '"Bricolage Grotesque"', fontWeight: 900, fontSize: 26, color: VN_TEXT,
                  letterSpacing: '-0.03em', lineHeight: 1,
                }}>{v.businessName}</div>
                {v.isVerified && (
                  <div title="Verified" style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #A855F7, #EC4899)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 11,
                    boxShadow: '0 4px 12px rgba(168,85,247,0.45)',
                  }}>✦</div>
                )}
              </div>
              <div style={{
                marginTop: 4, fontFamily: 'Inter', fontSize: 12.5, color: VN_TEXT_DIM, fontWeight: 500,
              }}>{v.vendorType} · {v.handle}</div>

              {/* Status pills row */}
              <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <VNStatusPill
                  tone="green"
                  icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
                  label="Verified"
                />
                <VNStatusPill
                  tone="green"
                  icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
                  label="Payouts active"
                />
                <VNStatusPill
                  tone="purple"
                  icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5 12 2"/></svg>}
                  label={`${v.rating} · ${v.ratingCount}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <VNSection title="Business">
          <VNField label="Business name" value={v.businessName}/>
          <VNField label="Vendor type" value={v.vendorType}/>
          <VNField label="Description" value={v.description} multi/>
        </VNSection>

        <VNSection title="Account">
          <VNField label="Username" value={v.name}/>
          <VNField label="Email" value={v.email}/>
        </VNSection>

        <VNSection title="Location">
          <VNField label="City" value={v.city}/>
          <VNField label="Address" value={v.address}/>
        </VNSection>

        <VNSection title="Contact">
          <VNField label="Phone" value={v.phone}/>
          <VNField label="Website" value={v.website} link/>
        </VNSection>

        <VNSection title="Socials">
          <VNSocialRow icon="instagram" label="Instagram" value={v.socials.instagram}/>
          <VNSocialRow icon="tiktok"    label="TikTok"    value={v.socials.tiktok}/>
          <VNSocialRow icon="twitter"   label="X"         value={v.socials.twitter}/>
          <VNSocialRow icon="facebook"  label="Facebook"  value={v.socials.facebook}/>
        </VNSection>

        {/* Danger zone */}
        <div style={{ padding: '4px 18px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button style={{
              height: 48, padding: '0 14px', cursor: 'pointer', borderRadius: 14,
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${VN_STROKE_HI}`,
              color: VN_TEXT, fontFamily: 'Inter', fontWeight: 700, fontSize: 13.5,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={VN_TEXT_DIM} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                </svg>
                Log out
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={VN_TEXT_MUTE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>

      <VNTabBar active="account"/>
    </div>
  );
}

function VNStatusPill({ tone, icon, label }) {
  const palette = {
    green:  { bg: 'rgba(52,211,153,0.16)',  br: 'rgba(52,211,153,0.35)', tx: VN_GREEN_SOFT },
    purple: { bg: 'rgba(168,85,247,0.16)',  br: 'rgba(192,132,252,0.35)', tx: VN_PURPLE_SOFT },
    amber:  { bg: 'rgba(245,158,11,0.16)',  br: 'rgba(245,158,11,0.35)',  tx: '#FCD34D' },
    pink:   { bg: 'rgba(236,72,153,0.16)',  br: 'rgba(236,72,153,0.35)',  tx: '#FBCFE8' },
  }[tone] || { bg: 'rgba(255,255,255,0.06)', br: VN_STROKE, tx: VN_TEXT_DIM };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 10px', borderRadius: 999,
      background: palette.bg, border: `1px solid ${palette.br}`, color: palette.tx,
      fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.03em',
    }}>
      {icon}
      {label}
    </span>
  );
}

function VNSection({ title, children }) {
  return (
    <div style={{ padding: '4px 18px 14px' }}>
      <div style={{
        fontFamily: 'Inter', fontSize: 10, fontWeight: 700, color: VN_TEXT_MUTE,
        letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10, paddingLeft: 2,
      }}>{title}</div>
      <div style={{
        borderRadius: 16, overflow: 'hidden',
        background: VN_SURFACE, border: `1px solid ${VN_STROKE}`, backdropFilter: 'blur(12px)',
      }}>{children}</div>
    </div>
  );
}

function VNField({ label, value, multi, link }) {
  return (
    <div style={{
      padding: '12px 14px',
      borderBottom: `1px solid ${VN_STROKE}`,
      cursor: 'pointer',
      display: 'flex', alignItems: multi ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Inter', fontSize: 11, color: VN_TEXT_MUTE, fontWeight: 500 }}>{label}</div>
        <div style={{
          marginTop: 2, fontFamily: 'Inter', fontSize: 14, color: link ? VN_PURPLE_SOFT : VN_TEXT,
          fontWeight: link ? 600 : 500, lineHeight: 1.45,
          overflow: multi ? 'visible' : 'hidden', textOverflow: multi ? 'clip' : 'ellipsis',
          whiteSpace: multi ? 'normal' : 'nowrap',
        }}>{value}</div>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={VN_TEXT_MUTE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: multi ? 4 : 0 }}>
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>
  );
}

function VNSocialRow({ icon, label, value }) {
  const ICONS = {
    instagram: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>,
    tiktok:    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43V8.85A8.16 8.16 0 0019.59 9.7v-3a4.85 4.85 0 01-1-.01z"/></svg>,
    twitter:   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    facebook:  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.56 9.88v-6.99h-2.54V12h2.54V9.8c0-2.5 1.5-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0022 12z"/></svg>,
  };
  const empty = !value;
  return (
    <div style={{
      padding: '12px 14px',
      borderBottom: `1px solid ${VN_STROKE}`,
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
        background: empty ? 'rgba(255,255,255,0.04)' : 'rgba(168,85,247,0.16)',
        border: empty ? `1px solid ${VN_STROKE}` : '1px solid rgba(192,132,252,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: empty ? VN_TEXT_MUTE : VN_PURPLE_SOFT,
      }}>{ICONS[icon]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Inter', fontSize: 11, color: VN_TEXT_MUTE, fontWeight: 500 }}>{label}</div>
        <div style={{
          marginTop: 2, fontFamily: 'Inter', fontSize: 14,
          color: empty ? VN_TEXT_MUTE : VN_TEXT,
          fontWeight: empty ? 400 : 600, fontStyle: empty ? 'italic' : 'normal',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{empty ? 'Not set · tap to add' : value}</div>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={VN_TEXT_MUTE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>
  );
}

Object.assign(window, { VendorDashboard, VendorServices, VendorAccount, DEMO_VENDOR });
