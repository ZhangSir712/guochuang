'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const PetReconstructionContext = createContext(null)

const STORAGE_KEY_FILES = 'pet-reconstruction-files'
const STORAGE_KEY_CONFIG = 'pet-reconstruction-config'
const STORAGE_KEY_GENERATED_IMAGE = 'pet-reconstruction-generated-image'

function loadFromStorage(key, defaultValue) {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveToStorage(key, value) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

export function PetReconstructionProvider({ children }) {
  const [isMounted, setIsMounted] = useState(false)
  
  const [files, setFilesState] = useState([])
  const [config, setConfigState] = useState({
    style: 'cute',
    strength: 50,
    background: 'transparent',
    customColor: '#ffffff',
    gradientStart: '#ffffff',
    gradientEnd: '#000000',
    size: '768',
    prompt: '',
    petName: '',
    breed: '',
    personality: '',
    personalityTags: []
  })

  useEffect(() => {
    const storedFiles = loadFromStorage(STORAGE_KEY_FILES, [])
    const storedConfig = loadFromStorage(STORAGE_KEY_CONFIG, config)
    const storedGeneratedImage = loadFromStorage(STORAGE_KEY_GENERATED_IMAGE, null)

    setFilesState(storedFiles.map(file => ({
      ...file,
      file: undefined,
      previewUrl: file.dataUrl || null
    })))
    setConfigState(storedConfig)
    setGeneratedImage(storedGeneratedImage)
    setIsMounted(true)
  }, [])
  const [generatedImage, setGeneratedImage] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)

  const updateFiles = useCallback((newFiles) => {
    setFilesState(newFiles)
    const filesForStorage = newFiles.map(({ file, ...rest }) => rest)
    saveToStorage(STORAGE_KEY_FILES, filesForStorage)
  }, [])

  const updateConfig = useCallback((newConfig) => {
    setConfigState(prev => {
      const updated = { ...prev, ...newConfig }
      saveToStorage(STORAGE_KEY_CONFIG, updated)
      return updated
    })
  }, [])

  const updateGeneratedImage = useCallback((image) => {
    setGeneratedImage(image)
    saveToStorage(STORAGE_KEY_GENERATED_IMAGE, image)
  }, [])

  const resetState = useCallback(() => {
    const emptyFiles = []
    const defaultConfig = {
      style: 'cute',
      strength: 50,
      background: 'transparent',
      customColor: '#ffffff',
      gradientStart: '#ffffff',
      gradientEnd: '#000000',
      size: '768',
      prompt: '',
      petName: '',
      breed: '',
      personality: '',
      personalityTags: []
    }
    setFilesState(emptyFiles)
    setConfigState(defaultConfig)
    setGeneratedImage(null)
    setCurrentStep(1)
    saveToStorage(STORAGE_KEY_FILES, emptyFiles)
    saveToStorage(STORAGE_KEY_CONFIG, defaultConfig)
    saveToStorage(STORAGE_KEY_GENERATED_IMAGE, null)
  }, [])

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY_FILES) {
        const newFiles = e.newValue ? JSON.parse(e.newValue) : []
        setFilesState(newFiles)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const value = {
    files,
    config,
    generatedImage,
    currentStep,
    setFiles: updateFiles,
    setConfig: updateConfig,
    setGeneratedImage: updateGeneratedImage,
    setCurrentStep,
    resetState
  }

  return (
    <PetReconstructionContext.Provider value={value}>
      {children}
    </PetReconstructionContext.Provider>
  )
}

export function usePetReconstruction() {
  const context = useContext(PetReconstructionContext)
  if (!context) {
    throw new Error('usePetReconstruction must be used within a PetReconstructionProvider')
  }
  return context
}
