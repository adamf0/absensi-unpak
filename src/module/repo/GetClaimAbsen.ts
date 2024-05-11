import axiosInstance from "@/module/axiosInstance";

export const GetClaimAbsen = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/claim_absen/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};