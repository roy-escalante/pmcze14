import React, { useState, useRef } from 'react'
import { Upload, File, Image, X, HelpCircle } from 'lucide-react'

interface ArchivoEvidencia {
  id: string
  nombre: string
  tipo: string
  tamaño: number
  url: string
  fechaSubida: Date
}

interface SubirEvidenciasEconomicoProps {
  evidencias: ArchivoEvidencia[]
  onAgregarEvidencia: (archivo: ArchivoEvidencia) => void
  onEliminarEvidencia: (id: string) => void
}

export const SubirEvidenciasEconomico: React.FC<SubirEvidenciasEconomicoProps> = ({
  evidencias,
  onAgregarEvidencia,
  onEliminarEvidencia
}) => {
  const [arrastrando, setArrastrando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [mostrarInfo, setMostrarInfo] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Configuración económica estricta
  const CONFIG = {
    maxArchivos: 2,           // Solo 2 evidencias por criterio
    maxTamañoMB: 2,          // 2MB máximo (muy estricto)
    tiposPermitidos: [
      'image/jpeg',
      'image/png', 
      'application/pdf'       // Solo imágenes y PDFs
    ]
  }

  const obtenerIconoArchivo = (tipo: string) => {
    if (tipo.startsWith('image/')) return <Image size={16} className="text-green-600" />
    return <File size={16} className="text-gray-600" />
  }

  const formatearTamaño = (bytes: number) => {
    const mb = bytes / 1024 / 1024
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`
  }

  const validarArchivo = (archivo: File): string | null => {
    // Verificar límite de archivos
    if (evidencias.length >= CONFIG.maxArchivos) {
      return `Máximo ${CONFIG.maxArchivos} evidencias permitidas (política de costos)`
    }

    // Verificar tamaño (muy estricto)
    const maxBytes = CONFIG.maxTamañoMB * 1024 * 1024
    if (archivo.size > maxBytes) {
      return `Archivo muy grande. Máximo ${CONFIG.maxTamañoMB}MB (política de costos)`
    }

    // Verificar tipo
    if (!CONFIG.tiposPermitidos.includes(archivo.type)) {
      return 'Solo se permiten imágenes JPG/PNG y documentos PDF (política de costos)'
    }

    return null
  }

  const comprimirImagen = async (archivo: File): Promise<File> => {
    return new Promise((resolve) => {
      // Solo comprimir si es imagen
      if (!archivo.type.startsWith('image/')) {
        resolve(archivo)
        return
      }

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = document.createElement('img') as HTMLImageElement

      img.onload = () => {
        // Redimensionar si es muy grande
        const maxWidth = 1200
        const maxHeight = 800
        let { width, height } = img

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }

        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)

        // Convertir a blob comprimido
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Crear un objeto que simule File
              const archivoComprimido = Object.assign(blob, {
                name: archivo.name.replace(/\.(png|jpg|jpeg)$/i, '.jpg'),
                lastModified: Date.now(),
                size: blob.size,
                type: 'image/jpeg'
              }) as File
              resolve(archivoComprimido)
            } else {
              resolve(archivo)
            }
          },
          'image/jpeg',
          0.7 // 70% calidad
        )
      }

      img.src = URL.createObjectURL(archivo)
    })
  }

  const procesarArchivos = async (archivos: FileList) => {
    setSubiendo(true)

    for (let i = 0; i < archivos.length; i++) {
      if (evidencias.length >= CONFIG.maxArchivos) {
        alert('Límite de evidencias alcanzado')
        break
      }

      const archivo = archivos[i]
      
      // Validar archivo
      const error = validarArchivo(archivo)
      if (error) {
        alert(`Error: ${error}`)
        continue
      }

      try {
        // Comprimir si es imagen
        const archivoFinal = await comprimirImagen(archivo)
        
        // Verificar tamaño después de compresión
        if (archivoFinal.size > CONFIG.maxTamañoMB * 1024 * 1024) {
          alert(`${archivo.name} sigue siendo muy grande después de compresión`)
          continue
        }

        // Crear evidencia
        const nuevaEvidencia: ArchivoEvidencia = {
          id: `eco-${Date.now()}-${i}`,
          nombre: archivoFinal.name,
          tipo: archivoFinal.type,
          tamaño: archivoFinal.size,
          url: URL.createObjectURL(archivoFinal),
          fechaSubida: new Date()
        }

        onAgregarEvidencia(nuevaEvidencia)
      } catch (error) {
        console.error('Error al procesar:', error)
        alert(`Error al procesar ${archivo.name}`)
      }
    }

    setSubiendo(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setArrastrando(false)
    procesarArchivos(e.dataTransfer.files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      procesarArchivos(e.target.files)
    }
    e.target.value = ''
  }

  const espacioRestante = CONFIG.maxArchivos - evidencias.length
  const tamañoTotal = evidencias.reduce((sum, ev) => sum + ev.tamaño, 0)
  const tamañoTotalMB = tamañoTotal / 1024 / 1024

  return (
    <div className="space-y-4">
      {/* Modal Informativo */}
      {mostrarInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Información de Evidencias</h3>
              <button
                onClick={() => setMostrarInfo(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Límites:</h4>
                <ul className="space-y-1">
                  <li>• Máximo 2 evidencias por criterio</li>
                  <li>• Solo imágenes JPG/PNG y PDFs</li>
                  <li>• 2MB máximo por archivo</li>
                  <li>• Compresión automática aplicada</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">💡 Tips para optimizar:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Imágenes:</strong> Usa capturas de pantalla en lugar de fotos</li>
                  <li>• <strong>Videos:</strong> Sube solo screenshot + enlace a YouTube/Drive</li>
                  <li>• <strong>Documentos:</strong> Comprime PDFs antes de subir</li>
                  <li>• <strong>Audio:</strong> Usa texto descriptivo en lugar de grabaciones</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setMostrarInfo(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Encabezado con información */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Subir Evidencias</h4>
        <button
          type="button"
          onClick={() => setMostrarInfo(true)}
          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          title="Ver información sobre límites y tips"
        >
          <HelpCircle size={16} />
        </button>
      </div>

      {/* Zona de subida */}
      {espacioRestante > 0 && (
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
            arrastrando
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setArrastrando(true) }}
          onDragLeave={(e) => { e.preventDefault(); setArrastrando(false) }}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Upload size={32} className={arrastrando ? 'text-blue-500' : 'text-gray-400'} />
          <p className="mt-2 text-sm font-medium text-gray-900">
            {subiendo ? 'Procesando...' : `Sube hasta ${espacioRestante} evidencia(s) más`}
          </p>
          <p className="text-xs text-gray-500">
            Solo JPG, PNG, PDF • Máx 2MB c/u
          </p>
        </div>
      )}

      {/* Resumen de uso */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Evidencias:</span>
          <span className={espacioRestante === 0 ? 'text-red-600 font-medium' : 'text-gray-900'}>
            {evidencias.length}/{CONFIG.maxArchivos}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600">Tamaño total:</span>
          <span className={tamañoTotalMB > CONFIG.maxTamañoMB ? 'text-red-600' : 'text-gray-900'}>
            {tamañoTotalMB.toFixed(1)} MB
          </span>
        </div>
        {espacioRestante === 0 && (
          <p className="text-xs text-red-600 mt-1">
            Límite alcanzado. Elimina evidencias para subir nuevas.
          </p>
        )}
      </div>

      {/* Lista de evidencias */}
      {evidencias.length > 0 && (
        <div className="space-y-2">
          {evidencias.map((evidencia) => (
            <div
              key={evidencia.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                {obtenerIconoArchivo(evidencia.tipo)}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {evidencia.nombre}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatearTamaño(evidencia.tamaño)} • {evidencia.fechaSubida.toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => onEliminarEvidencia(evidencia.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Eliminar"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default SubirEvidenciasEconomico