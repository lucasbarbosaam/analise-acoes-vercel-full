import { useState } from "react";

export default function Home() {
  const [ticker, setTicker] = useState("AAPL");
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analise/${ticker}`);
      const json = await res.json();
      setDados(json);
    } catch {
      setDados({ erro: "Erro ao buscar dados" });
    } finally {
      setLoading(false);
    }
  };

  const Pillar = ({ id, resultado }) => (
    <div className="border rounded-lg p-4 shadow text-center">
      <h3 className="font-semibold text-lg">Pilar {id}</h3>
      <p className={`text-xl font-bold mt-2 ${resultado === "Aprovado" ? "text-green-600" : "text-red-600"}`}>
        {resultado}
      </p>
    </div>
  );

  return (
    <main className="max-w-2xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold text-center mb-4">Análise de Ações</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1 rounded"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Digite o ticker (ex: AAPL)"
        />
        <button
          onClick={buscar}
          disabled={loading}
          className="bg-blue-600 text-white px-4
