import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts'
import { Download, FileText, TrendingUp, AlertTriangle, CheckCircle, Clock, Users, Target, Award, BookOpen, Heart } from 'lucide-react'
import { useDiagnostico } from '../../stores'
import { DimensionNEM, PuntajeDimension } from '../../types'

interface ResultadosDiagnosticoProps {
  diagnosticoId: string
  onVolver?: () => void
  onEditar?: () => void
}

const iconosPorDimension = {
  [DimensionNEM.APROVECHAMIENTO_ACADEMICO]: Award,
  [DimensionNEM.PRACTICAS_DOCENTES]: Users,
  [DimensionNEM.FORMACION_DOCENTE]: Target,
  [DimensionNEM.PARTICIPACION_COMUNIDAD]: Heart,
  [DimensionNEM.DESEMPENO_AUTORIDAD]: BookOpen
}

const nombresDimensiones = {
  [DimensionNEM.APROVECHAMIENTO_ACADEMICO]: 'Aprovechamiento Académico',
  [DimensionNEM.PRACTICAS_DOCENTES]: 'Prácticas Docentes',
  [DimensionNEM.FORMACION_DOCENTE]: 'Formación Docente',
  [DimensionNEM.PARTICIPACION_COMUNIDAD]: 'Participación de la Comunidad',
  [DimensionNEM.DESEMPENO_AUTORIDAD]: 'Desempeño de la Autoridad'
}

const coloresPorNivel = {
  'EXCELENTE': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle, color: '#10b981' },
  'BUENO': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: TrendingUp, color: '#3b82f6' },
  'REGULAR': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', icon: Clock, color: '#f59e0b' },
  'DEFICIENTE': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: AlertTriangle, color: '#ef4444' }
}

