import axiosInstance from "../axiosInstance";

export const GetPengguna = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/pengguna/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};