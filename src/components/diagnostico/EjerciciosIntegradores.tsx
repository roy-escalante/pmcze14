import React, { useState, useRef } from 'react'
import { Upload, File, X, FileText, Edit3, AlertCircle } from 'lucide-react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { DimensionAprovechamientoFormData } from '../../utils/validations'

interface EjerciciosIntegradoresProps {
  register: UseFormRegister<DimensionAprovechamientoFormData>
  errors: FieldErrors<DimensionAprovechamientoFormData>
  setValue: (name: any, value: any) => void
  watch: (name: any) => any
}

export const EjerciciosIntegradores: React.FC<EjerciciosIntegradoresProps> = ({
  register,
  errors,
  setValue,
  watch
}) => {
  const [modo, setModo] = useState<'pdf' | 'manual'>('manual')
  const [arrastrando, setArrastrando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const pdfUrl = watch('ejerciciosIntegradores.documentoPDF')

  // Validar y procesar archivo PDF
  const procesarPDF = async (archivo: File) => {
    // Validar tipo
    if (archivo.type !== 'application/pdf') {
      alert('Solo se permiten archivos PDF')
      return
    }

    // Validar tamaño (máximo 10MB)
    if (archivo.size > 10 * 1024 * 1024) {
      alert('El archivo es muy grande. Máximo 10MB permitido.')
      return
    }

    setSubiendo(true)

    try {
      // Simular subida (en producción aquí subirías a Supabase Storage)
      const url = URL.createObjectURL(archivo)
      setValue('ejerciciosIntegradores.documentoPDF', url)

      // Al subir PDF, limpiar captura manual
      setValue('ejerciciosIntegradores.areas', undefined)

      alert('✅ PDF subido correctamente')
    } catch (error) {
      console.error('Error al procesar PDF:', error)
      alert('Error al subir el archivo PDF')
    } finally {
      setSubiendo(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setArrastrando(false)

    const archivos = e.dataTransfer.files
    if (archivos.length > 0) {
      procesarPDF(archivos[0])
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
      procesarPDF(archivos[0])
    }
    e.target.value = ''
  }

  const abrirSelector = () => {
    inputRef.current?.click()
  }

  const eliminarPDF = () => {
    setValue('ejerciciosIntegradores.documentoPDF', '')
  }

  const cambiarModo = (nuevoModo: 'pdf' | 'manual') => {
    if (modo !== nuevoModo) {
      // Limpiar datos del modo anterior
      if (nuevoModo === 'pdf') {
        setValue('ejerciciosIntegradores.areas', undefined)
      } else {
        setValue('ejerciciosIntegradores.documentoPDF', '')
      }
      setModo(nuevoModo)
    }
  }

  return (
    <div className="space-y-6">
      {/* Título y descripción */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center">
          <FileText className="mr-2" size={20} />
          Ejercicios Integradores de Aprendizaje (EIA)
        </h3>
        <p className="text-sm text-purple-700">
          Los EIA evalúan las competencias de los estudiantes en áreas clave. Puede subir el documento PDF
          oficial o capturar los datos manualmente por área y categoría.
        </p>
      </div>

      {/* Selector de modo */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          type="button"
          onClick={() => cambiarModo('manual')}
          className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${
            modo === 'manual'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Edit3 className="inline-block mr-2" size={16} />
          Captura Manual
        </button>
        <button
          type="button"
          onClick={() => cambiarModo('pdf')}
          className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${
            modo === 'pdf'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Upload className="inline-block mr-2" size={16} />
          Subir PDF
        </button>
      </div>

      {/* Contenido según modo */}
      {modo === 'pdf' ? (
        <div className="space-y-4">
          {!pdfUrl ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                arrastrando
                  ? 'border-purple-500 bg-purple-50'
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
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Upload size={48} className={`mx-auto mb-4 ${arrastrando ? 'text-purple-500' : 'text-gray-400'}`} />

              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">
                  {subiendo ? 'Subiendo PDF...' : 'Arrastra el PDF aquí o haz clic para seleccionar'}
                </p>
                <p className="text-sm text-gray-500">
                  Documento oficial de Ejercicios Integradores de Aprendizaje
                </p>
                <p className="text-xs text-gray-400">
                  Máximo 10MB • Solo archivos PDF
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <File size={24} className="text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Documento EIA subido correctamente
                    </p>
                    <p className="text-xs text-green-600">
                      El documento está disponible en el sistema
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={eliminarPDF}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar PDF"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              💡 <strong>Nota:</strong> Si sube un documento PDF, no necesita capturar los datos manualmente.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              Capture el número de estudiantes en cada categoría para las tres áreas evaluadas.
              Las categorías representan el nivel de logro: <strong>No Evidencia</strong>, <strong>Requiere Apoyo</strong>,
              <strong>En Proceso</strong>, y <strong>Alcanzado</strong>.
            </p>
          </div>

          {/* Área 1: Manejo de Información */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                1
              </span>
              Manejo de Información
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No Evidencia
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('ejerciciosIntegradores.areas.manejoInformacion.noEvidencia',
                    { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
                {errors.ejerciciosIntegradores?.areas?.manejoInformacion?.noEvidencia && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.ejerciciosIntegradores.areas.manejoInformacion.noEvidencia.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requiere Apoyo
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('ejerciciosIntegradores.areas.manejoInformacion.requiereApoyo',
                    { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  En Proceso
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('ejerciciosIntegradores.areas.manejoInformacion.enProceso',
                    { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alcanzado
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('ejerciciosIntegradores.areas.manejoInformacion.alcanzado',
                    { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Área 2: Discriminación de Información */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                2
              </span>
              Discriminación de Información
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No Evidencia
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('ejerciciosIntegradores.areas.discriminacionInformacion.noEvidencia',
                    { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requiere Apoyo
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('ejerciciosIntegradores.areas.discriminacionInformacion.requiereApoyo',
                    { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  En Proceso
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('ejerciciosIntegradores.areas.discriminacionInformacion.enProceso',
                    { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alcanzado
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('ejerciciosIntegradores.areas.discriminacionInformacion.alcanzado',
                    { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Área 3: Cálculo Mental */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                3
              </span>
              Cálculo Mental
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No Evidencia
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('ejerciciosIntegradores.areas.calculoMental.noEvidencia',
                    { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requiere Apoyo
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('ejerciciosIntegradores.areas.calculoMental.requiereApoyo',
                    { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  En Proceso
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('ejerciciosIntegradores.areas.calculoMental.enProceso',
                    { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alcanzado
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('ejerciciosIntegradores.areas.calculoMental.alcanzado',
                    { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Importante:</strong> Asegúrese de que la suma de estudiantes en todas las categorías
              corresponda al total de estudiantes evaluados en cada área.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default EjerciciosIntegradores
