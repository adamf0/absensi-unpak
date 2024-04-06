import { useContext } from 'react';
import ThemeContext from '../context/themeContext';

export default function useLevelMode() {
	const { levelMode, setLevelMode } = useContext(ThemeContext);

	return { levelMode, setLevelMode };
}
