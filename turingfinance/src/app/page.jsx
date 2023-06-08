"use client"
import axios from 'axios';
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import Plot from 'react-plotly.js';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const {register, handleSubmit} = useForm();
  const [msg, setMsg] = useState('Olá! Coloque o input.');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);
  const [plot, setPlot] = useState();
  const [tickers, setTickers] = useState([]);

  const handleAddTicker = () => {
    const tickerInput = document.getElementById('ticker').value;
    setTickers([...tickers, tickerInput]);
    document.getElementById('ticker').value = ''; // clear the input field
  };

  const handleClearTickers = () => {
    setTickers([]);
  };

  const handleBuscar = (data) => {
    setLoading(true)
    setMsg("Buscando...")
    setErro(false)

    console.log(data)
    let endpoints = {
      1: 'histogram',
      2: 'rolling',
    }

    let endpoint = data['graph']
    delete data['graph']

  // Convert ticker string to array
  delete data['ticker']

  tickers.forEach(ticker => {
    data['ticker'] = tickers.join(',');  // Set the ticker value
    axios.get(`http://localhost:8000/api/${endpoints[endpoint]}`, {params: data})
    .then((res) => {
      setPlot(JSON.parse(res.data.plot))
      setMsg("Gráfico calculado!")
    })
    .catch((er) => {
      setErro(true)
      setMsg("Erro! Seu input está correto?")
    })
    .finally(() => {
      setLoading(false)
    })
  })
  }
  
  return (
    <main className="grid grid-cols-1 justify-center md:grid-cols-2 min-h-[95vh] place-items-center items-center flex-wrap pt-5 flex-col">
      <div className="w-full max-w-xs">
        <form onSubmit={handleSubmit(handleBuscar)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="graph">
              Gráfico
            </label>
            <select className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline" type="text" placeholder="ITUB3.SA" {...register("graph")} name="graph" id="graph">
              <option value="1">Histograma de Retornos Diários</option>
              <option value="2">Rolling STD</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ticker">
              Ticker
            </label>
            <input id="ticker" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="ITUB3.SA"/>
            <button onClick={handleAddTicker} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2" type="button">
              Adicionar Ticker
            </button>
            <button onClick={handleClearTickers} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2" type="button">
              Limpar Tickers
            </button>
            <div>
              <h3>Tickers selecionados:</h3>
              {tickers.map((ticker, index) => <p key={index}>{ticker}</p>)}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ini_date">
              Data de Início
            </label>
            <input {...register("ini_date")} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ini_date" type="date" placeholder="2020-01-01" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end_date">
              Data de Fim
            </label>
            <input {...register("end_date")} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="end_date" type="date" placeholder="2022-01-01"/>
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-64" type="submit" disabled={loading}>
              { loading ?  ( <span> <LoadingSpinner/> Buscando...</span> ) : 'Buscar'}
            </button>
          </div>
        </form>
        <p>{msg}</p>
      </div>
      <div className='max-w-full'>
        <Plot className='max-w-full' config={{responsive:false}} data={plot?.data || []} layout={plot?.layout || []}/>
      </div>
    </main>
  )
}
