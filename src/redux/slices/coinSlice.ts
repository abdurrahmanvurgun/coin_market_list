
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCoins, fetchNFTs } from '../../lib/api';


interface NFT {
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

interface NFTEvent {
    event_type: string;
    chain: string;
    transaction: string;
    from_address: string;
    to_address: string;
    quantity: number;
    nft: NFT;
    event_timestamp: number;
}

interface CoinState {
    coins: Array<unknown>;
    nfts: NFTEvent[];
    selectedNFT: NFT | null;
    loading: boolean;
}

const initialState: CoinState = {
    coins: [],
    nfts: [],
    selectedNFT: null,
    loading: false,
};
export const getCoins = createAsyncThunk('coin/getCoins', async () => {
    const data = await fetchCoins();
    return data;
});
export const getNFTs = createAsyncThunk('coin/getNFTs', async () => {
    const data = await fetchNFTs();
    return data.asset_events || []; 
});
const coinSlice = createSlice({
    name: 'coin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCoins.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCoins.fulfilled, (state, action) => {
                state.coins = action.payload;
                state.loading = false;
            })
            .addCase(getCoins.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getNFTs.pending, (state) => {
                state.loading = true;
            })
            .addCase(getNFTs.fulfilled, (state, action) => {
                state.nfts = action.payload;
                state.loading = false;
            })
            .addCase(getNFTs.rejected, (state) => {
                state.loading = false;
            })
    },
});

export default coinSlice.reducer;
