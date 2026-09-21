import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosConfig from '../../../../utils/axiosConfig';

const apiUrl = axiosConfig.apiUrl;

interface HistorialPrecio {
  id: number;
  precioAnterior: number;
  precioNuevo: number;
  motivo: string;
  fecha: string;
  usuarioId?: number;
}

interface Props {
  productoId: number;
  denominacion: string;
  onClose: () => void;
}

export default function HistorialPrecios({ productoId, denominacion, onClose }: Props) {
  const [historial, setHistorial] = useState<HistorialPrecio[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchHistorial = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('Token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const { data } = await axios.get(
          `${apiUrl}/historial-precio/producto/${productoId}?skip=0&take=20`,
          { headers }
        );
        setHistorial(data.data ?? []);
        setTotal(data.total ?? 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, [productoId]);

  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  const formatPrecio = (precio: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(precio);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Historial de Precios</h2>
            <p className="text-sm text-gray-500">{denominacion}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="overflow-auto flex-1 p-4">
          {loading && <p className="text-gray-500 text-center py-4">Cargando...</p>}

          {!loading && historial.length === 0 && (
            <p className="text-gray-400 text-center py-8">
              No hay registros de cambios de precio para este producto.
            </p>
          )}

          {!loading && historial.length > 0 && (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-3 py-2 text-sm text-gray-600">Fecha</th>
                  <th className="text-right px-3 py-2 text-sm text-gray-600">Precio anterior</th>
                  <th className="text-right px-3 py-2 text-sm text-gray-600">Precio nuevo</th>
                  <th className="text-left px-3 py-2 text-sm text-gray-600">Motivo</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((h, i) => (
                  <tr key={h.id} className={`border-t ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="px-3 py-2 text-sm text-gray-600">{formatFecha(h.fecha)}</td>
                    <td className="px-3 py-2 text-sm text-right text-red-500">{formatPrecio(h.precioAnterior)}</td>
                    <td className="px-3 py-2 text-sm text-right text-green-600 font-medium">{formatPrecio(h.precioNuevo)}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{h.motivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t text-sm text-gray-500 text-right">
          Total de registros: {total}
        </div>
      </div>
    </div>
  );
}