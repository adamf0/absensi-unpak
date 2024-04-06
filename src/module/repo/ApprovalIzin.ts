import axiosInstance from "../axiosInstance";

export const ApprovalIzin = async (formData:any) => {
    try {
        const response = await axiosInstance.post('/izin/approval', formData, {
            headers: {
              "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};