import { useContext } from 'react';
import ThemeContext from '../context/themeContext';

export default function useUserRef() {
	const { userRef, setUserRef } = useContext(ThemeContext);

	return { userRef, setUserRef };
}
