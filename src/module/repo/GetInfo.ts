import axiosInstance from "../axiosInstance";

export const GetInfo = async (nidn: string|null = null, nip: string|null = null, tanggal_awal: string|null = null, tanggal_akhir: string|null = null) => {
    try {
        const response = await axiosInstance.get(`/info?nidn=${nidn}&tanggal_awal=${tanggal_awal}&tanggal_akhir=${tanggal_akhir}`);
        return response;
    } catch (error) {
        throw error;
    }
};