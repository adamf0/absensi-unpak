import axiosInstance from "../axiosInstance";

export const GetListJenisCuti = async () => {
    try {
        const response = await axiosInstance.get(`/jenis_cuti`);
        return response;
    } catch (error) {
        throw error;
    }
};