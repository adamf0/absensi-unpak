import axiosInstance from "@/module/axiosInstance";

export const UpdateIzin = async (formData:any) => {
    try {
        const response = await axiosInstance.post('/izin/update', formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};