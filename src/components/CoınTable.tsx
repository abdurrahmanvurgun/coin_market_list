/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import axios from 'axios';
import {
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    LineElement,
    PointElement,
} from 'chart.js';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../redux/store';


ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export interface CoinType {
    [x: string]: any;
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    market_cap: number;
}

const CoinTable = () => {
    const coins = useSelector((state: RootState) => state.coin.coins) as CoinType[];
    const [clientCoins, setClientCoins] = useState<CoinType[]>([]);
    const [coinCharts, setCoinCharts] = useState<{ [key: string]: number[] }>({});
    const [isMounted, setIsMounted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const coinsPerPage = 15;

   useEffect(() => {
    if (!isMounted) {
        setIsMounted(true);
        setClientCoins(coins);
        coins.forEach(async (coin: CoinType) => {
            try {
                const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart`, {
                    params: { vs_currency: 'usd', days: 7 },
                });
                const prices = response.data.prices.map((price: number[]) => price[1]);
                setCoinCharts((prevCharts) => ({
                    ...prevCharts,
                    [coin.id]: prices,
                }));
            } catch {
            }
        });
        if (coins.length > 0) {
            toast.success('Coin verileri başarıyla yüklendi!');
        }

    }
}, [coins, isMounted]);

    if (!isMounted) return <div className="flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
    </div>;

    const indexOfLastCoin = currentPage * coinsPerPage;
    const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
    const currentCoins = clientCoins.slice(indexOfFirstCoin, indexOfLastCoin);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-100 border border-none shadow-md mt-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2  border-b border-orange-500">#</th>
                        <th className="py-2  border-b border-orange-500"></th>
                        <th className="py-2 px-4 border-b border-orange-500">Coin</th>
                        <th className="py-2  border-b border-orange-500"></th>
                        <th className="py-2 px-4 border-b border-orange-500">Price</th>
                        <th className="py-2 px-4 border-b border-orange-500">1sa %</th>
                        <th className="py-2 px-4 border-b border-orange-500">24sa %</th>
                        <th className="py-2 px-4 border-b border-orange-500">7g %</th>
                        <th className="py-2 px-4 border-b border-orange-500">Market Cap</th>
                        <th className="py-2 px-4 border-b border-orange-500">Price Chart (7 Days)</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCoins.map((coin: CoinType, index: number) => (
                        <tr key={coin.id}>
                            <td className="py-2 pl-4 border-b border-[#6e5270]">{(currentPage - 1) * coinsPerPage + index + 1}</td>
                            <td className="py-2 pl-4 border-b border-[#6e5270]"> <Image src={coin.image} alt={coin.name} width={24} height={24} /></td>
                            <td className="py-2  border-b border-[#6e5270]"> <p className='text-lg '> <strong>{coin.name}</strong></p></td>
                            <td className="py-2 pr-4 border-b border-[#6e5270]"><p className='text-gray-500'> {coin.symbol.toUpperCase()}</p></td>
                            <td className="py-2 px-4 border-b border-[#6e5270]">${coin.current_price.toLocaleString()}</td>
                            <td
                                className={`py-2 px-4 border-b border-[#6e5270] ${coin.price_change_percentage_1h_in_currency >= 0 ? 'text-green-500' : 'text-red-500'
                                    }`}
                            >
                                {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
                            </td>
                            <td
                                className={`py-2 px-4 border-b border-[#6e5270] ${coin.price_change_percentage_24h_in_currency >= 0 ? 'text-green-500' : 'text-red-500'
                                    }`}
                            >
                                {coin.price_change_percentage_24h_in_currency?.toFixed(2)}%
                            </td>
                            <td
                                className={`py-2 px-4 border-b border-[#6e5270] ${coin.price_change_percentage_7d_in_currency >= 0 ? 'text-green-500' : 'text-red-500'
                                    }`}
                            >
                                {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
                            </td>
                            <td className="py-2 px-4 border-b border-[#6e5270]">${coin.market_cap.toLocaleString()}</td>
                            <td className="py-2 px-4 border-b border-[#6e5270] size-9">
                                {coinCharts[coin.id] ? (
                                    <Line
                                        data={{
                                            labels: Array.from(
                                                { length: coinCharts[coin.id].length },
                                                (_, i) => `Day ${i + 1}`
                                            ),
                                            datasets: [
                                                {
                                                    label: `${coin.name} (Last 7 Days)`,
                                                    data: coinCharts[coin.id],
                                                    borderColor:
                                                        coinCharts[coin.id][0] <=
                                                            coinCharts[coin.id][coinCharts[coin.id].length - 1]
                                                            ? "rgba(34,197,94,1)"
                                                            : "rgba(239,68,68,1)",
                                                    borderWidth: 2,
                                                    pointRadius: 0,
                                                    tension: 0.4,
                                                },
                                            ],
                                        }}
                                        options={{
                                            plugins: {
                                                legend: { display: false },
                                                tooltip: {
                                                    callbacks: {
                                                        label: (context) => {
                                                            const value = context.raw as number;
                                                            return `$${value.toLocaleString()}`;
                                                        },
                                                    },
                                                },
                                            },
                                            scales: {
                                                x: { display: false },
                                                y: { display: false },
                                            },
                                            maintainAspectRatio: false,
                                        }}
                                        width={100}
                                        height={50}
                                    />
                                ) : (
                                    <div className="flex justify-center items-center">
                                        <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(clientCoins.length / coinsPerPage) }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`px-3 py-1 mx-1 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CoinTable;
