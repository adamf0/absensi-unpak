import axiosInstance from "@/module/axiosInstance";

export const UpdateJenisIzin = async (formData:any) => {
    try {
        const response = await axiosInstance.post('/jenis_izin/update', formData,{
            headers: {
              "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};