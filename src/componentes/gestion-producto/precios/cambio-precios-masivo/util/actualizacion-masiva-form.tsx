import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosConfig from '../../../../../utils/axiosConfig';
import CambioPreciosMasivoService from '../cambio-precios-masivo-service';

const apiUrl = axiosConfig.apiUrl;

export default function ActualizacionMasivaForm() {
  const [tipo, setTipo] = useState<'porcentaje' | 'monto'>('porcentaje');
  const [valor, setValor] = useState<number>(0);
  const [alcance, setAlcance] = useState<'linea' | 'global'>('global');
  const [lineaId, setLineaId] = useState<number | undefined>(undefined);
  const [motivo, setMotivo] = useState('');
  const [lineas, setLineas] = useState<{ id: number; denominacion: string }[]>([]);
  const [resultado, setResultado] = useState<{ actualizados: number; errores: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('Token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    axios.get(`${apiUrl}/linea/search-by?denominacion=&skip=0&take=100`, { headers })
      .then(res => setLineas(res.data?.data ?? []))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!motivo.trim()) { setError('El motivo es obligatorio.'); return; }
    if (alcance === 'linea' && !lineaId) { setError('Seleccioná una línea.'); return; }
    if (valor === 0) { setError('El valor no puede ser 0.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await CambioPreciosMasivoService.actualizarMasivo({
        tipo, valor, alcance, lineaId, motivo
      });
      setResultado(res);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Error al actualizar precios.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Actualización Masiva de Precios</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de ajuste</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={tipo}
            onChange={e => setTipo(e.target.value as 'porcentaje' | 'monto')}
          >
            <option value="porcentaje">Porcentaje (%)</option>
            <option value="monto">Monto fijo ($)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor {tipo === 'porcentaje' ? '(%)' : '($)'}
          </label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={valor}
            onChange={e => setValor(Number(e.target.value))}
            placeholder={tipo === 'porcentaje' ? 'Ej: 10 (para +10%)' : 'Ej: 50 (para +$50)'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alcance</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={alcance}
            onChange={e => setAlcance(e.target.value as 'linea' | 'global')}
          >
            <option value="global">Global (todos los productos)</option>
            <option value="linea">Por línea</option>
          </select>
        </div>

        {alcance === 'linea' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Línea</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={lineaId ?? ''}
              onChange={e => setLineaId(Number(e.target.value))}
            >
              <option value="">Seleccioná una línea</option>
              {lineas.map(l => (
                <option key={l.id} value={l.id}>{l.denominacion}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Motivo (obligatorio)</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            rows={3}
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            placeholder="Ej: Actualización por inflación de septiembre 2026"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Actualizando...' : 'Aplicar actualización'}
        </button>

        {resultado && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">✅ {resultado.actualizados} productos actualizados</p>
            {resultado.errores.length > 0 && (
              <div className="mt-2">
                <p className="text-red-600 font-medium">⚠ Errores:</p>
                <ul className="text-red-500 text-sm list-disc pl-4">
                  {resultado.errores.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}