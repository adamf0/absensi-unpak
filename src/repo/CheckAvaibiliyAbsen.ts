import axiosInstance from "../axiosInstance";

export const CheckAvaibiliyAbsen = async () => {
    try {
        const response = await axiosInstance.get(`/absen/check/${localStorage.getItem('authData')}/${new Date().toISOString().slice(0, 10)}`);
        return response;
    } catch (error) {
        throw error;
    }
};