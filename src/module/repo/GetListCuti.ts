import axiosInstance from "../axiosInstance";

export const GetListCuti = async (page: number, nidn: string|null = null, nip: string|null = null) => {
    try {
        const response = await axiosInstance.get(`/cuti?nidn=${nidn}&page=${page}&pageSize=10`);
        return response;
    } catch (error) {
        throw error;
    }
};