export default function ResultadosDiagnostico({ diagnosticoId, onVolver, onEditar }: ResultadosDiagnosticoProps) {
  const { obtenerDiagnostico, calcularPuntajeDimension, calcularPuntajeGeneral, obtenerNivelPorPuntaje, exportarDiagnostico } = useDiagnostico()
  
  const diagnostico = obtenerDiagnostico(diagnosticoId)
  
  if (!diagnostico) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Diagnóstico no encontrado
          </h3>
          <p className="text-yellow-600 mb-4">
            El diagnóstico solicitado no existe o ha sido eliminado.
          </p>
          {onVolver && (
            <button
              onClick={onVolver}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Volver
            </button>
          )}
        </div>
      </div>
    )
  }

  // Calcular puntajes para dimensiones disponibles
  const puntajes: PuntajeDimension[] = []
  
  if (diagnostico.dimensionAprovechamiento) {
    puntajes.push(calcularPuntajeDimension(diagnostico.dimensionAprovechamiento, DimensionNEM.APROVECHAMIENTO_ACADEMICO))
  }
  if (diagnostico.dimensionPracticasDocentes) {
    puntajes.push(calcularPuntajeDimension(diagnostico.dimensionPracticasDocentes, DimensionNEM.PRACTICAS_DOCENTES))
  }
  if (diagnostico.dimensionFormacionDocente) {
    puntajes.push(calcularPuntajeDimension(diagnostico.dimensionFormacionDocente, DimensionNEM.FORMACION_DOCENTE))
  }
  
  const puntajeGeneral = calcularPuntajeGeneral(puntajes)
  const nivelGeneral = obtenerNivelPorPuntaje(puntajeGeneral)

  // Datos para gráficos
  const datosBarras = puntajes.map(p => ({
    dimension: nombresDimensiones[p.dimension],
    porcentaje: p.porcentaje,
    nivel: p.nivel
  }))

  const datosRadar = puntajes.map(p => ({
    dimension: nombresDimensiones[p.dimension],
    puntaje: p.porcentaje
  }))

  const handleExportar = () => {
    const datos = exportarDiagnostico(diagnosticoId)
    const blob = new Blob([datos], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `diagnostico_${diagnostico.datosGenerales.cct}_${diagnostico.datosGenerales.cicloEscolar}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generarRecomendaciones = () => {
    const recomendaciones: string[] = []
    
    puntajes.forEach(puntaje => {
      const dimensionNombre = nombresDimensiones[puntaje.dimension]
      
      if (puntaje.nivel === 'DEFICIENTE') {
        recomendaciones.push(`🔴 ${dimensionNombre}: Requiere atención inmediata y plan de mejora urgente`)
      } else if (puntaje.nivel === 'REGULAR') {
        recomendaciones.push(`🟡 ${dimensionNombre}: Implementar estrategias de fortalecimiento a mediano plazo`)
      } else if (puntaje.nivel === 'BUENO') {
        recomendaciones.push(`🔵 ${dimensionNombre}: Continuar con las prácticas actuales y buscar oportunidades de mejora`)
      } else if (puntaje.nivel === 'EXCELENTE') {
        recomendaciones.push(`🟢 ${dimensionNombre}: Mantener el nivel de excelencia y compartir buenas prácticas`)
      }
    })

    return recomendaciones
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resultados del Diagnóstico Educativo
          </h1>
          <div className="space-y-1">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">{diagnostico.datosGenerales.nombreEscuela}</span>
            </p>
            <p className="text-sm text-gray-600">
              CCT: {diagnostico.datosGenerales.cct} | Ciclo: {diagnostico.datosGenerales.cicloEscolar}
            </p>
            <p className="text-sm text-gray-600">
              Responsable: {diagnostico.datosGenerales.responsable.nombre} - {diagnostico.datosGenerales.responsable.cargo}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleExportar}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={20} className="mr-2" />
            Exportar
          </button>
          {onEditar && (
            <button
              onClick={onEditar}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FileText size={20} className="mr-2" />
              Editar
            </button>
          )}
        </div>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-lg border-2 ${coloresPorNivel[nivelGeneral].border} ${coloresPorNivel[nivelGeneral].bg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Puntaje General</h3>
            {React.createElement(coloresPorNivel[nivelGeneral].icon, {
              size: 24,
              className: coloresPorNivel[nivelGeneral].text
            })}
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {puntajeGeneral.toFixed(1)}%
          </div>
          <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${coloresPorNivel[nivelGeneral].bg} ${coloresPorNivel[nivelGeneral].text}`}>
            {nivelGeneral}
          </div>
        </div>

        <div className="p-6 rounded-lg border border-gray-200 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dimensiones Evaluadas</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {puntajes.length}
          </div>
          <p className="text-sm text-gray-600">de 5 dimensiones NEM</p>
        </div>

        <div className="p-6 rounded-lg border border-gray-200 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fortalezas</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {puntajes.reduce((total, p) => total + p.fortalezas.length, 0)}
          </div>
          <p className="text-sm text-gray-600">aspectos destacados</p>
        </div>

        <div className="p-6 rounded-lg border border-gray-200 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Áreas de Oportunidad</h3>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {puntajes.reduce((total, p) => total + p.areasOportunidad.length, 0)}
          </div>
          <p className="text-sm text-gray-600">aspectos a mejorar</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de barras */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Puntajes por Dimensión
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosBarras}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="dimension" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Puntaje']} />
              <Bar 
                dataKey="porcentaje" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico radar */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Perfil de Dimensiones
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={datosRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="dimension" fontSize={12} />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={false}
              />
              <Radar
                name="Puntaje"
                dataKey="puntaje"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detalle por Dimensiones */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Detalle por Dimensiones</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {puntajes.map((puntaje) => {
            const Icono = iconosPorDimension[puntaje.dimension]
            const estilo = coloresPorNivel[puntaje.nivel]
            
            return (
              <div key={puntaje.dimension} className={`p-6 rounded-lg border-2 ${estilo.border} bg-white`}>
                <div className="flex items-center mb-4">
                  <div className={`p-2 rounded-lg ${estilo.bg} mr-3`}>
                    <Icono size={24} className={estilo.text} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {nombresDimensiones[puntaje.dimension]}
                    </h4>
                    <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${estilo.bg} ${estilo.text}`}>
                      {puntaje.nivel} - {puntaje.porcentaje}%
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Fortalezas</h5>
                    <div className="space-y-1">
                      {puntaje.fortalezas.length > 0 ? (
                        puntaje.fortalezas.map((fortaleza, index) => (
                          <div key={index} className="flex items-center text-sm text-green-700">
                            <CheckCircle size={16} className="mr-2 text-green-500" />
                            {fortaleza}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No hay fortalezas identificadas</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Áreas de Oportunidad</h5>
                    <div className="space-y-1">
                      {puntaje.areasOportunidad.length > 0 ? (
                        puntaje.areasOportunidad.map((area, index) => (
                          <div key={index} className="flex items-center text-sm text-orange-700">
                            <AlertTriangle size={16} className="mr-2 text-orange-500" />
                            {area}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No hay áreas de oportunidad identificadas</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
          <Target size={24} className="mr-2" />
          Recomendaciones Generales
        </h3>
        <div className="space-y-3">
          {generarRecomendaciones().map((recomendacion, index) => (
            <div key={index} className="flex items-start text-sm text-blue-800">
              <span className="mr-2 mt-0.5">•</span>
              {recomendacion}
            </div>
          ))}
        </div>
        {puntajes.length < 5 && (
          <div className="mt-4 p-4 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Para obtener un diagnóstico completo, completa las {5 - puntajes.length} dimensiones restantes de la NEM.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Diagnóstico generado el {diagnostico.createdAt.toLocaleDateString()} | 
          Última actualización: {diagnostico.updatedAt.toLocaleDateString()}
        </div>
        
        {onVolver && (
          <button
            onClick={onVolver}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Volver
          </button>
        )}
      </div>
    </div>
  )
}