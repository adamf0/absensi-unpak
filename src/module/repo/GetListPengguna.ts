import axiosInstance from "../axiosInstance";

export const GetListPengguna = async (page: number) => {
    try {
        const response = await axiosInstance.get(`/pengguna?page=${page}&pageSize=10`);
        return response;
    } catch (error) {
        throw error;
    }
};