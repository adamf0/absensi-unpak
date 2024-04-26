import axiosInstance from "@/module/axiosInstance";

export const GetListCuti = async (page: number, nidn: string|null = null, nip: string|null = null) => {
    try {
        const response = await axiosInstance.get(`/cuti?nidn=${nidn}&nip=${nip}&page=${page}&pageSize=10`);
        return response;
    } catch (error) {
        throw error;
    }
};