import axiosInstance from "../axiosInstance";

export const CreateIzin = async (formData:any) => {
    try {
        const response = await axiosInstance.post('/izin/create', formData, {
            headers: {
              "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};