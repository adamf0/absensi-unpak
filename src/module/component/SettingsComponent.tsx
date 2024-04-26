import Button from '@/components/ui/Button';
import ButtonGroup from '@/components/ui/ButtonGroup';
import Dropdown, { DropdownToggle, DropdownMenu, DropdownItem } from '@/components/ui/Dropdown';
import DARK_MODE from '@/constants/darkMode.constant';
import useDarkMode from '@/hooks/useDarkMode';
import useLevelMode from '@/hooks/useLevelMode';
import useUserRef from '@/hooks/useUserRef';
import { getLevel } from '@/module/CheckLevels';
import { getInfoUser } from '@/module/InfoUser';

const SettingsComponent = () => {
	// const { fontSize, setFontSize } = useFontSize();
	const { darkModeStatus, setDarkModeStatus } = useDarkMode();
	const { levelMode, setLevelMode } = useLevelMode();
	const { setUserRef } = useUserRef();

	return (
		<Dropdown>
			<DropdownToggle hasIcon={false}>
				<Button icon='HeroCog8Tooth' aria-label='Settings' />
			</DropdownToggle>
			<DropdownMenu placement='bottom-end'>
				{
					getLevel().length>0?
					<DropdownItem className='flex flex-col !items-start'>
						<div>Mode Level:</div>
						<ButtonGroup>
							{
								getLevel().map((level:string)=><Button
									key={level}
									children={level}
									onClick={() => {
										setLevelMode(level)
										if(level=="pegawai"){
											setUserRef(getInfoUser("nip"))
										} else if(level=="dosen"){
											setUserRef(getInfoUser("NIDN"))
										} else{
											setUserRef(getInfoUser("id"))
										}
									}}
									isActive={level===levelMode}
								/>)
							}
						</ButtonGroup>
					</DropdownItem>:null
				}
				<DropdownItem className='flex flex-col !items-start'>
					<div>Dark Mode:</div>
					<ButtonGroup>
						<Button
							icon='HeroMoon'
							onClick={() => setDarkModeStatus(DARK_MODE.DARK)}
							isActive={darkModeStatus === DARK_MODE.DARK}
						/>
						<Button
							icon='HeroSun'
							onClick={() => setDarkModeStatus(DARK_MODE.LIGHT)}
							isActive={darkModeStatus === DARK_MODE.LIGHT}
						/>
						<Button
							icon='HeroComputerDesktop'
							onClick={() => setDarkModeStatus(DARK_MODE.SYSTEM)}
							isActive={darkModeStatus === DARK_MODE.SYSTEM}
						/>
					</ButtonGroup>
				</DropdownItem>
				{/* <DropdownItem className='flex flex-col !items-start'>
					<ButtonGroup>
						<Button
							icon='HeroMoon'
							onClick={() => {}}
						/>
					</ButtonGroup>
				</DropdownItem> */}
			</DropdownMenu>
		</Dropdown>
	);
};

export default SettingsComponent;
