import axiosInstance from "../axiosInstance";

export const DeleteJenisIzin = async (id:any) => {
    try {
        const response = await axiosInstance.get(`/jenis_izin/delete/${id}`, {});
        return response;
    } catch (error) {
        throw error;
    }
};