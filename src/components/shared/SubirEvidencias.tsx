import React, { useState, useRef } from 'react'
import { Upload, File, Image, Video, Music, X, Download, Eye } from 'lucide-react'

interface ArchivoEvidencia {
  id: string
  nombre: string
  tipo: string
  tamaño: number
  url: string
  fechaSubida: Date
}

interface SubirEvidenciasProps {
  evidencias: ArchivoEvidencia[]
  onAgregarEvidencia: (archivo: ArchivoEvidencia) => void
  onEliminarEvidencia: (id: string) => void
  maxArchivos?: number
  maxTamañoMB?: number
}

export const SubirEvidencias: React.FC<SubirEvidenciasProps> = ({
  evidencias,
  onAgregarEvidencia,
  onEliminarEvidencia,
  maxArchivos = 5,
  maxTamañoMB = 10
}) => {
  const [arrastrando, setArrastrando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const tiposPermitidos = {
    'image/*': 'Imágenes (JPG, PNG, GIF, etc.)',
    'video/*': 'Videos (MP4, AVI, MOV, etc.)',
    'audio/*': 'Audio (MP3, WAV, etc.)', 
    'application/pdf': 'Documentos PDF',
    'application/msword': 'Documentos Word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Documentos Word',
    'application/vnd.ms-excel': 'Hojas de Excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Hojas de Excel'
  }

  const obtenerIconoArchivo = (tipo: string) => {
    if (tipo.startsWith('image/')) return <Image size={20} className="text-green-600" />
    if (tipo.startsWith('video/')) return <Video size={20} className="text-blue-600" />
    if (tipo.startsWith('audio/')) return <Music size={20} className="text-purple-600" />
    return <File size={20} className="text-gray-600" />
  }

  const formatearTamaño = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validarArchivo = (archivo: File): string | null => {
    // Verificar tamaño
    if (archivo.size > maxTamañoMB * 1024 * 1024) {
      return `El archivo es muy grande. Máximo ${maxTamañoMB}MB permitido.`
    }

    // Verificar tipo
    const tiposValidos = Object.keys(tiposPermitidos)
    const esValido = tiposValidos.some(tipo => {
      if (tipo.includes('*')) {
        return archivo.type.startsWith(tipo.split('*')[0])
      }
      return archivo.type === tipo
    })

    if (!esValido) {
      return 'Tipo de archivo no permitido. Solo se permiten imágenes, videos, audio y documentos.'
    }

    return null
  }

  const procesarArchivos = async (archivos: FileList) => {
    if (evidencias.length >= maxArchivos) {
      alert(`Solo se permiten máximo ${maxArchivos} archivos de evidencia.`)
      return
    }

    setSubiendo(true)

    for (let i = 0; i < archivos.length; i++) {
      const archivo = archivos[i]
      
      // Validar archivo
      const error = validarArchivo(archivo)
      if (error) {
        alert(`Error en ${archivo.name}: ${error}`)
        continue
      }

      // Verificar límite
      if (evidencias.length + i >= maxArchivos) {
        alert(`Se alcanzó el límite de ${maxArchivos} archivos.`)
        break
      }

      try {
        // Simular subida (en producción aquí subirías a Supabase Storage)
        const url = URL.createObjectURL(archivo)
        
        const nuevaEvidencia: ArchivoEvidencia = {
          id: `${Date.now()}-${i}`,
          nombre: archivo.name,
          tipo: archivo.type,
          tamaño: archivo.size,
          url: url,
          fechaSubida: new Date()
        }

        onAgregarEvidencia(nuevaEvidencia)
      } catch (error) {
        console.error('Error al procesar archivo:', error)
        alert(`Error al subir ${archivo.name}`)
      }
    }

    setSubiendo(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setArrastrando(false)
    
    const archivos = e.dataTransfer.files
    if (archivos.length > 0) {
      procesarArchivos(archivos)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setArrastrando(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setArrastrando(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = e.target.files
    if (archivos && archivos.length > 0) {
      procesarArchivos(archivos)
    }
    // Limpiar input para permitir seleccionar el mismo archivo de nuevo
    e.target.value = ''
  }

  const abrirSelector = () => {
    inputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Zona de subida */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          arrastrando
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={abrirSelector}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={Object.keys(tiposPermitidos).join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Upload size={48} className={`mx-auto mb-4 ${arrastrando ? 'text-blue-500' : 'text-gray-400'}`} />
        
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            {subiendo ? 'Subiendo archivos...' : 'Arrastra archivos aquí o haz clic para seleccionar'}
          </p>
          <p className="text-sm text-gray-500">
            {`Máximo ${maxArchivos} archivos de ${maxTamañoMB}MB cada uno`}
          </p>
          <p className="text-xs text-gray-400">
            Formatos permitidos: Imágenes, Videos, Audio, PDF, Word, Excel
          </p>
        </div>
      </div>

      {/* Lista de evidencias */}
      {evidencias.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">
            Evidencias subidas ({evidencias.length}/{maxArchivos})
          </h4>
          
          <div className="grid gap-3">
            {evidencias.map((evidencia) => (
              <div
                key={evidencia.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  {obtenerIconoArchivo(evidencia.tipo)}
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {evidencia.nombre}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatearTamaño(evidencia.tamaño)} • {evidencia.fechaSubida.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Botón de vista previa */}
                  <button
                    type="button"
                    onClick={() => window.open(evidencia.url, '_blank')}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Ver archivo"
                  >
                    <Eye size={16} />
                  </button>
                  
                  {/* Botón de descarga */}
                  <button
                    type="button"
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = evidencia.url
                      link.download = evidencia.nombre
                      link.click()
                    }}
                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                    title="Descargar"
                  >
                    <Download size={16} />
                  </button>
                  
                  {/* Botón de eliminar */}
                  <button
                    type="button"
                    onClick={() => onEliminarEvidencia(evidencia.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Eliminar"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">💡 Tipos de evidencia recomendados:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>Imágenes:</strong> Fotografías de trabajos estudiantiles, instalaciones, actividades</li>
          <li><strong>Documentos:</strong> Reportes, evaluaciones, planes de clase, estadísticas</li>
          <li><strong>Videos:</strong> Grabaciones de clases, presentaciones, eventos</li>
          <li><strong>Audio:</strong> Entrevistas, testimonios, grabaciones educativas</li>
        </ul>
      </div>
    </div>
  )
}

export default SubirEvidencias