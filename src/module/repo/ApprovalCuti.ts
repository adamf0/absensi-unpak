import axiosInstance from "../axiosInstance";

export const ApprovalCuti = async (formData:any) => {
    try {
        const response = await axiosInstance.post('/cuti/approval', formData, {
            headers: {
              "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};