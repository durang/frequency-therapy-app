'use client'

export function ClientEmergencyHandler() {
  return (
    <div id="emergency-notice" className="hidden fixed inset-0 bg-red-600 text-white z-50 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">⚠️ EMERGENCY STOP ACTIVATED</h1>
        <p className="text-xl mb-4">All frequency therapy has been stopped.</p>
        <p>If you're experiencing medical emergency, call 911 immediately.</p>
        <button 
          onClick={() => document.getElementById('emergency-notice')?.classList.add('hidden')}
          className="mt-4 px-6 py-3 bg-white text-red-600 font-bold rounded"
        >
          Acknowledge
        </button>
      </div>
    </div>
  )
}