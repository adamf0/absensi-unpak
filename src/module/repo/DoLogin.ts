import axiosInstance from "@/module/axiosInstance";

export const DoLogin = async (formData:any) => {
    try {
        const response = await axiosInstance.post('/auth/login', formData);
        return response;
    } catch (error) {
        throw error;
    }
};