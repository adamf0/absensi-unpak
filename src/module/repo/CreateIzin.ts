import axiosInstance from "../axiosInstance";

export const CreateIzin = async (formData:any) => {
    try {
        const response = await axiosInstance.post('/izin/create', formData);
        return response;
    } catch (error) {
        throw error;
    }
};