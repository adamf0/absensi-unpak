import axiosInstance from "../axiosInstance";

export const GetAbsen = async (tanggal:string, nidn: string|null = null, nip: string|null = null) => {
    try {
        const response = await axiosInstance.get(`/absen/check/${nidn}/${tanggal}`);
        return response;
    } catch (error) {
        throw error;
    }
};