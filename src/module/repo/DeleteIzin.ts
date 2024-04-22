import axiosInstance from "@/module/axiosInstance";

export const DeleteIzin = async (id:any) => {
    try {
        const response = await axiosInstance.get(`/izin/delete/${id}`, {});
        return response;
    } catch (error) {
        throw error;
    }
};