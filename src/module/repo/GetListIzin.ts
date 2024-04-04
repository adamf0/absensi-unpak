import axiosInstance from "../axiosInstance";

export const GetListIzin = async (page: number) => {
    try {
        const response = await axiosInstance.get(`/izin?page=${page}&pageSize=10`);
        return response;
    } catch (error) {
        throw error;
    }
};