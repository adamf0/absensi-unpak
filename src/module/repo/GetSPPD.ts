import axiosInstance from "@/module/axiosInstance";

export const GetSPPD = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/sppd/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};