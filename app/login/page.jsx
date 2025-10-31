'use client';

export default function Dashboard() {
  const connectFacebook = () => {
    const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const redirectUri = encodeURIComponent('https://webhook-test-beta-five.vercel.app/api/auth/facebook/callback');

    console.log('Facebook App ID:', facebookAppId);
    const scope = 'ads_management,ads_read,business_management';
    
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    
    window.location.href = authUrl;
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1>Connect Your Facebook Ads Account</h1>
      <button 
        onClick={connectFacebook}
        style={{
          padding: '12px 24px',
          background: '#1877f2',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Connect Facebook Ads
      </button>
    </div>
  );
}
