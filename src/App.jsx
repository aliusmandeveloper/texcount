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

  // Capture from camera
  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        analyzeImage(imageSrc);
      } else {
        alert('Failed to capture image. Please try again.');
      }
    }
  };

  // Upload from file
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setSelectedImage(base64String);
        analyzeImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Send image to backend
  const analyzeImage = async (base64Image) => {
    setLoading(true);
    setResult(null);
    
    try {
      // const response = await axios.post('http://localhost:8000/analyze', {
      //   image: base64Image
      // });
      const response = await axios.post('https://aliusmanijaz143-texcount-backend.hf.space/analyze', { image: base64Image })
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Analysis failed. Make sure backend is running on port 8000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '16px' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '16px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>TexCount AI</h1>
          <p style={{ fontSize: '14px', margin: '4px 0 0 0' }}>AI-Powered Fabric Thread Counter</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
          <button
            style={{ flex: 1, padding: '8px', textAlign: 'center', backgroundColor: activeTab === 'camera' ? '#3b82f6' : '#e5e7eb', color: activeTab === 'camera' ? 'white' : 'black', border: 'none', cursor: 'pointer' }}
            onClick={() => setActiveTab('camera')}
          >
            📷 Camera
          </button>
          <button
            style={{ flex: 1, padding: '8px', textAlign: 'center', backgroundColor: activeTab === 'upload' ? '#3b82f6' : '#e5e7eb', color: activeTab === 'upload' ? 'white' : 'black', border: 'none', cursor: 'pointer' }}
            onClick={() => setActiveTab('upload')}
          >
            📁 Upload
          </button>
        </div>

        {/* Camera Tab */}
        {activeTab === 'camera' && (
          <div style={{ padding: '16px' }}>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{ width: '100%', borderRadius: '8px', border: '1px solid #d1d5db' }}
              videoConstraints={{ facingMode: 'environment' }}
            />
            <button
              onClick={captureImage}
              disabled={loading}
              style={{ marginTop: '16px', width: '100%', backgroundColor: loading ? '#9ca3af' : '#2563eb', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Analyzing...' : '📸 Capture & Count'}
            </button>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div style={{ padding: '16px' }}>
            <label style={{ display: 'block', width: '100%', padding: '16px', border: '2px dashed #d1d5db', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#f9fafb' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <span>📁 Click or tap to upload fabric image</span>
            </label>
            {selectedImage && (
              <img src={selectedImage} alt="Preview" style={{ marginTop: '16px', width: '100%', borderRadius: '8px', border: '1px solid #d1d5db' }} />
            )}
            {loading && <p style={{ marginTop: '16px', textAlign: 'center', color: '#6b7280' }}>Analyzing...</p>}
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div style={{ margin: '16px', padding: '16px', backgroundColor: '#dcfce7', borderRadius: '8px' }}>
            <h2 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>📊 Thread Count Result</h2>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>EPI (Warp):</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>{result.epi}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>PPI (Weft):</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>{result.ppi}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>Confidence:</span>
                <span>{result.confidence}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>Process Time:</span>
                <span>{result.process_time} ms</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ backgroundColor: '#f9fafb', padding: '12px', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
          Optimized for gray cotton plain weave fabrics
        </div>
      </div>
    </div>
  );
}

export default App;