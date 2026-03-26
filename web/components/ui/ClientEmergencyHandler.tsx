'use client'

export function ClientEmergencyHandler() {
  const handleAcknowledge = () => {
    const emergencyNotice = document.getElementById('emergency-notice')
    if (emergencyNotice) {
      emergencyNotice.classList.add('hidden')
    }
  }

  return (
    <div 
      id="emergency-notice" 
      className="hidden fixed inset-0 bg-red-600 text-white z-50 flex items-center justify-center"
      role="alert"
      aria-live="assertive"
      aria-label="Emergency stop notification"
    >
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4" id="emergency-heading">
          ⚠️ EMERGENCY STOP ACTIVATED
        </h1>
        <p className="text-xl mb-4" aria-describedby="emergency-heading">
          All frequency therapy has been stopped.
        </p>
        <p className="mb-4">
          If you're experiencing medical emergency, call 911 immediately.
        </p>
        <button 
          onClick={handleAcknowledge}
          className="mt-4 px-6 py-3 bg-white text-red-600 font-bold rounded focus:outline-none focus:ring-4 focus:ring-white"
          aria-label="Acknowledge emergency stop and close this notification"
          autoFocus
        >
          Acknowledge
        </button>
      </div>
    </div>
  )
}