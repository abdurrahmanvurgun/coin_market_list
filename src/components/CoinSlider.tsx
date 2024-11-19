"use client";

import axios from "axios";
import {
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from "chart.js";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

interface Coin {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    image: string;
}

interface Props {
    coins: Coin[];
}

const CoinSlider: React.FC<Props> = ({ coins }) => {
    const [coinCharts, setCoinCharts] = useState<{ [key: string]: number[] }>({});

    useEffect(() => {
        const fetchChartData = async () => {
            for (const coin of coins) {
                try {
                    const response = await axios.get(
                        `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart`,
                        {
                            params: { vs_currency: "usd", days: 7 },
                        }
                    );
                    const prices = response.data.prices.map((price: number[]) => price[1]);
                    setCoinCharts((prevCharts) => ({
                        ...prevCharts,
                        [coin.id]: prices,
                    }));
                } catch (error) {
                    console.error(`Failed to fetch chart data for ${coin.id}`, error);
                }
            }
        };

        fetchChartData();
    }, [coins]);

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Top Coins</h2>
            <Swiper
                modules={[Autoplay]}
                spaceBetween={30}
                slidesPerView={3}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: true }}
                centeredSlides={true}
                speed={500}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
            >
                {coins.map((coin) => (
                    <SwiperSlide key={coin.id}>
                        <div className="bg-gradient-to-r from-purple-200 to-pink-200  rounded-xl shadow-md p-4 flex flex-row items-center gap-4 relative overflow-hidden">

                            <span
                                className="absolute inset-x-0 left-0 h-full w-3 bg-gradient-to-r from-purple-200 to-pink-200 border-r-pink-500 border"
                            ></span>
                            <div className="w-2/4 text-center">
                                <Image
                                    src={coin.image}
                                    alt={coin.name}
                                    width={48}
                                    height={48}
                                    className="mx-auto"
                                />
                                
                                <p className="text-gray-500">{coin.symbol.toUpperCase()}</p>
                                <h3 className="text-lg font-semibold mt-2 text-nowrap">{coin.name}</h3>
                            </div>
                            <div className="w-2/4">
                                <p className="text-green-600 text-right">
                                    Price: ${coin.current_price.toFixed(2)}
                                </p>
                                {coinCharts[coin.id] ? (
                                    <div className="w-full h-1/2">
                                        <Line
                                            data={{
                                                labels: Array.from(
                                                    { length: coinCharts[coin.id].length },
                                                    (_, i) => `Day ${i + 1}`
                                                ),
                                                datasets: [
                                                    {
                                                        data: coinCharts[coin.id],
                                                        borderColor:
                                                            coinCharts[coin.id][0] <=
                                                                coinCharts[coin.id][coinCharts[coin.id].length - 1]
                                                                ? "rgba(34,197,94,1)" // Yeşil çizgi
                                                                : "rgba(239,68,68,1)", // Kırmızı çizgi
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
                                                                return `$${value.toFixed(2)}`;
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
                                            height={50}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center">
                                        <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CoinSlider;
