'use client';

import { useState } from 'react';

export default function AdsPage() {
  const [adAccountId, setAdAccountId] = useState('1793764414677837');
  const [accessToken, setAccessToken] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCampaigns = async () => {
    if (!adAccountId || !accessToken) {
      setError('Please enter both Ad Account ID and Access Token');
      return;
    }

    setLoading(true);
    setError('');
    setCampaigns([]);

    try {
      const response = await fetch(
        `/api/ads?adAccountId=${adAccountId}&accessToken=${accessToken}`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setCampaigns(data.data || []);
      }
    } catch (err) {
      setError('Failed to fetch campaigns. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>
        Facebook Ads Manager
      </h1>

      {/* Input Section */}
      <div style={{ 
        background: '', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: '500',
            color: '#555'
          }}>
            Ad Account ID
          </label>
          <input
            type="text"
            placeholder="1793764414677837"
            value={adAccountId}
            onChange={(e) => setAdAccountId(e.target.value)}
            style={{
              padding: '12px',
              width: '100%',
              maxWidth: '400px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: '500',
            color: '#555'
          }}>
            Access Token
          </label>
          <input
            type="password"
            placeholder="Enter your Facebook Access Token"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            style={{
              padding: '12px',
              width: '100%',
              maxWidth: '600px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={fetchCampaigns}
          disabled={loading}
          style={{
            padding: '12px 30px',
            background: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'background 0.3s'
          }}
        >
          {loading ? 'Loading...' : 'Fetch Campaigns'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '15px', 
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #fcc'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Campaigns Table */}
      {campaigns.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>
            Campaigns ({campaigns.length})
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              background: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #dee2e6',
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Campaign ID
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #dee2e6',
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Name
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #dee2e6',
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Status
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #dee2e6',
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Objective
                  </th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign, index) => (
                  <tr 
                    key={campaign.id}
                    style={{ 
                      background: index % 2 === 0 ? 'white' : '#f8f9fa',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#e9ecef'}
                    onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f8f9fa'}
                  >
                    <td style={{ 
                      padding: '15px', 
                      borderBottom: '1px solid #dee2e6',
                      fontSize: '13px',
                      color: '#6c757d',
                      fontFamily: 'monospace'
                    }}>
                      {campaign.id}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      borderBottom: '1px solid #dee2e6',
                      fontWeight: '500',
                      color: '#212529'
                    }}>
                      {campaign.name}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      borderBottom: '1px solid #dee2e6'
                    }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: campaign.status === 'ACTIVE' ? '#d4edda' : 
                                   campaign.status === 'PAUSED' ? '#fff3cd' : '#f8d7da',
                        color: campaign.status === 'ACTIVE' ? '#155724' : 
                               campaign.status === 'PAUSED' ? '#856404' : '#721c24'
                      }}>
                        {campaign.status}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      borderBottom: '1px solid #dee2e6',
                      color: '#495057'
                    }}>
                      {campaign.objective}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data Message */}
      {!loading && !error && campaigns.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#6c757d' 
        }}>
          <p>No campaigns to display. Enter your credentials and click "Fetch Campaigns".</p>
        </div>
      )}
    </div>
  );
}
