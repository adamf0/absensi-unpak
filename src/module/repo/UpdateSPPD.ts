import axiosInstance from "@/module/axiosInstance";

export const UpdateSPPD = async (formData:any) => {
    try {
        const response = await axiosInstance.post('/sppd/update', formData,{
            headers: {
              "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};