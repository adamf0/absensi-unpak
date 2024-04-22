import axiosInstance from "@/module/axiosInstance";

export const GetJenisIzin = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/jenis_izin/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};