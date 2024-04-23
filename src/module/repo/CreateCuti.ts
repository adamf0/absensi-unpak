import axiosInstance from "@/module/axiosInstance";

export const CreateCuti = async (formData:any) => {
    try {
        const response = await axiosInstance.postForm('/cuti/create', formData, {
            headers: {
              "Content-Type": formData instanceof FormData? "multipart/form-data":"application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};