import axiosInstance from "@/module/axiosInstance";

export const DeletePengguna = async (id:any) => {
    try {
        const response = await axiosInstance.get(`/pengguna/delete/${id}`, {});
        return response;
    } catch (error) {
        throw error;
    }
};