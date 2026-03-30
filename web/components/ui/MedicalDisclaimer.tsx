'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Shield, Stethoscope, BookOpen, X, Check } from 'lucide-react'

interface MedicalDisclaimerProps {
  isVisible: boolean
  onAccept: () => void
  onDecline: () => void
}

export default function MedicalDisclaimer({ isVisible, onAccept, onDecline }: MedicalDisclaimerProps) {
  const [hasReadAll, setHasReadAll] = useState(false)
  const [acknowledged, setAcknowledged] = useState({
    notMedicalDevice: false,
    consultPhysician: false,
    contraindications: false,
    noGuarantees: false
  })

  const allAcknowledged = Object.values(acknowledged).every(Boolean)

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-red-200">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">Important Medical Information</h2>
          </div>

          <div className="space-y-6 mb-8">
            {/* FDA Disclaimer */}
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-red-900 mb-2">FDA Medical Device Disclaimer</h3>
                  <p className="text-red-800 leading-relaxed">
                    <strong>FreqTherapy is NOT a medical device.</strong> This platform is designed for wellness, 
                    research, and educational purposes only. The frequency therapy technology has not been evaluated 
                    by the U.S. Food and Drug Administration (FDA) as a medical device for the diagnosis, treatment, 
                    cure, or prevention of any disease or medical condition.
                  </p>
                  <label className="flex items-center gap-3 mt-4 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={acknowledged.notMedicalDevice}
                      onChange={(e) => setAcknowledged({...acknowledged, notMedicalDevice: e.target.checked})}
                      className="w-5 h-5 text-red-600"
                    />
                    <span className="text-sm font-medium text-red-900">
                      I understand FreqTherapy is not an FDA-approved medical device
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Medical Supervision */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <Stethoscope className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Medical Supervision Required</h3>
                  <p className="text-blue-800 leading-relaxed mb-3">
                    <strong>Always consult your healthcare provider</strong> before beginning frequency therapy, 
                    especially if you have pre-existing medical conditions. Clinical-grade protocols should only 
                    be administered under qualified medical supervision.
                  </p>
                  <p className="text-blue-800 text-sm">
                    This is particularly important if you are pregnant, nursing, have a history of seizures, 
                    cardiac conditions, psychiatric disorders, or are taking medications that affect the nervous system.
                  </p>
                  <label className="flex items-center gap-3 mt-4 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={acknowledged.consultPhysician}
                      onChange={(e) => setAcknowledged({...acknowledged, consultPhysician: e.target.checked})}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-sm font-medium text-blue-900">
                      I will consult my healthcare provider before using frequency therapy
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Contraindications */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-yellow-900 mb-2">Important Contraindications</h3>
                  <p className="text-yellow-800 mb-3">
                    <strong>Do not use FreqTherapy if you have:</strong>
                  </p>
                  <ul className="text-yellow-800 space-y-2 list-disc list-inside">
                    <li>Active epilepsy or seizure disorders</li>
                    <li>Pacemaker or implanted cardiac devices</li>
                    <li>Severe psychiatric conditions without medical supervision</li>
                    <li>Pregnancy (first trimester) or high-risk pregnancy</li>
                    <li>Recent traumatic brain injury</li>
                    <li>Active substance abuse or withdrawal</li>
                  </ul>
                  <p className="text-yellow-800 text-sm mt-3">
                    Stop use immediately if you experience dizziness, nausea, headaches, or any adverse reactions.
                  </p>
                  <label className="flex items-center gap-3 mt-4 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={acknowledged.contraindications}
                      onChange={(e) => setAcknowledged({...acknowledged, contraindications: e.target.checked})}
                      className="w-5 h-5 text-yellow-600"
                    />
                    <span className="text-sm font-medium text-yellow-900">
                      I have read and understand the contraindications
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Legal and Results Disclaimer */}
            <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Results and Legal Disclaimer</h3>
                  <div className="text-gray-700 space-y-2">
                    <p>
                      <strong>Individual results may vary.</strong> While clinical studies show promising results, 
                      FreqTherapy cannot guarantee specific outcomes for individual users.
                    </p>
                    <p>
                      <strong>Not a substitute for medical care.</strong> Frequency therapy should complement, 
                      not replace, conventional medical treatment.
                    </p>
                    <p>
                      <strong>Research purposes.</strong> Some frequencies are provided for research and educational 
                      purposes and should only be used under appropriate supervision.
                    </p>
                    <p className="text-sm text-gray-600 mt-4">
                      By using FreqTherapy, you acknowledge that you understand these limitations and agree to use 
                      the platform responsibly and at your own risk.
                    </p>
                  </div>
                  <label className="flex items-center gap-3 mt-4 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={acknowledged.noGuarantees}
                      onChange={(e) => setAcknowledged({...acknowledged, noGuarantees: e.target.checked})}
                      className="w-5 h-5 text-gray-600"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      I understand the limitations and will use responsibly
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Emergency Information */}
            <div className="bg-red-100 border border-red-300 p-6 rounded-lg">
              <h3 className="font-bold text-red-900 mb-2">Emergency Information</h3>
              <p className="text-red-800 text-sm">
                If you experience any adverse reactions during or after using frequency therapy, 
                discontinue use immediately and contact your healthcare provider. 
                For medical emergencies, call 911 (US) or your local emergency services.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={onDecline}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              I Do Not Agree
            </Button>
            
            <Button 
              onClick={onAccept}
              disabled={!allAcknowledged}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              I Understand and Agree to Proceed
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Last updated: March 2026 | Version 1.2 | 
            For questions about this disclaimer, contact: medical@freqtherapy.com
          </p>
        </CardContent>
      </Card>
    </div>
  )
}