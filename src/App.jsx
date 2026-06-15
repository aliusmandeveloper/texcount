// src/App.jsx
import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

function App() {
  const webcamRef = useRef(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('camera');
  const [selectedImage, setSelectedImage] = useState(null);

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) analyzeImage(imageSrc);
      else alert('Failed to capture image');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        analyzeImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Image) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post('http://localhost:8000/analyze', { image: base64Image });
      setResult(response.data);
    } catch (error) {
      alert('Backend not running on port 8000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '32px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
          padding: '28px 20px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            fontSize: '32px'
          }}>
            🔬
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>TexCount AI</h1>
          <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '8px' }}>AI-Powered Precision Thread Counter</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '16px 16px 0 16px', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('camera')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: activeTab === 'camera' ? '#2563eb' : '#f3f4f6',
              color: activeTab === 'camera' ? 'white' : '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>📷</span> Camera
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: activeTab === 'upload' ? '#2563eb' : '#f3f4f6',
              color: activeTab === 'upload' ? 'white' : '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>📁</span> Upload
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          
          {/* Camera Tab */}
          {activeTab === 'camera' && (
            <div>
              <div style={{
                background: '#111827',
                borderRadius: '20px',
                overflow: 'hidden',
                marginBottom: '16px'
              }}>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  style={{ width: '100%', display: 'block' }}
                  videoConstraints={{ facingMode: 'environment' }}
                />
              </div>
              <button
                onClick={captureImage}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin">⏳</div> Analyzing...
                  </>
                ) : (
                  <>📸 Capture & Count</>
                )}
              </button>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div>
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '160px',
                border: '2px dashed #cbd5e1',
                borderRadius: '20px',
                cursor: 'pointer',
                background: '#f8fafc',
                transition: 'all 0.3s ease',
                marginBottom: '16px'
              }}>
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>📸</div>
                <p style={{ color: '#64748b' }}>Click to upload fabric image</p>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>PNG, JPG, JPEG</p>
              </label>
              {selectedImage && (
                <img src={selectedImage} alt="Preview" style={{ width: '100%', borderRadius: '16px', marginTop: '16px' }} />
              )}
              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px' }}>
                  <div className="animate-spin">⏳</div> Processing image...
                </div>
              )}
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="animate-fadeIn" style={{
              marginTop: '24px',
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              borderRadius: '20px',
              padding: '20px',
              border: '1px solid #6ee7b7'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  background: '#10b981',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px'
                }}>✓</div>
                <h3 style={{ fontWeight: 'bold', fontSize: '18px', color: '#065f46' }}>Analysis Complete</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'white',
                  borderRadius: '12px',
                  padding: '12px 16px'
                }}>
                  <span style={{ fontWeight: '600', color: '#374151' }}>EPI (Warp Threads/in)</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>{result.epi}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'white',
                  borderRadius: '12px',
                  padding: '12px 16px'
                }}>
                  <span style={{ fontWeight: '600', color: '#374151' }}>PPI (Weft Threads/in)</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f46e5' }}>{result.ppi}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'white',
                  borderRadius: '12px',
                  padding: '10px 16px'
                }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Confidence Score</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '100px', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${result.confidence}%`, height: '100%', background: '#10b981', borderRadius: '4px' }}></div>
                    </div>
                    <span style={{ fontWeight: '600' }}>{result.confidence}%</span>
                  </div>
                </div>
                <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', paddingTop: '8px', borderTop: '1px solid #a7f3d0' }}>
                  ⏱️ Processed in {result.process_time} ms
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          background: '#f9fafb',
          padding: '16px',
          textAlign: 'center',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>🎯 Optimized for Gray Cotton Plain Weave</p>
          <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Powered by Computer Vision & AI</p>
        </div>
      </div>
    </div>
  );
}

export default App;