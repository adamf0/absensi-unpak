import axiosInstance from "../axiosInstance";

export const GetJenisCuti = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/jenis_cuti/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};