import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center px-6">
        
        <div className="text-8xl font-black text-gray-800">404</div>
        
        <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>

        <div>
          <h1 className="text-white text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-gray-500 text-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
          >
            ← Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl text-sm font-semibold transition"
          >
            Go Home
          </button>
        </div>

      </div>
    </div>
  )
}

export default NotFound