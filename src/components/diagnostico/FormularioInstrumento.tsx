import React from 'react'
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { AlertCircle, HelpCircle } from 'lucide-react'
import { FormularioConfig, TipoPregunta, PreguntaConfig } from '../../types'

interface FormularioInstrumentoProps {
  config: FormularioConfig
  register: UseFormRegister<any>
  errors: FieldErrors<any>
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
}

export const FormularioInstrumento: React.FC<FormularioInstrumentoProps> = ({
  config,
  register,
  errors,
  setValue,
  watch
}) => {

  const renderPregunta = (pregunta: PreguntaConfig, seccionId: string) => {
    const fieldName = `respuestas.${pregunta.id}`
    const error = errors.respuestas?.[pregunta.id]

    switch (pregunta.tipo) {
      case TipoPregunta.LIKERT5:
        return renderLikert5(pregunta, fieldName, error)

      case TipoPregunta.LIKERT4:
        return renderLikert4(pregunta, fieldName, error)

      case TipoPregunta.TEXTO:
        return renderTexto(pregunta, fieldName, error)

      case TipoPregunta.NUMERO:
        return renderNumero(pregunta, fieldName, error)

      case TipoPregunta.SELECT:
        return renderSelect(pregunta, fieldName, error)

      case TipoPregunta.MULTISELECT:
        return renderMultiselect(pregunta, fieldName, error)

      case TipoPregunta.BOOLEAN:
        return renderBoolean(pregunta, fieldName, error)

      default:
        return <div className="text-red-500">Tipo de pregunta no soportado: {pregunta.tipo}</div>
    }
  }

  const renderLikert5 = (pregunta: PreguntaConfig, fieldName: string, error: any) => {
    const opciones = [
      { valor: 1, etiqueta: '1' },
      { valor: 2, etiqueta: '2' },
      { valor: 3, etiqueta: '3' },
      { valor: 4, etiqueta: '4' },
      { valor: 5, etiqueta: '5' }
    ]

    return (
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {pregunta.texto} {pregunta.requerido && <span className="text-red-500">*</span>}
          </label>
          {pregunta.ayuda && (
            <div className="group relative ml-2">
              <HelpCircle size={16} className="text-gray-400 hover:text-gray-600 cursor-help" />
              <div className="hidden group-hover:block absolute right-0 z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                {pregunta.ayuda}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between space-x-2 bg-gray-50 p-4 rounded-lg">
          <span className="text-xs text-gray-600 font-medium">Nunca</span>
          <div className="flex space-x-4">
            {opciones.map((opcion) => (
              <label key={opcion.valor} className="flex flex-col items-center space-y-1 cursor-pointer group">
                <input
                  type="radio"
                  value={opcion.valor}
                  {...register(fieldName, {
                    required: pregunta.requerido ? 'Este campo es requerido' : false,
                    valueAsNumber: true
                  })}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  {opcion.etiqueta}
                </span>
              </label>
            ))}
          </div>
          <span className="text-xs text-gray-600 font-medium">Siempre</span>
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            {error.message}
          </p>
        )}
      </div>
    )
  }

  const renderLikert4 = (pregunta: PreguntaConfig, fieldName: string, error: any) => {
    const opciones = [
      { valor: 1, etiqueta: 'Deficiente' },
      { valor: 2, etiqueta: 'Regular' },
      { valor: 3, etiqueta: 'Bueno' },
      { valor: 4, etiqueta: 'Excelente' }
    ]

    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          {pregunta.texto} {pregunta.requerido && <span className="text-red-500">*</span>}
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {opciones.map((opcion) => (
            <label
              key={opcion.valor}
              className="flex items-center justify-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <input
                type="radio"
                value={opcion.valor}
                {...register(fieldName, {
                  required: pregunta.requerido ? 'Este campo es requerido' : false,
                  valueAsNumber: true
                })}
                className="sr-only peer"
              />
              <span className="text-sm font-medium text-gray-700 peer-checked:text-blue-600">
                {opcion.etiqueta}
              </span>
            </label>
          ))}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            {error.message}
          </p>
        )}
      </div>
    )
  }

  const renderTexto = (pregunta: PreguntaConfig, fieldName: string, error: any) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {pregunta.texto} {pregunta.requerido && <span className="text-red-500">*</span>}
        </label>
        <textarea
          {...register(fieldName, {
            required: pregunta.requerido ? 'Este campo es requerido' : false
          })}
          rows={4}
          placeholder={pregunta.placeholder || 'Escriba su respuesta aquí...'}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {pregunta.ayuda && (
          <p className="text-xs text-gray-500">{pregunta.ayuda}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            {error.message}
          </p>
        )}
      </div>
    )
  }

  const renderNumero = (pregunta: PreguntaConfig, fieldName: string, error: any) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {pregunta.texto} {pregunta.requerido && <span className="text-red-500">*</span>}
        </label>
        <input
          type="number"
          {...register(fieldName, {
            required: pregunta.requerido ? 'Este campo es requerido' : false,
            valueAsNumber: true,
            min: pregunta.min,
            max: pregunta.max
          })}
          min={pregunta.min}
          max={pregunta.max}
          step={pregunta.step || 1}
          placeholder={pregunta.placeholder}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {pregunta.ayuda && (
          <p className="text-xs text-gray-500">{pregunta.ayuda}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            {error.message}
          </p>
        )}
      </div>
    )
  }

  const renderSelect = (pregunta: PreguntaConfig, fieldName: string, error: any) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {pregunta.texto} {pregunta.requerido && <span className="text-red-500">*</span>}
        </label>
        <select
          {...register(fieldName, {
            required: pregunta.requerido ? 'Este campo es requerido' : false
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Seleccione una opción</option>
          {pregunta.opciones?.map((opcion, index) => (
            <option key={index} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
        {pregunta.ayuda && (
          <p className="text-xs text-gray-500">{pregunta.ayuda}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            {error.message}
          </p>
        )}
      </div>
    )
  }

  const renderMultiselect = (pregunta: PreguntaConfig, fieldName: string, error: any) => {
    const valores = watch(fieldName) || []

    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          {pregunta.texto} {pregunta.requerido && <span className="text-red-500">*</span>}
        </label>
        {pregunta.ayuda && (
          <p className="text-xs text-gray-600 mb-2">{pregunta.ayuda}</p>
        )}
        <div className="space-y-2">
          {pregunta.opciones?.map((opcion, index) => (
            <label key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                value={opcion}
                {...register(fieldName, {
                  required: pregunta.requerido ? 'Debe seleccionar al menos una opción' : false
                })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{opcion}</span>
            </label>
          ))}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            {error.message}
          </p>
        )}
      </div>
    )
  }

  const renderBoolean = (pregunta: PreguntaConfig, fieldName: string, error: any) => {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          {pregunta.texto} {pregunta.requerido && <span className="text-red-500">*</span>}
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="1"
              {...register(fieldName, {
                required: pregunta.requerido ? 'Este campo es requerido' : false,
                valueAsNumber: true
              })}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">Sí</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="0"
              {...register(fieldName, {
                required: pregunta.requerido ? 'Este campo es requerido' : false,
                valueAsNumber: true
              })}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">No</span>
          </label>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            {error.message}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header del formulario */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-blue-900 mb-2">{config.titulo}</h3>
        <p className="text-sm text-blue-700">{config.descripcion}</p>
      </div>

      {/* Secciones */}
      {config.secciones.map((seccion, seccionIndex) => (
        <div key={seccion.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          {/* Título de sección */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                {seccionIndex + 1}
              </span>
              {seccion.titulo}
            </h4>
            {seccion.descripcion && (
              <p className="mt-2 text-sm text-gray-600 ml-11">{seccion.descripcion}</p>
            )}
          </div>

          {/* Preguntas */}
          <div className="space-y-6 ml-11">
            {seccion.preguntas.map((pregunta, preguntaIndex) => (
              <div key={pregunta.id} className="pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                <div className="flex items-start">
                  <span className="text-xs font-medium text-gray-500 mr-3 mt-1">
                    {seccionIndex + 1}.{preguntaIndex + 1}
                  </span>
                  <div className="flex-1">
                    {renderPregunta(pregunta, seccion.id)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Indicador de progreso */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          <strong>Total de preguntas:</strong> {config.secciones.reduce((total, s) => total + s.preguntas.length, 0)}
        </p>
      </div>
    </div>
  )
}

export default FormularioInstrumento
