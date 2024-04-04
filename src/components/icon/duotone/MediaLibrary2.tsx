import React, { SVGProps } from 'react';

const SvgMediaLibrary2 = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M3.5 22h17a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0020.5 8H10L7.44 5.44A1.5 1.5 0 006.378 5H3.5A1.5 1.5 0 002 6.5v14A1.5 1.5 0 003.5 22z'
					fill='currentColor'
					opacity={0.3}
				/>
				<path
					d='M10.833 20C9.821 20 9 19.316 9 18.472s.82-1.528 1.833-1.528c.215 0 .42.031.611.087v-4.24c0-.313.196-.59.483-.683l3.514-1.075c.442-.144.892.2.892.684v1.075c0 .358-.335.587-.61.652-.397.095-1.416.299-3.056.612v4.448a.837.837 0 01-.013.152c-.11.757-.883 1.344-1.82 1.344z'
					fill='currentColor'
				/>
			</g>
		</svg>
	);
};

export default SvgMediaLibrary2;
