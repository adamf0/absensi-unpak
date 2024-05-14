import axiosInstance from "@/module/axiosInstance";

export const DeleteSPPD = async (id:any) => {
    try {
        const response = await axiosInstance.get(`/sppd/delete/${id}`, {});
        return response;
    } catch (error) {
        throw error;
    }
};