import type React from "react"

import { useState } from "react"
import { Upload, Camera, Recycle, AlertCircle, CheckCircle } from "lucide-react"

const recyclingTips = {
  cardboard: "Remove tape and flatten cardboard boxes before recycling. Keep them dry and clean.",
  glass: "Rinse glass containers and remove lids. Don't recycle broken glass in regular bins.",
  metal: "Empty and rinse cans thoroughly. Labels can stay on, but remove any plastic caps.",
  paper: "Avoid recycling wet or greasy paper (like pizza boxes). Shred sensitive documents.",
  plastic: "Check for recycling numbers 1-7. Rinse bottles and containers before recycling.",
  trash: "This item can't be recycled. Consider reducing consumption or finding reuse opportunities.",
}

type WasteType = keyof typeof recyclingTips

interface ClassificationResult {
  prediction: WasteType
  confidence: number
}

export default function WasteClassifierDashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isClassifying, setIsClassifying] = useState(false)
  const [result, setResult] = useState<ClassificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setResult(null)
      setError(null)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file)
      setResult(null)
      setError(null)

      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const classifyWaste = async () => {
    if (!selectedFile) return

    setIsClassifying(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("http://localhost:5000/classify", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Classification failed")
      }

      const data = await response.json()
      setResult({
        prediction: data.class,
        confidence: data.confidence,
      })
    } catch (err) {
      setError("Failed to classify waste. Please try again.")
      console.error("Classification error:", err)
    } finally {
      setIsClassifying(false)
    }
  }

  const resetClassifier = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
  }

  const getWasteTypeColor = (wasteType: WasteType) => {
    const colors = {
      cardboard: "bg-amber-100 text-amber-800 border-amber-200",
      glass: "bg-green-100 text-green-800 border-green-200",
      metal: "bg-gray-100 text-gray-800 border-gray-200",
      paper: "bg-blue-100 text-blue-800 border-blue-200",
      plastic: "bg-purple-100 text-purple-800 border-purple-200",
      trash: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[wasteType] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Recycle className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Smart Waste Classifier</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload an image of your waste item and get instant classification with recycling tips
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Image
              </h2>

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop an image here, or click to select</p>
                <p className="text-sm text-gray-400">Supports JPG, PNG, GIF up to 10MB</p>
                <input id="file-input" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>

              {selectedFile && (
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate">{selectedFile.name}</span>
                  <button onClick={resetClassifier} className="text-red-500 hover:text-red-700 text-sm">
                    Remove
                  </button>
                </div>
              )}

              {selectedFile && (
                <button
                  onClick={classifyWaste}
                  disabled={isClassifying}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isClassifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Classifying...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      Classify Waste
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Image Preview</h3>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Waste item preview"
                    className="w-full h-full object-cover rounded-lg"
                    />
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Classification Result */}
            {result && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Classification Result
                </h3>

                <div className="space-y-4">
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full border ${getWasteTypeColor(result.prediction)}`}
                  >
                    <span className="font-medium capitalize">{result.prediction}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Confidence</span>
                      <span className="text-sm font-medium">{(result.confidence)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${result.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Error</h3>
                </div>
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Recycling Tips */}
            {result && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-green-600" />
                  Recycling Tips
                </h3>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 leading-relaxed">{recyclingTips[result.prediction]}</p>
                </div>

                {result.prediction !== "trash" && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>💡 Pro Tip:</strong> Always check your local recycling guidelines as they may vary by
                      location.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Getting Started */}
            {!selectedFile && !result && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">How it works</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <p className="text-gray-600">Upload a clear image of your waste item</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <p className="text-gray-600">Our AI will classify the waste type</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <p className="text-gray-600">Get personalized recycling tips</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
