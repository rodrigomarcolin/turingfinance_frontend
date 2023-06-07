"use client"
import axios from 'axios';
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import Plot from 'react-plotly.js';

export default function Home() {
  const {register, handleSubmit} = useForm();
  const [msg, setMsg] = useState('Olá! Coloque o input.');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);
  const [hist, setHist] = useState();

  const handleBuscar = (data) => {
    setLoading(true)
    setMsg("Buscando...")
    setErro(false)

    axios.get('http://localhost:8000/api/histogram', {params: data})
    .then((res) => {
      setHist(JSON.parse(res.data.hist))
      setMsg("Gráfico calculado!")
    })
    .catch((er) => {
      setErro(true)
      setMsg("Algum erro aconteceu. Tem certeza que seu input está correto?")
    })
    .finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    console.log('New hist:', hist?.data)
  }, [hist])

  return (
    <main className="flex min-h-screen items-center justify-center flex-wrap pt-5 flex-col">
      <div className="w-full max-w-xs">
        <form onSubmit={handleSubmit(handleBuscar)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ticker">
              Ticker
            </label>
            <input {...register("ticker")} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ticker" type="text" placeholder="ITUB3.SA"/>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ini_date">
              Data de Início
            </label>
            <input {...register("ini_date")} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ini_date" type="text" placeholder="2020-01-01" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end_date">
              Data de Fim
            </label>
            <input {...register("end_date")} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="end_date" type="text" placeholder="2022-01-01"/>
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Buscar
            </button>
          </div>
        </form>
        <p>{msg}</p>
      </div>

      <div className='max-w-full min-w-full'>
        <Plot className='max-w-full min-w-[90%]' config={{responsive:true}} data={hist?.data || []} layout={hist?.layout || []}/>
      </div>
    </main>
  )
}
