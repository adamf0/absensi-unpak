import axiosInstance from "../axiosInstance";

export const GetListJenisIzin = async () => {
    try {
        const response = await axiosInstance.get(`/jenis_izin`);
        return response;
    } catch (error) {
        throw error;
    }
};