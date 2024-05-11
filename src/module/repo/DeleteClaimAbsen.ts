import axiosInstance from "@/module/axiosInstance";

export const DeleteClaimAbsen = async (id:any) => {
    try {
        const response = await axiosInstance.get(`/claim_absen/delete/${id}`, {});
        return response;
    } catch (error) {
        throw error;
    }
};