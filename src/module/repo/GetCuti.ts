import axiosInstance from "../axiosInstance";

export const GetCuti = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/cuti/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};