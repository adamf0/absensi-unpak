import axiosInstance from "@/module/axiosInstance";

export const CreateIzin = async (formData:any) => {
    try {
        const response = await axiosInstance.postForm('/izin/create', formData, {
            headers: {
              "Content-Type": formData instanceof FormData? "multipart/form-data":"application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};