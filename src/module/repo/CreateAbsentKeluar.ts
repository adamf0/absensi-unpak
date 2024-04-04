import axiosInstance from "../axiosInstance";

export const CreateAbsentKeluar = async (formData:any) => {
    try {
        const response = await axiosInstance.post('/absen/keluar', formData);
        return response;
    } catch (error) {
        throw error;
    }
};