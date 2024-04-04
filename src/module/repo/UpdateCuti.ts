import axiosInstance from "../axiosInstance";

export const UpdateCuti = async (formData:any) => {
    try {
        const response = await axiosInstance.post('/cuti/update', formData);
        return response;
    } catch (error) {
        throw error;
    }
};