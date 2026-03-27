import { useState } from 'react'
import './index.css'

function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePredict = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ status: 'error', message: 'Failed to connect to the prediction server. Please ensure the Python API is running.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
      
      <main className="glass-panel">
        <header>
          <h1>Fake News Detection</h1>
          <p>Powered by an advanced 45,000-article AI dataset.</p>
        </header>

        <form onSubmit={handlePredict}>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a news article or snippet here to verify its authenticity..."
            rows="8"
          />
          <button type="submit" disabled={loading || !text.trim()} className={loading ? 'loading' : ''}>
            {loading ? 'Analyzing Source...' : 'Verify Authenticity ✨'}
          </button>
        </form>

        {result && (
          <div className={`result-card ${result.status === 'success' ? (result.prediction === 'Fake News' ? 'fake' : 'real') : 'warning'}`}>
            {result.status === 'success' ? (
              <>
                <div className="badge">{result.prediction === 'Fake News' ? '❌ FAKE NEWS' : '✅ REAL NEWS'}</div>
                <h2>{result.prediction}</h2>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
                <p>Confidence Score: {(result.confidence * 100).toFixed(1)}%</p>
              </>
            ) : (
              <>
                <div className="badge warning-badge">⚠️ INSUFFICIENT DATA</div>
                <p>{result.message}</p>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
