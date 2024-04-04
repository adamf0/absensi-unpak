import axiosInstance from "../axiosInstance";

export const GetListCuti = async (page: number) => {
    try {
        const response = await axiosInstance.get(`/cuti?page=${page}&pageSize=10`);
        return response;
    } catch (error) {
        throw error;
    }
};