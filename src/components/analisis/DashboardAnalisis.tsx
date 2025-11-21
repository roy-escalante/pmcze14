/**
 * 📊 DASHBOARD DE ANÁLISIS - PMCZE14
 *
 * Dashboard completo con visualizaciones de diagnósticos,
 * comparativas entre escuelas y análisis por dimensiones
 */

import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { TrendingUp, TrendingDown, School, Users, FileText, Award } from 'lucide-react'
import { useDiagnostico, useEscuelas } from '../../stores'

// Colores para las gráficas
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const DIMENSION_COLORS = {
  aprovechamiento: '#3b82f6',
  practicasDocentes: '#10b981',
  formacionDocente: '#f59e0b',
  planesPrograma: '#ef4444',
  participacionFamilia: '#8b5cf6'
}

interface Props {
  onVolverDashboard: () => void
}

export const DashboardAnalisis: React.FC<Props> = ({ onVolverDashboard }) => {
  const { diagnosticos } = useDiagnostico()
  const { escuelas } = useEscuelas()
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<'actual' | 'historico'>('actual')

  // Estadísticas generales
  const totalDiagnosticos = diagnosticos.length
  const diagnosticosCompletados = diagnosticos.filter(d => d.estado === 'COMPLETADO' || d.estado === 'VALIDADO').length
  const promedioGeneral = diagnosticos.length > 0
    ? diagnosticos.reduce((sum, d) => sum + (d.puntaje_general || 0), 0) / diagnosticos.length
    : 0

  // Datos para gráfica de barras: Puntajes por escuela
  const datosPorEscuela = escuelas.map(escuela => {
    const diagnosticosEscuela = diagnosticos.filter(d => d.escuela_id === escuela.id)
    const puntajePromedio = diagnosticosEscuela.length > 0
      ? diagnosticosEscuela.reduce((sum, d) => sum + (d.puntaje_general || 0), 0) / diagnosticosEscuela.length
      : 0

    return {
      nombre: escuela.nombre.replace('Escuela Secundaria Técnica No. ', 'EST '),
      puntaje: parseFloat(puntajePromedio.toFixed(2)),
      diagnosticos: diagnosticosEscuela.length
    }
  }).filter(d => d.diagnosticos > 0)

  // Datos para gráfica de radar: Dimensiones promedio
  const datosDimensiones = [
    { dimension: 'Aprovechamiento', value: 0 },
    { dimension: 'Prácticas Docentes', value: 0 },
    { dimension: 'Formación Docente', value: 0 },
    { dimension: 'Planes y Programas', value: 0 },
    { dimension: 'Participación Familiar', value: 0 }
  ]

  if (diagnosticos.length > 0) {
    const totales = diagnosticos.reduce((acc, d) => {
      if (d.puntajes) {
        acc.aprovechamiento += d.puntajes.aprovechamiento || 0
        acc.practicasDocentes += d.puntajes.practicasDocentes || 0
        acc.formacionDocente += d.puntajes.formacionDocente || 0
        acc.planesPrograma += d.puntajes.planesPrograma || 0
        acc.participacionFamilia += d.puntajes.participacionFamilia || 0
      }
      return acc
    }, {
      aprovechamiento: 0,
      practicasDocentes: 0,
      formacionDocente: 0,
      planesPrograma: 0,
      participacionFamilia: 0
    })

    const count = diagnosticos.length
    datosDimensiones[0].value = parseFloat((totales.aprovechamiento / count).toFixed(2))
    datosDimensiones[1].value = parseFloat((totales.practicasDocentes / count).toFixed(2))
    datosDimensiones[2].value = parseFloat((totales.formacionDocente / count).toFixed(2))
    datosDimensiones[3].value = parseFloat((totales.planesPrograma / count).toFixed(2))
    datosDimensiones[4].value = parseFloat((totales.participacionFamilia / count).toFixed(2))
  }

  // Datos para gráfica de pastel: Distribución por nivel
  const distribucionNiveles = [
    { name: 'Excelente', value: diagnosticos.filter(d => d.nivel_general === 'EXCELENTE').length },
    { name: 'Bueno', value: diagnosticos.filter(d => d.nivel_general === 'BUENO').length },
    { name: 'Regular', value: diagnosticos.filter(d => d.nivel_general === 'REGULAR').length },
    { name: 'Deficiente', value: diagnosticos.filter(d => d.nivel_general === 'DEFICIENTE').length }
  ].filter(item => item.value > 0)

  // Comparativa Norte vs Sur
  const escuelasNorte = escuelas.filter(e => e.region === 'HUASTECA_NORTE')
  const escuelasSur = escuelas.filter(e => e.region === 'HUASTECA_SUR')

  const diagnosticosNorte = diagnosticos.filter(d =>
    escuelasNorte.some(e => e.id === d.escuela_id)
  )
  const diagnosticosSur = diagnosticos.filter(d =>
    escuelasSur.some(e => e.id === d.escuela_id)
  )

  const promedioNorte = diagnosticosNorte.length > 0
    ? diagnosticosNorte.reduce((sum, d) => sum + (d.puntaje_general || 0), 0) / diagnosticosNorte.length
    : 0

  const promedioSur = diagnosticosSur.length > 0
    ? diagnosticosSur.reduce((sum, d) => sum + (d.puntaje_general || 0), 0) / diagnosticosSur.length
    : 0

  const datosRegiones = [
    { region: 'Huasteca Norte', puntaje: parseFloat(promedioNorte.toFixed(2)) },
    { region: 'Huasteca Sur', puntaje: parseFloat(promedioSur.toFixed(2)) }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onVolverDashboard}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          ← Volver al Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Análisis</h1>
        <p className="text-gray-600 mt-2">
          Visualización y análisis de diagnósticos educativos - Zona Escolar 14
        </p>
      </div>

      {/* Tarjetas de estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Diagnósticos</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalDiagnosticos}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completados</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{diagnosticosCompletados}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Award className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Escuelas Activas</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{escuelas.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <School className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Promedio General</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">
                {promedioGeneral.toFixed(2)}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              {promedioGeneral >= 3.5 ? (
                <TrendingUp className="text-orange-600" size={24} />
              ) : (
                <TrendingDown className="text-orange-600" size={24} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gráficas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfica de barras: Puntajes por escuela */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Puntajes por Escuela
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosPorEscuela}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="nombre"
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="puntaje" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de radar: Dimensiones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Promedio por Dimensión NEM
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={datosDimensiones}>
              <PolarGrid />
              <PolarAngleAxis dataKey="dimension" />
              <PolarRadiusAxis angle={90} domain={[0, 5]} />
              <Radar
                name="Puntaje"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica de pastel: Distribución por nivel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución por Nivel de Desempeño
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribucionNiveles}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, value}) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {distribucionNiveles.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Comparativa Norte vs Sur */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comparativa Regional
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosRegiones}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="puntaje" fill="#10b981" name="Puntaje Promedio" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Huasteca Norte</p>
              <p className="text-2xl font-bold text-blue-600">{promedioNorte.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">{diagnosticosNorte.length} diagnósticos</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Huasteca Sur</p>
              <p className="text-2xl font-bold text-green-600">{promedioSur.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">{diagnosticosSur.length} diagnósticos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de resumen */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumen Detallado por Escuela
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Escuela
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CCT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Región
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnósticos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puntaje Promedio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nivel
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {escuelas.map((escuela) => {
                const diagnosticosEscuela = diagnosticos.filter(d => d.escuela_id === escuela.id)
                const puntajePromedio = diagnosticosEscuela.length > 0
                  ? diagnosticosEscuela.reduce((sum, d) => sum + (d.puntaje_general || 0), 0) / diagnosticosEscuela.length
                  : 0

                const nivel = puntajePromedio >= 4 ? 'EXCELENTE'
                  : puntajePromedio >= 3.5 ? 'BUENO'
                  : puntajePromedio >= 2.5 ? 'REGULAR'
                  : 'DEFICIENTE'

                const colorNivel = {
                  'EXCELENTE': 'text-green-600 bg-green-100',
                  'BUENO': 'text-blue-600 bg-blue-100',
                  'REGULAR': 'text-yellow-600 bg-yellow-100',
                  'DEFICIENTE': 'text-red-600 bg-red-100'
                }

                return (
                  <tr key={escuela.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {escuela.nombre.replace('Escuela Secundaria Técnica No. ', 'EST ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {escuela.cct}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {escuela.region.replace('HUASTECA_', '')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {diagnosticosEscuela.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {puntajePromedio.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorNivel[nivel]}`}>
                        {nivel}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
