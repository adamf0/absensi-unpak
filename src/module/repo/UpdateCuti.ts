import axiosInstance from "../axiosInstance";

export const UpdateCuti = async (formData:any) => {
    try {
        const response = await axiosInstance.post('/cuti/update', formData,{
            headers: {
              "Content-Type": "multipart/form-data",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};