import axiosInstance from "@/module/axiosInstance";

export const CreateIzin = async (formData:any) => {
    try {
        const response = await axiosInstance.postForm('/izin/create', formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};