import { useState, useEffect } from "react";
import { Superlinea } from "../../../interfaces/gestion-producto/superlinea/interfaces-superlinea";
import SuperLineaService from "./services/super-linea-service";

export default function ConsultarSuperLinea() {
  const [superLineas, setSuperLineas] = useState<Superlinea[]>([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await SuperLineaService.obtener({ skip: 0, take: 100 });
      setSuperLineas(res.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtradas = superLineas.filter(sl =>
    sl.denominacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta SuperLínea?')) return;
    try {
      await SuperLineaService.eliminar(id, 0);
      fetchData();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Error al eliminar.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">SuperLíneas</h1>
      </div>

      <input
        type="text"
        placeholder="Buscar por denominación..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
      />

      {loading && <p className="text-gray-500">Cargando...</p>}

      <table className="w-full border-collapse bg-white shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-3 text-gray-600">#</th>
            <th className="text-left px-4 py-3 text-gray-600">Denominación</th>
            <th className="text-left px-4 py-3 text-gray-600">Observación</th>
            <th className="text-center px-4 py-3 text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtradas.map((sl, index) => (
            <tr key={sl.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-500">{index + 1}</td>
              <td className="px-4 py-3 font-medium">{sl.denominacion}</td>
              <td className="px-4 py-3 text-gray-500">{sl.observacion ?? '-'}</td>
              <td className="px-4 py-3 text-center flex gap-2 justify-center">
                <button
                  onClick={() => handleEliminar(sl.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {!loading && filtradas.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-8 text-gray-400">
                No hay SuperLíneas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}