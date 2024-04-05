import axiosInstance from "../axiosInstance";

export const CreateAbsentMasuk = async (formData:any) => {
    try {
        const response = await axiosInstance.post('/absen/masuk', formData, {
            headers: {
              "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};