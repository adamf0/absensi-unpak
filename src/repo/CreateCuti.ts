import axiosInstance from "../axiosInstance";

export const CreateCuti = async (formData:any) => {
    try {
        const response = await axiosInstance.post('/cuti/create', formData);
        return response;
    } catch (error) {
        throw error;
    }
};