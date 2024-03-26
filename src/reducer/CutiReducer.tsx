import { CutiModel } from "../model/CutiModel";

export type ActionTypeCuti = { type: 'STORE_LIST'; list: CutiModel[] } | { type: 'TOGGLE_DETAIL'; id: number } | { type: 'CLOSE_DETAIL' };

export const reducerCuti = (state: CutiModel[], action: ActionTypeCuti): CutiModel[] => {
    switch (action.type) {
        case 'STORE_LIST':
            return state = action.list;
        case 'TOGGLE_DETAIL':
            return state.map((data, i) => ({
                ...data,
                openDetail: parseInt(data.id) === action.id
            }));
        case 'CLOSE_DETAIL':
            return state.map(data => ({
                ...data,
                openDetail: false
            }));
        default:
            return state;
    }
};