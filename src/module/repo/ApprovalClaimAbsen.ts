import axiosInstance from "@/module/axiosInstance";

export const ApprovalClaimAbsen = async (formData:any) => {
    try {
        const response = await axiosInstance.post('/claim_absen/approval', formData, {
            headers: {
              "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};