'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCoins, getNFTs } from '../redux/slices/coinSlice';
import CoinTable from '@/components/CoınTable';
import {NFTCards} from '../components/NFTCards';
import { AppDispatch, RootState } from '../redux/store';
import CoinSlider from '@/components/CoinSlider';

const Home = () => {
    interface Coin {
        id: string;
        name: string;
        symbol: string;
        current_price: number;
        image: string;
    }
    const dispatch = useDispatch<AppDispatch>();
    const loading = useSelector((state: RootState) => state.coin.loading);
    const coins = useSelector((state: RootState) => state.coin.coins as Coin[]);

    useEffect(() => {
        dispatch(getCoins());
        dispatch(getNFTs());
    }, [dispatch]);

    return (
        <div className="p-4 bg-slate-50 text-black">
            <h1 className="text-2xl font-bold text-center">Coin ve NFT Listesi</h1>
            {loading ?  <div className="flex justify-center items-center">
                                        <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                                    </div> : (
                <div className='container m-auto'>
                    <section className="mt-8">
                        <h2 className="text-xl font-semibold">Coin Slider</h2>
                        <CoinSlider coins={coins} />
                    </section>
                    <section className="mt-8">
                        <h2 className="text-xl font-semibold">Coin Listesi</h2>
                        <CoinTable />
                    </section>
                    <section className="mt-8">
                        <h2 className="text-xl font-semibold">NFT Listesi</h2>
                        <NFTCards />
                    </section>
                </div>
            )}
        </div>
    );
};

export default Home;
