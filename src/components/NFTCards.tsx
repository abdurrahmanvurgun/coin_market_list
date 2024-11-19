"use client"
import Image from 'next/image';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export interface NFT {
    identifier: string;
    collection: string;
    contract: string;
    token_standard: string;
    name: string;
    description: string;
    image_url: string | null;
    display_image_url: string | null;
    display_animation_url: string | null;
    metadata_url: string | null;
    opensea_url: string;
    updated_at: string;
    is_disabled: boolean;
    is_nsfw: boolean;
}

export interface NFTEvent {
    event_type: string;
    chain: string;
    transaction: string;
    from_address: string;
    to_address: string;
    quantity: number;
    nft: NFT;
    event_timestamp: number;
}


export const NFTCards = () => {
    const nfts = useSelector((state: RootState) => (state.coin.nfts));

    useEffect(() => {
        console.log("NFT verileri:", nfts);
    }, [nfts]);
    
    const filteredNFTs = nfts.filter((nft) => nft.nft.collection === "pixelatedpunks");
    const collectionName = filteredNFTs.length > 0 ? filteredNFTs[0].nft.collection : "Koleksiyon bulunamadı";

    return (
        <div>
            <h2 className='text-xl text-gray-400'>Collection : {collectionName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {nfts.map((nft, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow shadow-green-700">
                        {nft.nft.image_url ? (
                            <>
                                <Image
                                    src={nft.nft.image_url}
                                    alt={nft.nft.name || 'NFT Image'}
                                    width={400}
                                    height={500}
                                    className="w-full h-64 object-cover rounded-t-2xl"
                                />
                                <div className='px-2'>
                                    <h3 className="text-lg font-semibold">{nft.nft.name || 'NFT Name'}</h3>
                                    <p className='text-gray-500'><i>{nft.nft.description || 'N/A'}</i></p>
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-64 flex items-center justify-center bg-gray-200 mt-2">
                                <h1>No Image Available</h1>
                                <h3 className="text-lg font-semibold">{nft.nft.name || 'NFT Name'}</h3>
                                <p>ID: {nft.nft.description || 'N/A'}</p>
                                <span>Collection: {nft.nft.collection || 'N/A'}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NFTCards;
