import axiosInstance from "@/module/axiosInstance";

export const CreateJenisIzin = async (formData:any) => {
    try {
        const response = await axiosInstance.postForm('/jenis_izin/create', formData, {
            headers: {
              "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};