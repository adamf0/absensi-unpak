import axiosInstance from "@/module/axiosInstance";

export const CreateSPPD = async (formData:any) => {
    try {
        const response = await axiosInstance.postForm('/sppd/create', formData, {
            headers: {
              "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};