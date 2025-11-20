import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EscuelaFormSchema, EscuelaFormData, escuelaFormDefaults, generarCCT, opcionesRegion, opcionesTurno } from '../../utils/validations'
import { useEscuelas } from '../../stores'
import { Escuela } from '../../types'

interface FormularioEscuelaProps {
  escuela?: Escuela | null
  onSuccess: () => void
  onCancel: () => void
}

export const FormularioEscuela: React.FC<FormularioEscuelaProps> = ({
  escuela = null,
  onSuccess,
  onCancel
}) => {
  const { crearEscuela, actualizarEscuela, isLoading, escuelas, validarCCT } = useEscuelas()
  
  const esEdicion = !!escuela

  // Configurar formulario con React Hook Form + Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError
  } = useForm<EscuelaFormData>({
    resolver: zodResolver(EscuelaFormSchema),
    defaultValues: escuela ? {
      cct: escuela.cct,
      nombre: escuela.nombre,
      numeroEST: escuela.numeroEST,
      region: escuela.region,
      direccion: escuela.direccion,
      contacto: escuela.contacto,
      matriculaTotal: escuela.matriculaTotal,
      numeroDocentes: escuela.numeroDocentes,
      turno: escuela.turno,
      activa: escuela.activa
    } : escuelaFormDefaults
  })

  const numeroESTWatch = watch('numeroEST')

  // Auto-generar CCT cuando cambia el número EST
  React.useEffect(() => {
    if (numeroESTWatch && !esEdicion) {
      const cctGenerado = generarCCT(numeroESTWatch)
      setValue('cct', cctGenerado)
    }
  }, [numeroESTWatch, setValue, esEdicion])

  // Manejar envío del formulario
  const onSubmit = async (data: EscuelaFormData) => {
    try {
      // Validaciones adicionales
      if (!validarCCT(data.cct, escuela?.id)) {
        setError('cct', { message: 'Este CCT ya está en uso por otra escuela' })
        return
      }

      // Validar número EST único
      const numeroESTExiste = escuelas.some(e => 
        e.numeroEST === data.numeroEST && e.id !== escuela?.id
      )
      if (numeroESTExiste) {
        setError('numeroEST', { message: 'Este número EST ya está asignado a otra escuela' })
        return
      }

      let success = false
      
      if (esEdicion && escuela) {
        // Actualizar escuela existente
        success = await actualizarEscuela(escuela.id, data)
      } else {
        // Crear nueva escuela
        success = await crearEscuela(data)
      }

      if (success) {
        onSuccess()
      } else {
        alert('Error al guardar la escuela. Intente nuevamente.')
      }
    } catch (error) {
      console.error('Error en formulario:', error)
      alert('Error inesperado. Intente nuevamente.')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {esEdicion ? 'Editar Escuela' : 'Nueva Escuela'}
        </h2>
        <p className="text-gray-600">
          {esEdicion 
            ? 'Modifique la información de la escuela'
            : 'Complete la información para registrar una nueva escuela'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información Básica */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-4">Información Básica</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Número EST */}
            <div>
              <label htmlFor="numeroEST" className="block text-sm font-medium text-gray-700 mb-1">
                Número EST *
              </label>
              <input
                type="number"
                id="numeroEST"
                {...register('numeroEST', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 41"
                disabled={isSubmitting}
              />
              {errors.numeroEST && (
                <p className="text-red-600 text-sm mt-1">{errors.numeroEST.message}</p>
              )}
            </div>

            {/* CCT */}
            <div>
              <label htmlFor="cct" className="block text-sm font-medium text-gray-700 mb-1">
                CCT (Clave de Centro de Trabajo) *
              </label>
              <input
                type="text"
                id="cct"
                {...register('cct')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="14DTV0041K"
                disabled={isSubmitting || isLoading}
              />
              {errors.cct && (
                <p className="text-red-600 text-sm mt-1">{errors.cct.message}</p>
              )}
            </div>

            {/* Nombre */}
            <div className="md:col-span-2">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo de la Escuela *
              </label>
              <input
                type="text"
                id="nombre"
                {...register('nombre')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Escuela Secundaria Técnica 41"
                disabled={isSubmitting}
              />
              {errors.nombre && (
                <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>
              )}
            </div>

            {/* Región */}
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                Región *
              </label>
              <select
                id="region"
                {...register('region')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              >
                {opcionesRegion.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.region && (
                <p className="text-red-600 text-sm mt-1">{errors.region.message}</p>
              )}
            </div>

            {/* Turno */}
            <div>
              <label htmlFor="turno" className="block text-sm font-medium text-gray-700 mb-1">
                Turno *
              </label>
              <select
                id="turno"
                {...register('turno')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              >
                {opcionesTurno.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.turno && (
                <p className="text-red-600 text-sm mt-1">{errors.turno.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-4">Dirección</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="calle" className="block text-sm font-medium text-gray-700 mb-1">
                Calle y Número *
              </label>
              <input
                type="text"
                id="calle"
                {...register('direccion.calle')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Calle Principal 123"
                disabled={isSubmitting}
              />
              {errors.direccion?.calle && (
                <p className="text-red-600 text-sm mt-1">{errors.direccion.calle.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="colonia" className="block text-sm font-medium text-gray-700 mb-1">
                Colonia *
              </label>
              <input
                type="text"
                id="colonia"
                {...register('direccion.colonia')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Centro"
                disabled={isSubmitting}
              />
              {errors.direccion?.colonia && (
                <p className="text-red-600 text-sm mt-1">{errors.direccion.colonia.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-1">
                Municipio *
              </label>
              <input
                type="text"
                id="municipio"
                {...register('direccion.municipio')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Tamazunchale"
                disabled={isSubmitting}
              />
              {errors.direccion?.municipio && (
                <p className="text-red-600 text-sm mt-1">{errors.direccion.municipio.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="localidad" className="block text-sm font-medium text-gray-700 mb-1">
                Localidad *
              </label>
              <input
                type="text"
                id="localidad"
                {...register('direccion.localidad')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Localidad Centro"
                disabled={isSubmitting}
              />
              {errors.direccion?.localidad && (
                <p className="text-red-600 text-sm mt-1">{errors.direccion.localidad.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-700 mb-1">
                Código Postal *
              </label>
              <input
                type="text"
                id="codigoPostal"
                {...register('direccion.codigoPostal')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="79960"
                disabled={isSubmitting}
              />
              {errors.direccion?.codigoPostal && (
                <p className="text-red-600 text-sm mt-1">{errors.direccion.codigoPostal.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-4">Información de Contacto</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                id="telefono"
                {...register('contacto.telefono')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="481-123-4567"
                disabled={isSubmitting}
              />
              {errors.contacto?.telefono && (
                <p className="text-red-600 text-sm mt-1">{errors.contacto.telefono.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                {...register('contacto.email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="est41@pmcze14.edu.mx"
                disabled={isSubmitting}
              />
              {errors.contacto?.email && (
                <p className="text-red-600 text-sm mt-1">{errors.contacto.email.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Información Académica */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="font-semibold text-purple-800 mb-4">Información Académica</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="matriculaTotal" className="block text-sm font-medium text-gray-700 mb-1">
                Matrícula Total *
              </label>
              <input
                type="number"
                id="matriculaTotal"
                {...register('matriculaTotal', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="180"
                disabled={isSubmitting}
              />
              {errors.matriculaTotal && (
                <p className="text-red-600 text-sm mt-1">{errors.matriculaTotal.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="numeroDocentes" className="block text-sm font-medium text-gray-700 mb-1">
                Número de Docentes *
              </label>
              <input
                type="number"
                id="numeroDocentes"
                {...register('numeroDocentes', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="12"
                disabled={isSubmitting}
              />
              {errors.numeroDocentes && (
                <p className="text-red-600 text-sm mt-1">{errors.numeroDocentes.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="activa"
                {...register('activa')}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="activa" className="ml-2 block text-sm text-gray-700">
                Escuela activa
              </label>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Crear Escuela')}
          </button>
        </div>
      </form>
    </div>
  )
}