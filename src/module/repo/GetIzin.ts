import axiosInstance from "@/module/axiosInstance";

export const GetIzin = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/izin/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};