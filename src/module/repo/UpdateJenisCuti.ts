import axiosInstance from "../axiosInstance";

export const UpdateJenisCuti = async (formData:any) => {
    try {
        const response = await axiosInstance.post('/jenis_cuti/update', formData,{
            headers: {
              "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};