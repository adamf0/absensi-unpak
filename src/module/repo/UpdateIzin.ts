import axiosInstance from "../axiosInstance";

export const UpdateIzin = async (formData:any) => {
    try {
        const response = await axiosInstance.post('/izin/update', formData, {
            headers: {
              "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};