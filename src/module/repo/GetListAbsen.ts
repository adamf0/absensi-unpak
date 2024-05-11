import axiosInstance from "@/module/axiosInstance";

export const GetListAbsen = async (nidn: string|null = null, nip: string|null = null) => {
    try {
        const response = await axiosInstance.get(`/absen?nidn=${nidn}&nip=${nip}`);
        return response;
    } catch (error) {
        throw error;
    }
};