import { useState, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import './App.css'

function App() {
  const [model, setModel] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // ================================
  // Switch the model here
  // ================================

  // const modelName = 'yolov8n_web_model'
  const modelName = 'yolo11n_web_model__tfjs_export'

  // ================================

  useEffect(() => {
    const loadModel = async () => {
      try {
        // Load the model from the public directory
        const loadedModel = await tf.loadGraphModel(`/models/${modelName}/model.json`)
        setModel(loadedModel)

        // Warm up the model with fake data
        const dummyInput = tf.zeros([1, 640, 640, 3]) // Common input shape for YOLO models
        const warmupResult = loadedModel.predict(dummyInput)

        // Clean up tensors
        tf.dispose([dummyInput, warmupResult])

        setError(null)
      } catch (error) {
        console.error('Error loading model:', error)
        setError(error.message || 'Failed to load model')
      } finally {
        setIsLoading(false)
      }
    }

    loadModel()
  }, [])

  return (
    <div className="App">
      <h1>YOLO Model in Browser</h1>
      {isLoading ? (
        <p>Loading model {modelName}...</p>
      ) : error ? (
        <div style={{ color: 'red', padding: '20px' }}>
          <h2>Error loading model {modelName}</h2>
          <p>{error}</p>
          <p>Check the console for more details.</p>
        </div>
      ) : (
        <p>Model {modelName} loaded and warmed up successfully!</p>
      )}
    </div>
  )
}

export default App
